export const dynamic = "force-dynamic";

import { db } from "@/lib/db-drizzle";
import { students } from "@/lib/schema";
import Link from "next/link";

export default async function StudentsPage() {
  const allStudents = await db.select().from(students);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 text-xs mt-0.5">{allStudents.length} enrolled</p>
        </div>
        <Link href="/students/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Add
        </Link>
      </div>

      {allStudents.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">
          No students yet. Add your first student.
        </div>
      ) : (
        <div className="space-y-3">
          {allStudents.map((student) => (
            <div key={student.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 text-sm truncate">{student.name}</p>
                    <span className={`shrink-0 px-2 py-0.5 text-xs rounded-full font-medium ${
                      student.fee_status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {student.fee_status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs">Class {student.class} {student.section} · Roll {student.roll_number || "—"}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{student.parent_name || "—"}</p>
                </div>
                <div className="flex gap-3 ml-3 shrink-0 text-xs font-medium">
                  <Link href={`/students/${student.id}`} className="text-indigo-600">View</Link>
                  <Link href={`/students/${student.id}/edit`} className="text-gray-500">Edit</Link>
                  <Link href={`/students/${student.id}/parent`} className="text-green-600">Parent</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}