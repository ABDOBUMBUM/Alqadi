/**
 * Rate Limiter — حماية APIs من الإرسال المفرط
 * In-memory store, resets on server restart.
 * For production, use Redis-based rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// تنظيف دوري كل 5 دقائق
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (entry.resetAt < now) store.delete(key);
    }
  }, 5 * 60 * 1000);
}

/**
 * Check if a request should be rate limited.
 * @param identifier - IP or user ID
 * @param maxRequests - Max requests per window
 * @param windowMs - Time window in ms (default: 60 seconds)
 * @returns { success, remaining, resetAt } 
 */
export function rateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60_000
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const key = identifier;
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // First request or window expired
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  if (entry.count >= maxRequests) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

/**
 * Get client IP from Next.js request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
