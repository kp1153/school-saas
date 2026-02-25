import { NextResponse } from "next/server";

export function proxy(request) {
  const session = request.cookies.get("session");
  const isAuth = !!session?.value;
  const pathname = request.nextUrl.pathname;

  const publicPaths = ["/", "/login"];
  const isPublicPath = publicPaths.includes(pathname);

  if (!isAuth && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuth && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
