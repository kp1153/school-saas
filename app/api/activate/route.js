import { db } from "@/lib/db-drizzle";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request) {
  const { email, name, secret } = await request.json();
  if (secret !== process.env.HUB_SECRET) {
    return Response.json({ success: false }, { status: 401 });
  }
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length === 0) {
    await db.insert(users).values({
      email,
      name: name || "",
      status: "active",
      expiry_date: expiry.toISOString(),
      reminder_sent: 0,
    });
  } else {
    await db.update(users).set({
      status: "active",
      expiry_date: expiry.toISOString(),
      reminder_sent: 0,
    }).where(eq(users.email, email));
  }
  return Response.json({ success: true });
}