/**
 * Feature flags — عبر متغيرات البيئة أو التخزين المحلي للحملات والمناطق.
 */
export function getFeatureFlags() {
  const env = process.env.NEXT_PUBLIC_FEATURE_FLAGS ?? "";
  const parsed = new Set(
    env
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );

  return {
    heavy3D: !parsed.has("disable_3d"),
    webgpuExperimental: parsed.has("webgpu"),
    cabinHotspots: !parsed.has("disable_cabin_hotspots"),
    analytics: parsed.has("analytics"),
    abTestHero: parsed.has("ab_hero"),
  };
}
