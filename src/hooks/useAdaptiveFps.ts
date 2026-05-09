"use client";

import { useEffect, useRef, useState } from "react";

export type WebGlTier = "high" | "medium" | "low";

/**
 * Adaptive Quality — يقدّر معدل الإطارات ويُرجع مستوى جودة للـ DPR والظلال.
 */
export function useAdaptiveFps(enabled: boolean): {
  tier: WebGlTier;
  dpr: [number, number];
  shadows: boolean;
} {
  const [tier, setTier] = useState<WebGlTier>("high");
  const frames = useRef<number[]>([]);
  const last = useRef(performance.now());

  useEffect(() => {
    if (!enabled) return;

    let raf = 0;
    const loop = (t: number) => {
      const dt = t - last.current;
      last.current = t;
      if (dt > 0 && dt < 200) {
        frames.current.push(1000 / dt);
        if (frames.current.length > 45) frames.current.shift();
      }
      if (frames.current.length >= 30) {
        const avg =
          frames.current.reduce((a, b) => a + b, 0) / frames.current.length;
        if (avg < 35) setTier("low");
        else if (avg < 50) setTier("medium");
        else setTier("high");
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  if (!enabled) {
    return { tier: "high", dpr: [1, 1.5] as [number, number], shadows: true };
  }

  if (tier === "low") {
    return { tier, dpr: [1, 1], shadows: false };
  }
  if (tier === "medium") {
    return { tier, dpr: [1, 1.25] as [number, number], shadows: true };
  }
  return { tier, dpr: [1, 2] as [number, number], shadows: true };
}
