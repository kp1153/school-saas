import { initDB } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/students/[id] - Get single student
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const db = await initDB();

    const student = await db.execute({
      sql: "SELECT * FROM students WHERE id = ?",
      args: [id],
    });

    if (student.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Student not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: student.rows[0],
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// PUT /api/students/[id] - Update student
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      class: className,
      section,
      roll_number,
      parent_name,
      parent_phone,
      fee_status,
    } = body;

    const db = await initDB();

    await db.execute({
      sql: `UPDATE students 
            SET name = ?, class = ?, section = ?, roll_number = ?, 
                parent_name = ?, parent_phone = ?, fee_status = ?
            WHERE id = ?`,
      args: [
        name,
        className,
        section,
        roll_number,
        parent_name,
        parent_phone,
        fee_status,
        id,
      ],
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// DELETE /api/students/[id] - Delete student
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const db = await initDB();

    await db.execute({
      sql: "DELETE FROM students WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
