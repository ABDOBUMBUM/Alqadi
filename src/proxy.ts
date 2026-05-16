import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Next.js 16 Proxy (replaces middleware.ts)
 * Handles:
 * 1. Admin route protection (auth + role check)
 * 2. A/B testing variant assignment
 * 3. Low-bandwidth detection
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ══════════════════════════════════════════════
  // 1. Admin Route Protection
  // ══════════════════════════════════════════════
  const isAdminUi = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (isAdminUi || isAdminApi) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const role = (token as any)?.role;

    if (!token) {
      if (isAdminUi) {
        const url = req.nextUrl.clone();
        url.pathname = "/portal/login";
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (role !== "admin") {
      if (isAdminUi) return NextResponse.redirect(new URL("/portal/dashboard", req.url));
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // ══════════════════════════════════════════════
  // 2. General Proxy Logic
  // ══════════════════════════════════════════════
  const res = NextResponse.next();

  // Save-Data header detection (low bandwidth)
  const saveData = req.headers.get("save-data");
  if (saveData === "on") {
    res.cookies.set("low_bandwidth", "1", { path: "/", maxAge: 60 * 60 * 24 * 30 });
  }

  // A/B testing variant
  if (!req.cookies.get("ab_variant")) {
    const v = Math.random() < 0.5 ? "a" : "b";
    res.cookies.set("ab_variant", v, { path: "/", maxAge: 60 * 60 * 24 * 180 });
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sw.js).*)"],
};
