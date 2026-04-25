import { google } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { db } from "@/lib/db-drizzle";
import { users } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DEVELOPER_EMAIL = "prasad.kamta@gmail.com";

function redirectWithCookie(request, path, token) {
  const response = NextResponse.redirect(new URL(path, request.url));
  response.cookies.set("session", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
    secure: true,
  });
  return response;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const cookieStore = await cookies();
  const storedState = cookieStore.get("oauth_state")?.value;
  const codeVerifier = cookieStore.get("code_verifier")?.value;

  if (!code || state !== storedState) {
    return new Response("Invalid state", { status: 400 });
  }

  const tokens = await google.validateAuthorizationCode(code, codeVerifier);
  const accessToken = tokens.accessToken();

  const googleRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const googleUser = await googleRes.json();
  if (!googleUser.email) return NextResponse.redirect(new URL("/login", request.url));

  const isDeveloper = googleUser.email === DEVELOPER_EMAIL;

  if (isDeveloper) {
    const existing = await db.select().from(users).where(eq(users.email, googleUser.email));
    if (existing.length === 0) {
      await db.insert(users).values({
        email: googleUser.email,
        name: googleUser.name || "",
        status: "active",
        expiry_date: null,
        reminder_sent: 0,
      });
    }
    const devUser = existing[0] ||
      (await db.select().from(users).where(eq(users.email, googleUser.email)))[0];
    const token = await createSession(devUser.id, devUser.email, devUser.name, "active", null);
    return redirectWithCookie(request, "/dashboard", token);
  }

  const existing = await db.select().from(users).where(eq(users.email, googleUser.email));
  let user;

  if (existing.length === 0) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    await db.insert(users).values({
      email: googleUser.email,
      name: googleUser.name || "",
      status: "trial",
      expiry_date: expiry.toISOString(),
      reminder_sent: 0,
    });
    const inserted = (await db.select().from(users).where(eq(users.email, googleUser.email)))[0];

    const preActivation = await db.select()
      .from(sql`pre_activations`)
      .where(sql`email = ${googleUser.email.toLowerCase().trim()}`)
      .limit(1);

    if (preActivation.length > 0) {
      const activeExpiry = new Date();
      activeExpiry.setFullYear(activeExpiry.getFullYear() + 1);
      await db.update(users).set({
        status: "active",
        expiry_date: activeExpiry.toISOString(),
        reminder_sent: 0,
      }).where(eq(users.email, googleUser.email));
      await db.execute(
        sql`DELETE FROM pre_activations WHERE email = ${googleUser.email.toLowerCase().trim()}`
      );
      user = { ...inserted, status: "active", expiry_date: activeExpiry.toISOString() };
    } else {
      user = inserted;
    }
  } else {
    user = existing[0];
    const expiry = user.expiry_date ? new Date(user.expiry_date) : null;
    const isActive = user.status === "active" && (!expiry || expiry > new Date());
    const isTrial = user.status === "trial" && expiry && expiry > new Date();

    if (!isActive && !isTrial) {
      const preActivation = await db.select()
        .from(sql`pre_activations`)
        .where(sql`email = ${googleUser.email.toLowerCase().trim()}`)
        .limit(1);

      if (preActivation.length > 0) {
        const activeExpiry = new Date();
        activeExpiry.setFullYear(activeExpiry.getFullYear() + 1);
        await db.update(users).set({
          status: "active",
          expiry_date: activeExpiry.toISOString(),
          reminder_sent: 0,
        }).where(eq(users.email, googleUser.email));
        await db.execute(
          sql`DELETE FROM pre_activations WHERE email = ${googleUser.email.toLowerCase().trim()}`
        );
        user = { ...user, status: "active", expiry_date: activeExpiry.toISOString() };
      } else {
        const token = await createSession(
          user.id,
          user.email,
          user.name,
          user.status,
          user.expiry_date
        );
        return redirectWithCookie(request, "/expired", token);
      }
    }
  }

  const token = await createSession(
    user.id,
    user.email,
    user.name,
    user.status,
    user.expiry_date
  );

  return redirectWithCookie(request, "/dashboard", token);
}