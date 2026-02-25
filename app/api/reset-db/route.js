import { createClient } from "@libsql/client/http";
import { NextResponse } from "next/server";

export async function GET() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    // Tables drop करो
    await client.execute("DROP TABLE IF EXISTS fees");
    await client.execute("DROP TABLE IF EXISTS teachers");
    await client.execute("DROP TABLE IF EXISTS students");

    // Phir se tables create करो
    await client.execute(`
      CREATE TABLE students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        class TEXT NOT NULL,
        section TEXT,
        roll_number TEXT UNIQUE,
        parent_name TEXT,
        parent_phone TEXT,
        fee_status TEXT DEFAULT 'pending',
        admission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.execute(`
      CREATE TABLE teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        subject TEXT NOT NULL,
        qualification TEXT,
        phone TEXT,
        email TEXT,
        joining_date DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.execute(`
      CREATE TABLE fees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        amount DECIMAL(10,2),
        due_date DATE,
        paid_date DATE,
        status TEXT DEFAULT 'pending',
        FOREIGN KEY (student_id) REFERENCES students (id)
      )
    `);

    return NextResponse.json({
      success: true,
      message: "Database reset complete",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
