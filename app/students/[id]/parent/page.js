import { db } from '@/lib/db-drizzle'
import { students, parents } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

async function createParent(formData) {
  'use server'

  const student_id = parseInt(formData.get('student_id'))
  const name = formData.get('name')
  const phone = formData.get('phone')
  const email = formData.get('email')
  const password = formData.get('password')

  // पहले check करो — इस student का parent पहले से है?
  const existing = await db.select().from(parents)
    .where(eq(parents.student_id, student_id))

  if (existing.length > 0) {
    await db.update(parents)
      .set({ name, phone, email, password })
      .where(eq(parents.student_id, student_id))
  } else {
    await db.insert(parents).values({
      student_id,
      name,
      phone,
      email,
      password,
    })
  }

  redirect(`/students`)
}

export default async function CreateParentPage({ params }) {
  const { id } = await params

  const [student] = await db.select().from(students)
    .where(eq(students.id, parseInt(id)))

  if (!student) return <div className="p-8 text-red-500">Student नहीं मिला।</div>

  const [existingParent] = await db.select().from(parents)
    .where(eq(parents.student_id, student.id))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Parent Account</h1>
        <p className="text-gray-500 text-sm mt-1">{student.name} — {student.class}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-lg">
        <form action={createParent} className="space-y-5">
          <input type="hidden" name="student_id" value={student.id} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={existingParent?.name || student.parent_name || ''}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              defaultValue={existingParent?.phone || student.parent_phone || ''}
              placeholder="Login के लिए use होगा"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={existingParent?.email || ''}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="password"
              required
              defaultValue={existingParent?.password || ''}
              placeholder="Parent को दें"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {existingParent && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
              ✅ Parent account पहले से है। Update करने के लिए save करें।
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 text-sm font-medium">
              {existingParent ? 'Update Account' : 'Create Account'}
            </button>
            <a href="/students"
              className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 text-sm font-medium">
              Cancel
            </a>
          </div>

        </form>
      </div>
    </div>
  )
}