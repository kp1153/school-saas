import { NextResponse } from "next/server";
import { db } from "@/lib/db-drizzle";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", request.url));
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.NEXT_PUBLIC_URL + "/api/auth/callback/google",
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return NextResponse.redirect(new URL("/login?error=token_failed", request.url));
  }

  const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: "Bearer " + tokenData.access_token },
  });

  const profile = await profileRes.json();
  const email = profile.email;
  const name = profile.name;
  const avatar = profile.picture;

  const existing = await db.select().from(users).where(eq(users.email, email));

  let user;

  if (existing.length === 0) {
    const trialStart = new Date();
    const expiryDate = new Date(trialStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    const inserted = await db.insert(users).values({
      email,
      name,
      avatar,
      status: "trial",
      trial_start: trialStart,
      expiry_date: expiryDate,
    }).returning();
    user = inserted[0];
  } else {
    user = existing[0];
  }

  if (user.status === "expired" || (user.status === "trial" && new Date() > new Date(user.expiry_date))) {
    await db.update(users).set({ status: "expired" }).where(eq(users.email, email));
    const paymentUrl = "https://web-developer-kp.com/payment?software=school&email=" + encodeURIComponent(email);
    return NextResponse.redirect(paymentUrl);
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set("session", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
  });

  return response;
}