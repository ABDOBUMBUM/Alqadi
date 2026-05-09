"use client";

/** بديل خفيف عند تعطيل WebGL — فيديو WebM شفاف يمكن وضعه في public/fallback-scene.webm */
export function StaticBackdrop() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 marble-bg" />
      <video
        className="h-full w-full object-cover opacity-40 mix-blend-screen"
        autoPlay
        muted
        loop
        playsInline
        poster=""
      >
        <source src="/fallback-scene.webm" type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-bg-deep/20 via-transparent to-bg-deep" />
    </div>
  );
}
