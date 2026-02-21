import { NextResponse } from "next/server"
import { db } from "@/db"
import { result } from "@/db/schema"

export async function POST(request) {
  const { vidyarthiId, marks } = await request.json()
  if (!vidyarthiId || !marks) {
    return NextResponse.json({ error: "डेटा अधूरा है" }, { status: 400 })
  }
  const rows = Object.entries(marks).map(([vishay, ank]) => ({
    vidyarthiId: Number(vidyarthiId),
    vishay,
    ank: Number(ank),
    banaya: new Date().toISOString(),
  }))
  await db.insert(result).values(rows)
  return NextResponse.json({ success: true })
}

export async function GET() {
  const sabResult = await db.select().from(result)
  return NextResponse.json(sabResult)
}