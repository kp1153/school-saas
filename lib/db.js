import { createClient } from '@libsql/client/http'

export async function initDB() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  })

  try {
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
    await client.execute(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        date TEXT NOT NULL,
        status TEXT DEFAULT 'present',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students (id)
      )
    `)
    await client.execute(`
      CREATE TABLE IF NOT EXISTS exams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        class TEXT NOT NULL,
        subject TEXT NOT NULL,
        exam_date TEXT NOT NULL,
        max_marks INTEGER NOT NULL DEFAULT 100,
        passing_marks INTEGER NOT NULL DEFAULT 33,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    await client.execute(`
      CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exam_id INTEGER,
        student_id INTEGER,
        marks_obtained REAL NOT NULL,
        grade TEXT,
        remarks TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (exam_id) REFERENCES exams (id),
        FOREIGN KEY (student_id) REFERENCES students (id)
      )
    `)
    await client.execute(`
  CREATE TABLE IF NOT EXISTS notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    priority TEXT DEFAULT 'normal',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`) 
 await client.execute(`
      CREATE TABLE IF NOT EXISTS timetable (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        class TEXT NOT NULL,
        day TEXT NOT NULL,
        period INTEGER NOT NULL,
        subject TEXT NOT NULL,
        teacher_name TEXT,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('Database initialized successfully')
    return client
  } catch (error) {
    console.error('Database initialization error:', error)
    throw error
  }
}

export async function query(sql, args = []) {
  const client = await initDB()
  try {
    const result = await client.execute({ sql, args })
    return result
  } catch (error) {
    console.error('Query error:', error)
    throw error
  }
}