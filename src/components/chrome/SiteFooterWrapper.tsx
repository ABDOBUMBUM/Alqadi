"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "./SiteFooter";

export function SiteFooterWrapper() {
  const pathname = usePathname();
  const isPortal = pathname?.startsWith("/portal") || pathname?.startsWith("/admin");

  if (isPortal) return null;

  return <SiteFooter />;
}
