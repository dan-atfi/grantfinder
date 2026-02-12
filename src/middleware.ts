import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();

  const protectedPaths = ["/dashboard", "/search", "/grants", "/saved", "/company", "/settings"];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !session?.user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const authPaths = ["/sign-in", "/sign-up"];
  if (session?.user && authPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
