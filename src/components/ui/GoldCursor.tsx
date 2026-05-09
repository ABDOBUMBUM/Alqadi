"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Custom Gold Cursor — luxury trailing dot + ring
 * Inspired by the reference alqadi_website.html custom cursor system
 */
export function GoldCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ cx: 0, cy: 0, rx: 0, ry: 0 });

  useEffect(() => {
    // Only on desktop
    if ("ontouchstart" in window) return;

    const onMove = (e: MouseEvent) => {
      pos.current.cx = e.clientX;
      pos.current.cy = e.clientY;
    };
    document.addEventListener("mousemove", onMove, { passive: true });

    let raf: number;
    const tick = () => {
      const p = pos.current;
      p.rx += (p.cx - p.rx) * 0.15;
      p.ry += (p.cy - p.ry) * 0.15;
      if (dotRef.current) {
        dotRef.current.style.left = `${p.cx}px`;
        dotRef.current.style.top = `${p.cy}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${p.rx}px`;
        ringRef.current.style.top = `${p.ry}px`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Hover expansion on interactive elements
    const enter = () => {
      if (dotRef.current) {
        dotRef.current.style.width = "20px";
        dotRef.current.style.height = "20px";
        dotRef.current.style.background = "#F5D68A";
      }
      if (ringRef.current) {
        ringRef.current.style.width = "50px";
        ringRef.current.style.height = "50px";
        ringRef.current.style.opacity = "0.3";
      }
    };
    const leave = () => {
      if (dotRef.current) {
        dotRef.current.style.width = "12px";
        dotRef.current.style.height = "12px";
        dotRef.current.style.background = "#C9A84C";
      }
      if (ringRef.current) {
        ringRef.current.style.width = "36px";
        ringRef.current.style.height = "36px";
        ringRef.current.style.opacity = "0.6";
      }
    };

    const targets = document.querySelectorAll(
      "a, button, .feature-card, .dest-card, .gold-glow-card, [role='button']"
    );
    targets.forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    document.body.style.cursor = "none";

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMove);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: "fixed",
          width: 12,
          height: 12,
          background: "#C9A84C",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%, -50%)",
          transition: "width 0.3s, height 0.3s, background 0.3s",
          mixBlendMode: "screen",
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: "fixed",
          width: 36,
          height: 36,
          border: "1px solid #C9A84C",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
          transform: "translate(-50%, -50%)",
          transition: "all 0.15s ease",
          opacity: 0.6,
        }}
      />
    </>
  );
}
