/**
 * WebGPU (تجريبي) — مسار بديل محتمل لـ Three.js على أجهزة قوية.
 * التفعيل الفعلي يتطلب WebGPURenderer واختباراً موسعاً؛ حالياً نُبقي fallback على WebGL.
 */
export function isWebGpuPreferred(): boolean {
  if (typeof window === "undefined") return false;
  const flags = process.env.NEXT_PUBLIC_FEATURE_FLAGS ?? "";
  return flags.includes("webgpu") && "gpu" in navigator;
}
