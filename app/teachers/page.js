export const dynamic = "force-dynamic";

import { db } from "@/lib/db-drizzle";
import { teachers } from "@/lib/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function TeachersPage() {
  const allTeachers = await db.select().from(teachers).orderBy(desc(teachers.joining_date));

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-500 text-sm mt-1">{allTeachers.length} teachers on staff</p>
        </div>
        <Link href="/teachers/add"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition text-sm font-medium shadow-sm">
          + Add Teacher
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qualification</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allTeachers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No teachers found. Add your first teacher.
                </td>
              </tr>
            ) : (
              allTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{teacher.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{teacher.subject}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{teacher.qualification}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{teacher.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{teacher.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <Link href={`/teachers/${teacher.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">View</Link>
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