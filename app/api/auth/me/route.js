import { NextResponse } from "next/server";
import { db } from "@/lib/db-drizzle";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const result = await db.select().from(users).where(eq(users.email, session));

  if (result.length === 0) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const user = result[0];

  return NextResponse.json({
    user: {
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      status: user.status,
      expiry_date: user.expiry_date,
    },
  });
}