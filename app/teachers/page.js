import { initDB } from "@/lib/db";
import Link from "next/link";

export default async function TeachersPage() {
  const db = await initDB();
  const teachers = await db.execute(`
    SELECT * FROM teachers 
    ORDER BY joining_date DESC
  `);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
        <Link
          href="/teachers/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
        >
          + Add Teacher
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Qualification
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {teachers.rows.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {teacher.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {teacher.subject}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {teacher.qualification}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {teacher.phone}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {teacher.email}
                </td>
                <td className="px-6 py-4 text-sm">
                  <Link
                    href={`/teachers/${teacher.id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    View
                  </Link>
                  <Link
                    href={`/teachers/${teacher.id}/edit`}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
