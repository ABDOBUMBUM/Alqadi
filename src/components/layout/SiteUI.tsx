"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/chrome/SiteHeader";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { GoldParticleCanvas } from "@/components/ui/GoldParticleCanvas";
import { WhatsAppFloat } from "@/components/ui/WhatsAppFloat";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

export function SiteUI() {
  const pathname = usePathname();
  const isPortal = pathname?.startsWith("/portal") || pathname?.startsWith("/admin");

  if (isPortal) return null;

  return (
    <>
      <ScrollProgress />
      <GrainOverlay />
      <GoldParticleCanvas />
      <WhatsAppFloat />
      <SiteHeader />
    </>
  );
}
