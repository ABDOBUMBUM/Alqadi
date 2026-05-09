import type { Metadata } from "next";
import { Cairo, Cormorant_Garamond, Geist } from "next/font/google";
import { SiteProviders } from "@/components/providers/SiteProviders";
import { SiteFooterWrapper } from "@/components/chrome/SiteFooterWrapper";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "مجموعة القاضي الذهبية | السفريات والسياحة وخدمة الأيادي العاملة",
  description:
    "Golden Al'Qadi Group — سفريات، سياحة، وخدمات الأيادي العاملة. تجربة رقمية فاخرة تعكس الامتياز الذهبي.",
  alternates: {
    canonical: "/",
    languages: { ar: "/", en: "/en" },
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://alqadigroup.com"),
};

import { Preloader } from "@/components/ui/Preloader";
import { GoldCursor } from "@/components/ui/GoldCursor";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";
import { cn } from "@/lib/utils";
import { SiteUI } from "@/components/layout/SiteUI";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={cn("h-full", "antialiased", cairo.variable, cormorant.variable, "font-sans", geist.variable)}
    >
      <head>
        <SchemaMarkup />
      </head>
      <body className="min-h-full marble-bg overflow-x-hidden">
        <SiteProviders>
          <Preloader />
          <GoldCursor />
          <SiteUI />
          <main id="main-content" className="relative z-10 min-h-screen">
            {children}
          </main>
          <SiteFooterWrapper />
        </SiteProviders>
      </body>
    </html>
  );
}
