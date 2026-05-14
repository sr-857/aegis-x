import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-storage")?.value;
  const { pathname } = request.nextUrl;

  if (publicPaths.some((p) => pathname.startsWith(p))) {
    if (token?.includes("isAuthenticated")) {
      return NextResponse.redirect(new URL("/executive", request.url));
    }
    return NextResponse.next();
  }

  if (!token || !token.includes("isAuthenticated")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|manifest.json|apple-icon.svg).*)"],
};
