export const dynamic = "force-dynamic";

import { db } from "@/lib/db-drizzle";
import { students } from "@/lib/schema";
import Link from "next/link";

export default async function StudentsPage() {
  const allStudents = await db.select().from(students);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 text-sm mt-1">{allStudents.length} students enrolled</p>
        </div>
        <Link href="/students/add"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition text-sm font-medium shadow-sm">
          + Add Student
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No students found. Add your first student.
                </td>
              </tr>
            ) : (
              allStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.class} - {student.section}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.roll_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.parent_name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      student.fee_status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {student.fee_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-3">
                      <Link href={`/students/${student.id}`} className="text-indigo-600 hover:text-indigo-900">View</Link>
                      <Link href={`/students/${student.id}/edit`} className="text-gray-600 hover:text-gray-900">Edit</Link>
                      <Link href={`/students/${student.id}/parent`} className="text-green-600 hover:text-green-800">👨‍👩‍👧 Parent</Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}