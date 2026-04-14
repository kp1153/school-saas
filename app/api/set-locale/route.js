// app/api/set-locale/route.js

import { NextResponse } from "next/server";

export async function POST(request) {
  const { locale } = await request.json();

  if (!["hi", "en"].includes(locale)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}