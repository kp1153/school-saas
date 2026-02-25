import { db } from '@/lib/db-drizzle'
import { students, fees, attendance, results, exams } from '@/lib/schema'
import { sql, eq } from 'drizzle-orm'

export default async function ReportsPage() {
  // Class-wise student count
  const classWiseStudents = await db
    .select({
      class: students.class,
      count: sql`COUNT(*)`,
    })
    .from(students)
    .groupBy(students.class)
    .orderBy(students.class)

  // Class-wise fee collection
  const classWiseFees = await db
    .select({
      class: students.class,
      total_pending: sql`SUM(CASE WHEN ${fees.status} = 'pending' THEN ${fees.amount} ELSE 0 END)`,
      total_paid: sql`SUM(CASE WHEN ${fees.status} = 'paid' THEN ${fees.amount} ELSE 0 END)`,
      pending_count: sql`SUM(CASE WHEN ${fees.status} = 'pending' THEN 1 ELSE 0 END)`,
      paid_count: sql`SUM(CASE WHEN ${fees.status} = 'paid' THEN 1 ELSE 0 END)`,
    })
    .from(fees)
    .leftJoin(students, eq(fees.student_id, students.id))
    .groupBy(students.class)
    .orderBy(students.class)

  // Class-wise attendance summary
  const classWiseAttendance = await db
    .select({
      class: students.class,
      present: sql`SUM(CASE WHEN ${attendance.status} = 'present' THEN 1 ELSE 0 END)`,
      absent: sql`SUM(CASE WHEN ${attendance.status} = 'absent' THEN 1 ELSE 0 END)`,
    })
    .from(attendance)
    .leftJoin(students, eq(attendance.student_id, students.id))
    .groupBy(students.class)
    .orderBy(students.class)

  // Exam-wise result summary
  const examSummary = await db
    .select({
      exam_id: exams.id,
      exam_name: exams.name,
      class: exams.class,
      subject: exams.subject,
      exam_date: exams.exam_date,
      max_marks: exams.max_marks,
      passing_marks: exams.passing_marks,
      total_appeared: sql`COUNT(${results.id})`,
      total_passed: sql`SUM(CASE WHEN ${results.marks_obtained} >= ${exams.passing_marks} THEN 1 ELSE 0 END)`,
      avg_marks: sql`ROUND(AVG(${results.marks_obtained}), 1)`,
      top_marks: sql`MAX(${results.marks_obtained})`,
    })
    .from(exams)
    .leftJoin(results, eq(results.exam_id, exams.id))
    .groupBy(exams.id)
    .orderBy(sql`${exams.exam_date} DESC`)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 text-sm mt-1">School की पूरी summary एक जगह</p>
        </div>
      </div>

      {/* Class-wise Students */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">🎓 Class-wise Students</h2>
        {classWiseStudents.length === 0 ? (
          <p className="text-sm text-gray-400">कोई data नहीं।</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {classWiseStudents.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.class}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Class-wise Fee Collection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">💰 Class-wise Fee Collection</h2>
        {classWiseFees.length === 0 ? (
          <p className="text-sm text-gray-400">कोई data नहीं।</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Collected</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pending</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pending Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {classWiseFees.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.class || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.paid_count || 0}</td>
                  <td className="px-4 py-3 text-sm text-green-600 font-medium">₹{row.total_paid || 0}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.pending_count || 0}</td>
                  <td className="px-4 py-3 text-sm text-red-500 font-medium">₹{row.total_pending || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Class-wise Attendance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">✅ Class-wise Attendance Summary</h2>
        {classWiseAttendance.length === 0 ? (
          <p className="text-sm text-gray-400">कोई data नहीं।</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Present</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {classWiseAttendance.map((row, i) => {
                const total = (row.present || 0) + (row.absent || 0)
                const pct = total > 0 ? ((row.present / total) * 100).toFixed(1) : 0
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.class || '—'}</td>
                    <td className="px-4 py-3 text-sm text-green-600">{row.present || 0}</td>
                    <td className="px-4 py-3 text-sm text-red-500">{row.absent || 0}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${pct}%` }}>
                          </div>
                        </div>
                        <span className="text-gray-700">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Exam Results Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">📝 Exam Results Summary</h2>
        {examSummary.length === 0 ? (
          <p className="text-sm text-gray-400">कोई exam नहीं।</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appeared</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passed</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Marks</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Top Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {examSummary.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.exam_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.class}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.subject}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.total_appeared || 0}</td>
                  <td className="px-4 py-3 text-sm text-green-600 font-medium">{row.total_passed || 0}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.avg_marks || '—'}</td>
                  <td className="px-4 py-3 text-sm text-indigo-600 font-medium">{row.top_marks || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}