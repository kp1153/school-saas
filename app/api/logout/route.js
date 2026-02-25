import { NextResponse } from "next/server"

export async function GET() {
  const response = NextResponse.redirect(process.env.NEXT_PUBLIC_BASE_URL || "https://school-saas-seven.vercel.app/login")
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  })
  return response
}