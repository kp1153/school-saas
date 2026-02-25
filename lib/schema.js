import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const students = sqliteTable('students', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  class: text('class').notNull(),
  section: text('section'),
  roll_number: text('roll_number').unique(),
  parent_name: text('parent_name'),
  parent_phone: text('parent_phone'),
  fee_status: text('fee_status').default('pending'),
  admission_date: integer('admission_date', { mode: 'timestamp' }).defaultNow(),
  created_at: integer('created_at', { mode: 'timestamp' }).defaultNow(),
})

export const teachers = sqliteTable('teachers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  subject: text('subject').notNull(),
  qualification: text('qualification'),
  phone: text('phone'),
  email: text('email'),
  joining_date: integer('joining_date', { mode: 'timestamp' }).defaultNow(),
})

export const fees = sqliteTable('fees', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  student_id: integer('student_id').references(() => students.id),
  amount: real('amount').notNull(),
  due_date: integer('due_date', { mode: 'timestamp' }).notNull(),
  paid_date: integer('paid_date', { mode: 'timestamp' }),
  status: text('status').default('pending'),
})

export const attendance = sqliteTable('attendance', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  student_id: integer('student_id').references(() => students.id),
  date: text('date').notNull(),
  status: text('status').notNull().default('present'),
  created_at: integer('created_at', { mode: 'timestamp' }).defaultNow(),
})

export const exams = sqliteTable('exams', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  class: text('class').notNull(),
  subject: text('subject').notNull(),
  exam_date: text('exam_date').notNull(),
  max_marks: integer('max_marks').notNull().default(100),
  passing_marks: integer('passing_marks').notNull().default(33),
  created_at: integer('created_at', { mode: 'timestamp' }).defaultNow(),
})

export const results = sqliteTable('results', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  exam_id: integer('exam_id').references(() => exams.id),
  student_id: integer('student_id').references(() => students.id),
  marks_obtained: real('marks_obtained').notNull(),
  grade: text('grade'),
  remarks: text('remarks'),
  created_at: integer('created_at', { mode: 'timestamp' }).defaultNow(),
})

export const notices = sqliteTable('notices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').default('general'),
  priority: text('priority').default('normal'),
  created_at: integer('created_at', { mode: 'timestamp' }).defaultNow(),
})
export const timetable = sqliteTable('timetable', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  class: text('class').notNull(),
  day: text('day').notNull(),
  period: integer('period').notNull(),
  subject: text('subject').notNull(),
  teacher_name: text('teacher_name'),
  start_time: text('start_time').notNull(),
  end_time: text('end_time').notNull(),
  created_at: integer('created_at', { mode: 'timestamp' }).defaultNow(),
})