import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const saveData = req.headers.get("save-data");
  if (saveData === "on") {
    res.cookies.set("low_bandwidth", "1", { path: "/", maxAge: 60 * 60 * 24 * 30 });
  }
  if (!req.cookies.get("ab_variant")) {
    const v = Math.random() < 0.5 ? "a" : "b";
    res.cookies.set("ab_variant", v, { path: "/", maxAge: 60 * 60 * 24 * 180 });
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sw.js).*)"],
};
