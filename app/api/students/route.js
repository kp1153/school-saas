import { initDB } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/students - Get all students
export async function GET() {
  try {
    const db = await initDB();
    const students = await db.execute(
      "SELECT * FROM students ORDER BY created_at DESC",
    );

    return NextResponse.json({
      success: true,
      data: students.rows,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// POST /api/students - Create new student
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      class: className,
      section,
      roll_number,
      parent_name,
      parent_phone,
    } = body;

    const db = await initDB();

    const result = await db.execute({
      sql: `INSERT INTO students (name, class, section, roll_number, parent_name, parent_phone, fee_status) 
            VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      args: [name, className, section, roll_number, parent_name, parent_phone],
    });

    return NextResponse.json({
      success: true,
      id: result.lastInsertRowid,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
