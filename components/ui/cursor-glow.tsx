"use client";

import React, { useEffect, useState, useRef } from "react";

export function CursorGlow() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Mouse coords
  const mousePos = useRef({ x: -100, y: -100 });
  // Lerped coords for smooth trailing
  const trailingPos = useRef({ x: -100, y: -100 });
  const auraPos = useRef({ x: -100, y: -100 });

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on desktop pointer devices with fine control
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isFinePointer || prefersReducedMotion) {
      return;
    }

    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check if cursor is over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = !!target.closest(
          "a, button, input, select, textarea, [role='button'], .btn, .badge, .panel, .match-card, .metric-card, .role-card, .chip-picker button, .tabs button, .step-dots span"
        );
        setIsHovered(interactive);
      }
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Smooth animation loop
    let animId: number;
    const animate = () => {
      // Direct position for precision dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
      }

      // Smooth lerp for outer ring (speed 0.18)
      trailingPos.current.x += (mousePos.current.x - trailingPos.current.x) * 0.18;
      trailingPos.current.y += (mousePos.current.y - trailingPos.current.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trailingPos.current.x}px, ${trailingPos.current.y}px, 0)`;
      }

      // Even smoother lerp for ambient aura (speed 0.08)
      auraPos.current.x += (mousePos.current.x - auraPos.current.x) * 0.08;
      auraPos.current.y += (mousePos.current.y - auraPos.current.y) * 0.08;
      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${auraPos.current.x}px, ${auraPos.current.y}px, 0)`;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  if (!mounted) return null;

  return (
    <>
      {/* 1. Ambient Mouse Glow Aura (Smooth luminous sphere following cursor) */}
      <div
        ref={auraRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-10 transition-opacity duration-500 ease-out will-change-transform"
        style={{
          width: 420,
          height: 420,
          marginLeft: -210,
          marginTop: -210,
          opacity: isVisible ? (isHovered ? 0.35 : 0.22) : 0,
          background:
            "radial-gradient(circle, rgba(53, 99, 255, 0.18) 0%, rgba(124, 92, 231, 0.09) 35%, rgba(56, 185, 216, 0.04) 60%, transparent 75%)",
          filter: "blur(24px)",
        }}
      />

      {/* 2. Sleek Magnetic Follower Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-50 transition-opacity duration-300 will-change-transform"
        style={{
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div
          className="rounded-full border transition-all duration-200 ease-out"
          style={{
            width: isHovered ? 48 : isPressed ? 24 : 34,
            height: isHovered ? 48 : isPressed ? 24 : 34,
            marginLeft: isHovered ? -24 : isPressed ? -12 : -17,
            marginTop: isHovered ? -24 : isPressed ? -12 : -17,
            borderColor: isHovered
              ? "rgba(53, 99, 255, 0.65)"
              : "rgba(53, 99, 255, 0.32)",
            backgroundColor: isHovered
              ? "rgba(53, 99, 255, 0.07)"
              : isPressed
              ? "rgba(53, 99, 255, 0.15)"
              : "transparent",
            boxShadow: isHovered
              ? "0 0 16px rgba(53, 99, 255, 0.25), inset 0 0 10px rgba(53, 99, 255, 0.08)"
              : "none",
            backdropFilter: isHovered ? "blur(1px)" : "none",
            transform: isPressed ? "scale(0.9)" : "scale(1)",
          }}
        />
      </div>

      {/* 3. Central Precision Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-50 transition-opacity duration-200 will-change-transform"
        style={{
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div
          className="rounded-full bg-[#3563ff] transition-transform duration-150 ease-out"
          style={{
            width: 5,
            height: 5,
            marginLeft: -2.5,
            marginTop: -2.5,
            transform: isHovered ? "scale(1.5)" : isPressed ? "scale(0.7)" : "scale(1)",
            boxShadow: "0 0 8px rgba(53, 99, 255, 0.8), 0 0 2px #fff",
          }}
        />
      </div>
    </>
  );
}
