import PrintButton from './PrintButton'
import { db } from '@/lib/db-drizzle'
import { exams, students, results } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export default async function ReportCardPage({ params }) {
  const { id } = await params

  const [exam] = await db.select().from(exams).where(eq(exams.id, parseInt(id)))
  if (!exam) return <div className="p-8 text-red-500">Exam नहीं मिला।</div>

  const classStudents = await db.select().from(students)
    .where(eq(students.class, exam.class))

  const examResults = await db.select().from(results)
    .where(eq(results.exam_id, parseInt(id)))

  const resultsMap = {}
  examResults.forEach(r => { resultsMap[r.student_id] = r })

  const appeared = examResults.length
  const passed = examResults.filter(r => r.marks_obtained >= exam.passing_marks).length
  const avgMarks = appeared > 0
    ? (examResults.reduce((sum, r) => sum + r.marks_obtained, 0) / appeared).toFixed(1)
    : 0
  const topScore = appeared > 0
    ? Math.max(...examResults.map(r => r.marks_obtained))
    : 0

  return (
    <div>
      {/* Screen controls — print में नहीं दिखेंगे */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Card</h1>
          <p className="text-gray-500 text-sm mt-1">{exam.name} — {exam.class}</p>
        </div>
        <div className="flex gap-3">
          <a href="/exams"
            className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-200 text-sm font-medium">
            ← Back
          </a>
         <PrintButton />
        </div>
      </div>

      {/* Report card — print में भी दिखेगा */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 print:shadow-none print:border-none">

        {/* Header */}
        <div className="text-center border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">EduSaaS School</h2>
          <p className="text-gray-500 text-sm mt-1">Result Sheet</p>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Exam:</span>
              <span className="font-medium text-gray-900 ml-1">{exam.name}</span>
            </div>
            <div>
              <span className="text-gray-500">Class:</span>
              <span className="font-medium text-gray-900 ml-1">{exam.class}</span>
            </div>
            <div>
              <span className="text-gray-500">Subject:</span>
              <span className="font-medium text-gray-900 ml-1">{exam.subject}</span>
            </div>
            <div>
              <span className="text-gray-500">Date:</span>
              <span className="font-medium text-gray-900 ml-1">{exam.exam_date}</span>
            </div>
            <div>
              <span className="text-gray-500">Max Marks:</span>
              <span className="font-medium text-gray-900 ml-1">{exam.max_marks}</span>
            </div>
            <div>
              <span className="text-gray-500">Pass Marks:</span>
              <span className="font-medium text-gray-900 ml-1">{exam.passing_marks}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-indigo-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-indigo-700">{appeared}</div>
            <div className="text-xs text-indigo-500 mt-1">Appeared</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-700">{passed}</div>
            <div className="text-xs text-green-500 mt-1">Passed</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-700">{avgMarks}</div>
            <div className="text-xs text-yellow-500 mt-1">Avg Marks</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">{topScore}</div>
            <div className="text-xs text-blue-500 mt-1">Top Score</div>
          </div>
        </div>

        {/* Results Table */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {classStudents.map((student) => {
              const result = resultsMap[student.id]
              const percentage = result
                ? ((result.marks_obtained / exam.max_marks) * 100).toFixed(1)
                : null
              const passed = result
                ? result.marks_obtained >= exam.passing_marks
                : null

              return (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">{student.roll_number || '—'}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {result ? `${result.marks_obtained} / ${exam.max_marks}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {percentage ? `${percentage}%` : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {result?.grade ? (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.grade === 'A+' || result.grade === 'A' ? 'bg-green-100 text-green-700' :
                        result.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                        result.grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                        result.grade === 'D' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {result.grade}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {passed === null ? (
                      <span className="text-gray-400">—</span>
                    ) : passed ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Pass</span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Fail</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{result?.remarks || '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between text-xs text-gray-400 print:mt-16">
          <span>Generated by EduSaaS</span>
          <span>{new Date().toLocaleDateString('en-IN')}</span>
          <span>Class Teacher Signature: _______________</span>
        </div>
      </div>
    </div>
  )
}