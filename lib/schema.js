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