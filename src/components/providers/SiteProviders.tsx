"use client";

import type { ReactNode } from "react";
import { SiteExperienceProvider } from "@/context/SiteExperienceContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { KeyboardShortcuts } from "@/components/chrome/KeyboardShortcuts";
import { WebVitalsReporter } from "@/components/ui/WebVitalsReporter";
import { ServiceWorkerRegister } from "@/components/ui/ServiceWorkerRegister";
import { SkipLink } from "@/components/ui/SkipLink";

export function SiteProviders({ children }: { children: ReactNode }) {
  return (
    <SiteExperienceProvider>
      <CurrencyProvider>
        <SkipLink />
        <WebVitalsReporter />
        <ServiceWorkerRegister />
        <KeyboardShortcuts />
        <CookieConsent />
        {children}
      </CurrencyProvider>
    </SiteExperienceProvider>
  );
}
