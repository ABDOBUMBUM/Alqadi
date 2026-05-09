"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

export function SchemaMarkup() {
  const pathname = usePathname();
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://alqadigroup.com";

  const travelAgencySchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "مجموعة القاضي الذهبية للسفريات والسياحة",
    "image": `${url}/brand/alqadi-logo.png`,
    "description": "تجربة سفر استثنائية بأعلى معايير الفخامة والاحترافية. خدمات طيران، سياحة، أيادي عاملة.",
    "url": url,
    "telephone": "+96598765432",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "شارع بيروت برج القاضي - الدور 12",
      "addressLocality": "حولي",
      "addressRegion": "الكويت",
      "addressCountry": "KW"
    },
    "priceRange": "$$$"
  };

  return (
    <Script
      id="schema-travel-agency"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(travelAgencySchema) }}
    />
  );
}
