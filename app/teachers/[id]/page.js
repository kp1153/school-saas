import { initDB } from '@/lib/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function TeacherDetailPage({ params }) {
  const { id } = await params
  
  const db = await initDB()
  const teacher = await db.execute({
    sql: 'SELECT * FROM teachers WHERE id = ?',
    args: [id]
  })

  if (teacher.rows.length === 0) {
    notFound()
  }

  const t = teacher.rows[0]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Details</h1>
        <div className="space-x-3">
          <Link 
            href={`/teachers/${id}/edit`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
          >
            Edit
          </Link>
          <Link 
            href="/teachers"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-900">Personal Information</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-gray-900 font-medium">{t.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Subject</p>
              <p className="text-gray-900 font-medium">{t.subject}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Qualification</p>
              <p className="text-gray-900 font-medium">{t.qualification}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-gray-900 font-medium">{t.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-900 font-medium">{t.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Joining Date</p>
              <p className="text-gray-900 font-medium">
                {new Date(t.joining_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}