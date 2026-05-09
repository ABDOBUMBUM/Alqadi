"use client";

/** Shader رخامي خفيف — طبقة CSS متحركة كبديل أخف عن مشهد كامل */
export function MarbleAnimatedLayer() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.07] mix-blend-overlay"
      aria-hidden
      style={{
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 2px,
          rgba(201, 162, 39, 0.08) 2px,
          rgba(201, 162, 39, 0.08) 3px
        )`,
        animation: "marbleShift 28s linear infinite",
      }}
    />
  );
}
