import { db } from "@/lib/db-drizzle";
import { students } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  await db.delete(students);
  return NextResponse.json({ done: true });
}
