import { db } from '@/lib/db-drizzle'
import { students, attendance } from '@/lib/schema'
import { eq, and, sql } from 'drizzle-orm'
import Link from 'next/link'

export default async function AttendancePage({ searchParams }) {
  const params = await searchParams
  const today = new Date().toISOString().split('T')[0]
  const selectedDate = params?.date || today
  const selectedClass = params?.class || ''

  const allStudents = await db.select().from(students)
  const classes = [...new Set(allStudents.map(s => s.class))]

  const filteredStudents = selectedClass 
    ? allStudents.filter(s => s.class === selectedClass)
    : allStudents

  const todayAttendance = await db.select()
    .from(attendance)
    .where(eq(attendance.date, selectedDate))

  const attendanceMap = {}
  todayAttendance.forEach(a => {
    attendanceMap[a.student_id] = a.status
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500 text-sm mt-1">{selectedDate}</p>
        </div>
        <Link href={`/attendance/mark?date=${selectedDate}&class=${selectedClass}`}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition text-sm font-medium shadow-sm">
          + Mark Attendance
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex gap-4">
        <form className="flex gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date</label>
            <input type="date" name="date" defaultValue={selectedDate}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Class</label>
            <select name="class" defaultValue={selectedClass}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">All Classes</option>
              {classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700">
            Filter
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  No students found
                </td>
              </tr>
            ) : filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{student.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.class} - {student.section}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.roll_number}</td>
                <td className="px-6 py-4">
                  {attendanceMap[student.id] ? (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      attendanceMap[student.id] === 'present'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {attendanceMap[student.id]}
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-500">
                      Not marked
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}