"use client";

import { useEffect } from "react";

const SECTIONS = ["#story-travel", "#tourism", "#manpower", "#contact"] as const;

export function KeyboardShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      ) {
        return;
      }

      if (e.key === "Escape") {
        document.querySelector<HTMLElement>("[data-modal-open]")?.click();
      }

      if (e.key >= "1" && e.key <= "4" && (e.altKey || e.metaKey)) {
        e.preventDefault();
        const i = Number.parseInt(e.key, 10) - 1;
        const id = SECTIONS[i];
        if (id) document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
      }

      if (e.key === "h" && (e.altKey || e.metaKey)) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
}
