import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || request.nextUrl.hostname;
  const host = hostname.toLowerCase();

  const isPreview =
    hostname === "localhost" ||
    hostname.startsWith("127.0.0.1") ||
    hostname.endsWith(".vercel.app");

  const isRootDomain =
    host === "serviro.ir" || host === "www.serviro.ir";

  // 👇 فقط ساب‌دامین‌ها رو مدیریت کن (ریدایرکت حذف شده)
  if (!isPreview && !isRootDomain && host.endsWith(".serviro.ir")) {
    const subdomain = host.replace(".serviro.ir", "");
    if (subdomain && subdomain !== "www") {
      const url = request.nextUrl.clone();
      url.pathname = `/r/${encodeURIComponent(subdomain)}${
        url.pathname === "/" ? "" : url.pathname
      }`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/r/:path*"],
};