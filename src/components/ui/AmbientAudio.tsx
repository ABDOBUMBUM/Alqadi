"use client";

import { useEffect, useRef } from "react";
import { useSiteExperience } from "@/context/SiteExperienceContext";

/** صوت بيئة اختياري — يُفعّل بعد موافقة المستخدم؛ ضع ملفاً في public أو عبر URL */
export function AmbientAudio() {
  const { soundEnabled } = useSiteExperience();
  const ref = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_AMBIENT_AUDIO_URL;
    if (!url || !soundEnabled || !ref.current) return;
    ref.current.src = url;
    ref.current.volume = 0.15;
    void ref.current.play().catch(() => {});
    return () => {
      ref.current?.pause();
    };
  }, [soundEnabled]);

  return (
    <audio ref={ref} loop className="hidden" preload="none">
      <track kind="captions" />
    </audio>
  );
}
