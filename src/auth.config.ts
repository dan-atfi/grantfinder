import type { NextAuthConfig } from "next-auth";

export default {
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = [
        "/dashboard",
        "/search",
        "/grants",
        "/saved",
        "/company",
        "/settings",
      ];
      const isProtected = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL("/sign-in", nextUrl));
      }

      const authPaths = ["/sign-in", "/sign-up"];
      if (isLoggedIn && authPaths.includes(nextUrl.pathname)) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
