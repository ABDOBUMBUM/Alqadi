"use client";

import { useRef, useState } from "react";

/** معاينة 360 بسيطة — استبدل الخلفية بصورة بانوراما عند التوفر */
export function Panorama360() {
  const ref = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(50);

  return (
    <div
      ref={ref}
      className="relative h-56 w-full cursor-ew-resize overflow-hidden rounded-2xl border border-gold-500/25 md:h-72"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setX(((e.clientX - r.left) / r.width) * 100);
      }}
      role="img"
      aria-label="معاينة وجهة سياحية — سحب أفقي"
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-bg-deep via-gold-500/10 to-bg-deep"
        style={{
          backgroundImage:
            "radial-gradient(circle at " +
            x +
            "% 50%, rgba(232,197,71,0.25), transparent 55%)",
        }}
      />
      <p className="absolute bottom-3 start-3 text-[10px] text-muted">
        اسحب أفقياً — صورة بانوراما حقيقية تُضاف لاحقاً
      </p>
    </div>
  );
}
