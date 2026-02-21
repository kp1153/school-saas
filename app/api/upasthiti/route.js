import { NextResponse } from "next/server"
import { db } from "@/db"
import { upasthiti as upasthitiTable } from "@/db/schema"

export async function POST(request) {
  const { tarikh, upasthiti } = await request.json()
  if (!tarikh || !upasthiti) {
    return NextResponse.json({ error: "डेटा अधूरा है" }, { status: 400 })
  }
  const rows = Object.entries(upasthiti).map(([vidyarthiId, sthiti]) => ({
    vidyarthiId: Number(vidyarthiId),
    tarikh,
    sthiti,
  }))
  await db.insert(upasthitiTable).values(rows)
  return NextResponse.json({ success: true })
}