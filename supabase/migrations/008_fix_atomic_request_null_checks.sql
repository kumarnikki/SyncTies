-- SyncTies Migration 008: Fix NULL checks in create_connection_request_atomic
-- Prevents foreign key constraint violations when recipient or student is not in public.profiles.
-- In SQL/PLpgSQL, (NULL <> 'alum') evaluates to NULL (falsy in IF statements),
-- which caused missing profiles to bypass validation and trigger foreign key violations.

CREATE OR REPLACE FUNCTION public.create_connection_request_atomic(
  p_student_id UUID,
  p_alum_id UUID,
  p_intent_id UUID,
  p_offer_id UUID,
  p_student_message TEXT,
  p_repeat_reason TEXT DEFAULT NULL,
  p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_month DATE := date_trunc('month', CURRENT_DATE)::DATE;
  v_student_role TEXT;
  v_student_tokens INT;
  v_alum_role TEXT;
  v_alum_limit INT;
  v_alum_reserved INT;
  v_alum_processed INT;
  v_is_repeat BOOLEAN := false;
  v_intent_title TEXT;
  v_new_request_id UUID;
  v_new_goal_id UUID;
  v_expiry_days INT := 14;
BEGIN
  -- 1. Check idempotency if key provided
  IF p_idempotency_key IS NOT NULL THEN
    SELECT id INTO v_new_request_id
    FROM public.connection_requests
    WHERE idempotency_key = p_idempotency_key;

    IF v_new_request_id IS NOT NULL THEN
      RETURN jsonb_build_object(
        'success', true,
        'request_id', v_new_request_id,
        'message', 'Request already processed (idempotent)'
      );
    END IF;
  END IF;

  -- 2. Validate Student (with explicit NULL check)
  SELECT role INTO v_student_role
  FROM public.profiles
  WHERE id = p_student_id AND is_active = true;

  IF v_student_role IS NULL OR v_student_role <> 'student' THEN
    RAISE EXCEPTION 'Only active students can initiate connection requests';
  END IF;

  -- 3. Validate Alumnus (with explicit NULL check)
  SELECT role INTO v_alum_role
  FROM public.profiles
  WHERE id = p_alum_id AND is_active = true;

  IF v_alum_role IS NULL OR v_alum_role <> 'alum' THEN
    RAISE EXCEPTION 'Target recipient must be an active alumnus';
  END IF;

  IF p_student_id = p_alum_id THEN
    RAISE EXCEPTION 'Cannot send connection request to yourself';
  END IF;

  -- 4. Validate Intent
  SELECT title INTO v_intent_title
  FROM public.intents
  WHERE id = p_intent_id AND user_id = p_student_id AND status = 'open';

  IF v_intent_title IS NULL THEN
    RAISE EXCEPTION 'Intent must exist, belong to the student, and be in open status';
  END IF;

  -- 5. Prevent Duplicate Pending/Active Request for the same pair and intent
  IF EXISTS (
    SELECT 1 FROM public.connection_requests
    WHERE student_id = p_student_id
      AND alum_id = p_alum_id
      AND intent_id = p_intent_id
      AND status IN ('pending', 'accepted')
  ) THEN
    RAISE EXCEPTION 'An active or pending connection request already exists for this intent';
  END IF;

  -- 6. Check Repeat Contact in Current Month
  IF EXISTS (
    SELECT 1 FROM public.connection_requests
    WHERE student_id = p_student_id
      AND alum_id = p_alum_id
      AND created_at >= v_current_month::TIMESTAMPTZ
  ) THEN
    v_is_repeat := true;
    IF p_repeat_reason IS NULL OR length(trim(p_repeat_reason)) < 5 THEN
      RAISE EXCEPTION 'Repeat contact requires an explicit justification';
    END IF;
  END IF;

  -- 7. ATOMIC TOKEN CHECK & LOCK (FOR UPDATE)
  -- Ensure student token row exists for the month
  INSERT INTO public.student_monthly_tokens (user_id, period_start, tokens_granted, tokens_spent)
  VALUES (p_student_id, v_current_month, 5, 0)
  ON CONFLICT (user_id, period_start) DO NOTHING;

  SELECT (tokens_granted - tokens_spent) INTO v_student_tokens
  FROM public.student_monthly_tokens
  WHERE user_id = p_student_id AND period_start = v_current_month
  FOR UPDATE;

  IF v_student_tokens <= 0 THEN
    RAISE EXCEPTION 'Insufficient monthly tokens. Monthly token grant balance is 0';
  END IF;

  -- 8. ATOMIC CAPACITY CHECK & LOCK (FOR UPDATE)
  -- Ensure alumni capacity row exists for the month
  INSERT INTO public.alumni_capacity_monthly (user_id, period_start, monthly_limit, reserved_count, processed_count)
  VALUES (p_alum_id, v_current_month, 3, 0, 0)
  ON CONFLICT (user_id, period_start) DO NOTHING;

  SELECT monthly_limit, reserved_count, processed_count
  INTO v_alum_limit, v_alum_reserved, v_alum_processed
  FROM public.alumni_capacity_monthly
  WHERE user_id = p_alum_id AND period_start = v_current_month
  FOR UPDATE;

  IF (v_alum_limit - (v_alum_reserved + v_alum_processed)) <= 0 THEN
    RAISE EXCEPTION 'Alumnus has reached their monthly review capacity limit';
  END IF;

  -- 9. DEBIT TOKEN & INSERT IMMUTABLE LEDGER
  UPDATE public.student_monthly_tokens
  SET tokens_spent = tokens_spent + 1, updated_at = now()
  WHERE user_id = p_student_id AND period_start = v_current_month;

  -- 10. RESERVE CAPACITY SLOT
  UPDATE public.alumni_capacity_monthly
  SET reserved_count = reserved_count + 1, updated_at = now()
  WHERE user_id = p_alum_id AND period_start = v_current_month;

  -- 11. CREATE CONNECTION REQUEST
  INSERT INTO public.connection_requests (
    student_id,
    alum_id,
    intent_id,
    offer_id,
    status,
    student_message,
    repeat_contact_in_month,
    repeat_reason,
    idempotency_key,
    token_cost,
    expires_at
  ) VALUES (
    p_student_id,
    p_alum_id,
    p_intent_id,
    p_offer_id,
    'pending',
    p_student_message,
    v_is_repeat,
    p_repeat_reason,
    p_idempotency_key,
    1,
    now() + (v_expiry_days || ' days')::INTERVAL
  ) RETURNING id INTO v_new_request_id;

  -- Record token debit in immutable ledger
  INSERT INTO public.token_ledger (
    user_id,
    amount,
    entry_type,
    request_id,
    notes
  ) VALUES (
    p_student_id,
    -1,
    'debit',
    v_new_request_id,
    CASE WHEN v_is_repeat THEN 'Connection request (Repeat Contact)' ELSE 'Connection request outreach' END
  );

  -- 12. CREATE COLLABORATIVE GOAL RECORD
  INSERT INTO public.goals (
    request_id,
    student_id,
    alum_id,
    title,
    description,
    status
  ) VALUES (
    v_new_request_id,
    p_student_id,
    p_alum_id,
    v_intent_title,
    p_student_message,
    'open'
  ) RETURNING id INTO v_new_goal_id;

  -- 13. NOTIFY ALUMNUS
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    body,
    link
  ) VALUES (
    p_alum_id,
    'new_request',
    CASE WHEN v_is_repeat THEN 'Repeat Connection Request' ELSE 'New Connection Request' END,
    'A student has requested a connection for goal: "' || v_intent_title || '"',
    '/alumni/requests'
  );

  -- 14. RECORD ANALYTICS EVENT
  INSERT INTO public.analytics_events (
    user_id,
    event_name,
    metadata
  ) VALUES (
    p_student_id,
    'connection_requested',
    jsonb_build_object(
      'request_id', v_new_request_id,
      'alum_id', p_alum_id,
      'intent_id', p_intent_id,
      'is_repeat', v_is_repeat
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'request_id', v_new_request_id,
    'goal_id', v_new_goal_id,
    'tokens_remaining', v_student_tokens - 1,
    'is_repeat', v_is_repeat
  );
END;
$$;
