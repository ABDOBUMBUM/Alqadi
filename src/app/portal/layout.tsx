"use client";

import React, { useState, useEffect } from "react";
import { Cairo } from "next/font/google";

const cairo = Cairo({ subsets: ["latin", "arabic"], weight: ["400", "500", "600", "700"] });

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Theme state for the portal (independent of main site)
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Allow toggling theme via context or simple state pass-down in the future
  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark bg-slate-900 text-white" : "bg-slate-50 text-slate-900"} ${cairo.className}`}>
      {/* 
        We don't include the main SiteHeader or Footer here.
        This gives us a completely isolated, clean slate for the ERP system.
      */}
      {children}
    </div>
  );
}
