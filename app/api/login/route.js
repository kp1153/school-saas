import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, password } = await request.json();
  if (email === "hamaramorcha1153@gmail.com" && password === "Maqbool2@") {
    const response = NextResponse.json({ success: true });
    response.cookies.set("session", "demo-session-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });
    return response;
  }
  return NextResponse.json({ success: false }, { status: 401 });
}
