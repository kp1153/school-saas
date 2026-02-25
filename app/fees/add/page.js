import { redirect } from 'next/navigation'
import { initDB } from '@/lib/db'

async function addPayment(formData) {
  'use server'
  
  const studentId = formData.get('student_id')
  const amount = formData.get('amount')
  const dueDate = formData.get('due_date')
  const paidDate = formData.get('paid_date') || null
  const status = paidDate ? 'paid' : 'pending'

  const db = await initDB()
  
  await db.execute({
    sql: `INSERT INTO fees (student_id, amount, due_date, paid_date, status) 
          VALUES (?, ?, ?, ?, ?)`,
    args: [studentId, amount, dueDate, paidDate, status]
  })

  redirect('/fees')
}

export default async function AddFeePage() {
  const db = await initDB()
  const students = await db.execute(`
    SELECT id, name, class, section FROM students ORDER BY name
  `)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Record Payment</h1>
      
      <form action={addPayment} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
          <select
            name="student_id"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Choose a student...</option>
            {students.rows.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} - {student.class} {student.section}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            required
            min="1"
            step="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            name="due_date"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Paid Date (leave empty if pending)</label>
          <input
            type="date"
            name="paid_date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Save Payment
          </button>
          <a
            href="/fees"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}