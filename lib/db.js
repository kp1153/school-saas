// Turso database connection with initDB
// @libsql/client/http use karna hai - tumne bataya

import { createClient } from '@libsql/client/http'

export async function initDB() {
  // Tumhare sikhaye hisaab se:
  // 1. URL mein https:// use karna
  // 2. Token hardcode bhi kar sakte ho .env ke saath
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL || "https://your-database.turso.io",
    authToken: process.env.TURSO_AUTH_TOKEN || "your-auth-token-here"
  })

  try {
    // Students table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS students (
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
    `)

    // Teachers table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        subject TEXT NOT NULL,
        qualification TEXT,
        phone TEXT,
        email TEXT,
        joining_date DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Fees table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS fees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        amount DECIMAL(10,2),
        due_date DATE,
        paid_date DATE,
        status TEXT DEFAULT 'pending',
        FOREIGN KEY (student_id) REFERENCES students (id)
      )
    `)

    // Insert sample data if table is empty
    const studentsCount = await client.execute('SELECT COUNT(*) as count FROM students')
    
    if (studentsCount.rows[0].count === 0) {
      await client.execute(`
        INSERT INTO students (name, class, section, roll_number, parent_name, parent_phone, fee_status) VALUES
        ('Rahul Sharma', '12th', 'A', '12001', 'Rajesh Sharma', '9876543210', 'paid'),
        ('Priya Patel', '11th', 'B', '11015', 'Meena Patel', '9876543211', 'pending'),
        ('Amit Kumar', '10th', 'C', '10008', 'Suresh Kumar', '9876543212', 'paid'),
        ('Sneha Reddy', '9th', 'A', '09023', 'Praveen Reddy', '9876543213', 'paid')
      `)
    }

    console.log('Database initialized successfully')
    return client

  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

// Helper function for queries
export async function query(sql, args = []) {
  const client = await initDB()
  try {
    const result = await client.execute({
      sql,
      args
    })
    return result
  } catch (error) {
    console.error('Query error:', error)
    throw error
  }
}