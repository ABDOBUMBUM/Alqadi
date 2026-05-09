"use client";

import { useMemo } from "react";

export const STORY_PHASES = [
  { id: "travel", label: "السفر", href: "#story-travel" },
  { id: "tourism", label: "السياحة", href: "#tourism" },
  { id: "manpower", label: "التوظيف", href: "#manpower" },
  { id: "contact", label: "تواصل", href: "#contact" },
] as const;

/**
 * يحوّل تقدّم التمرير 0..1 إلى مرحلة قصة نشطة (0..3).
 */
export function useStoryPhase(scroll: number) {
  return useMemo(() => {
    const i = Math.min(
      STORY_PHASES.length - 1,
      Math.floor(scroll * STORY_PHASES.length),
    );
    return { index: i, phase: STORY_PHASES[i], depth: scroll };
  }, [scroll]);
}
