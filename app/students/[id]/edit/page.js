import { redirect } from 'next/navigation'
import { db } from '@/lib/db-drizzle'
import { students } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { setFlash } from '@/lib/flash'

async function updateStudent(formData) {
  'use server'
  
  const id = formData.get('id')
  const name = formData.get('name')
  const className = formData.get('class')
  const section = formData.get('section')
  const rollNumber = formData.get('roll_number')
  const parentName = formData.get('parent_name')
  const parentPhone = formData.get('parent_phone')
  const feeStatus = formData.get('fee_status')

  // Drizzle update
  await db.update(students)
    .set({
      name: name,
      class: className,
      section: section,
      roll_number: rollNumber,
      parent_name: parentName,
      parent_phone: parentPhone,
      fee_status: feeStatus
    })
    .where(eq(students.id, Number(id)))

  await setFlash('success', 'Student updated successfully!')
  redirect(`/students/${id}`)
}

export default async function EditStudentPage({ params }) {
  const { id } = await params
  
  const student = await db.select()
    .from(students)
    .where(eq(students.id, Number(id)))

  if (student.length === 0) {
    notFound()
  }

  const s = student[0]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Student</h1>
      
      <form action={updateStudent} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <input type="hidden" name="id" value={s.id} />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            defaultValue={s.name}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <input
              type="text"
              name="class"
              defaultValue={s.class}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
            <input
              type="text"
              name="section"
              defaultValue={s.section}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
          <input
            type="text"
            name="roll_number"
            defaultValue={s.roll_number}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
          <input
            type="text"
            name="parent_name"
            defaultValue={s.parent_name}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
          <input
            type="tel"
            name="parent_phone"
            defaultValue={s.parent_phone}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fee Status</label>
          <select
            name="fee_status"
            defaultValue={s.fee_status}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Update Student
          </button>
          <a
            href={`/students/${s.id}`}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}