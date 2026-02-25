import { NextResponse } from "next/server";

export function proxy(request) {
  const session = request.cookies.get("session");
  const isAuth = !!session?.value;  // किसी भी value को authenticate मानो
  const pathname = request.nextUrl.pathname;
  
  const publicPaths = ["/", "/login"];
  const isPublicPath = publicPaths.includes(pathname);

  // अगर authenticate नहीं और public path नहीं तो login पर भेजो
  if (!isAuth && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // अगर authenticate है और login page पर है तो dashboard पर भेजो
  if (isAuth && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};