import { NextResponse } from "next/server"
import { db } from "@/db"
import { vidyarthi } from "@/db/schema"

export async function POST(request) {
  const { naam, kaksha, pitaNaam, mobile } = await request.json()
  if (!naam || !kaksha) {
    return NextResponse.json({ error: "नाम और कक्षा जरूरी है" }, { status: 400 })
  }
  await db.insert(vidyarthi).values({
    naam,
    kaksha: Number(kaksha),
    pitaNaam: pitaNaam || null,
    mobile: mobile || null,
    banaya: new Date().toISOString(),
  })
  return NextResponse.json({ success: true })
}

export async function GET() {
  const sabVidyarthi = await db.select().from(vidyarthi).orderBy(vidyarthi.kaksha)
  return NextResponse.json(sabVidyarthi)
}