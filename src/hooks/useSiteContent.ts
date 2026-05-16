"use client";

import { useEffect, useState } from "react";

type SiteContent = {
  company?: {
    nameAr?: string;
    nameEn?: string;
    phone?: string;
    email?: string;
    address?: string;
    whatsapp?: string;
    foundedYear?: string;
    taglineAr?: string;
    taglineEn?: string;
  };
  stats?: Record<string, any>;
  branches?: any[];
  cms_home?: any;
  cms_contact?: any;
  [k: string]: any;
};

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setContent(data))
      .finally(() => setLoading(false));
  }, []);

  return { content, loading };
}

