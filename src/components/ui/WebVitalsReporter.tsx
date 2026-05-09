"use client";

import { useEffect } from "react";
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";

function send(metric: Metric) {
  if (process.env.NODE_ENV === "development") {
    console.info("[Web Vitals]", metric.name, metric.value, metric.rating);
  }
  const endpoint = process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT;
  if (endpoint && typeof navigator !== "undefined") {
    void fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        id: metric.id,
        rating: metric.rating,
        path: window.location.pathname,
      }),
      keepalive: true,
    }).catch(() => {});
  }
}

export function WebVitalsReporter() {
  useEffect(() => {
    onCLS(send);
    onINP(send);
    onLCP(send);
    onFCP(send);
    onTTFB(send);
  }, []);
  return null;
}
