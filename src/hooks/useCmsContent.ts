"use client";
import { useState, useEffect } from "react";

/**
 * Hook to fetch CMS content from the API.
 * Returns the full content object, a loading state, and a specific page's CMS data.
 */
export function useCmsContent() {
  const [content, setContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { content, loading };
}
