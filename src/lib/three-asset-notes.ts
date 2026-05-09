/**
 * Draco / Meshopt — عند استيراد ملفات .glb استخدم:
 * - `useGLTF(url, true)` مع مسار Draco من drei
 * - أو `gltf-pipeline -d` مسبقاً لضغط الملفات في CI
 *
 * مثال (عند إضافة نموذج حقيقي):
 * useGLTF("/models/hero.glb", true) // Draco عبر drei
 */

export const ASSET_AUDIT = [
  {
    id: "luxury-scroll-canvas",
    source: "procedural / three.js primitives",
    license: "project original",
    updated: "2026-04-18",
  },
] as const;
