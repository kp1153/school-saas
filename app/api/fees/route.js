import { NextResponse } from "next/server"
import { db } from "@/db"
import { fees } from "@/db/schema"

export async function POST(request) {
  const { vidyarthiId, maah, rakam, chukaya } = await request.json()
  if (!vidyarthiId || !maah || !rakam) {
    return NextResponse.json({ error: "सभी जरूरी फील्ड भरें" }, { status: 400 })
  }
  await db.insert(fees).values({
    vidyarthiId: Number(vidyarthiId),
    maah,
    rakam: Number(rakam),
    chukaya: Number(chukaya || 0),
    tarikh: new Date().toISOString(),
  })
  return NextResponse.json({ success: true })
}

export async function GET() {
  const sabFees = await db.select().from(fees)
  return NextResponse.json(sabFees)
}