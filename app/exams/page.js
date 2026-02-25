import { db } from '@/lib/db-drizzle'
import { exams } from '@/lib/schema'
import { desc } from 'drizzle-orm'
import Link from 'next/link'

export default async function ExamsPage() {
  const allExams = await db.select().from(exams).orderBy(desc(exams.created_at))

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exams & Results</h1>
          <p className="text-gray-500 text-sm mt-1">परीक्षा schedule और marks manage करें</p>
        </div>
        <Link href="/exams/add"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition text-sm font-medium shadow-sm">
          + New Exam
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Max Marks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {allExams.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  कोई exam नहीं है। पहला exam add करें।
                </td>
              </tr>
            ) : allExams.map((exam) => (
              <tr key={exam.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{exam.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{exam.class}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{exam.subject}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{exam.exam_date}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{exam.max_marks}</td>
                <td className="px-6 py-4 text-sm flex gap-3">
                  <Link href={`/exams/${exam.id}/results`}
                    className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Marks Entry
                  </Link>
                  <Link href={`/exams/${exam.id}/report`}
                    className="text-green-600 hover:text-green-800 font-medium">
                    Report Card
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}