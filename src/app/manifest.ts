import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "مجموعة القاضي الذهبية",
    short_name: "AlQadi",
    description:
      "سفريات، سياحة، وخدمات الأيادي العاملة — تجربة رقمية فاخرة.",
    start_url: "/",
    display: "standalone",
    background_color: "#030303",
    theme_color: "#c9a227",
    lang: "ar",
    dir: "rtl",
    icons: [
      {
        src: "/brand/alqadi-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/alqadi-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
