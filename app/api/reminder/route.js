import { NextResponse } from "next/server";
import { db } from "@/lib/db-drizzle";
import { users } from "@/lib/schema";
import { eq, and, lte, gt } from "drizzle-orm";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const now = new Date();
    const in7Days = new Date();
    in7Days.setDate(in7Days.getDate() + 7);

    const result = await db.select().from(users).where(
      and(
        eq(users.status, "active"),
        eq(users.reminder_sent, 0),
        lte(users.expiry_date, in7Days),
        gt(users.expiry_date, now)
      )
    );

    let sent = 0;

    for (const user of result) {
      if (!user.email) continue;

      await resend.emails.send({
        from: "EduSaaS <onboarding@resend.dev>",
        to: [user.email],
        subject: "EduSaaS — Renewal Reminder",
        html: `<p>Hello ${user.name || ""},</p><p>Your EduSaaS subscription expires on <strong>${new Date(user.expiry_date).toDateString()}</strong>.</p><p><a href="https://web-developer-kp.com/payment?software=school&email=${encodeURIComponent(user.email)}">Renew Now</a></p>`,
      });

      await db.update(users).set({ reminder_sent: 1 }).where(eq(users.email, user.email));

      sent++;
    }

    return NextResponse.json({ success: true, sent });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}