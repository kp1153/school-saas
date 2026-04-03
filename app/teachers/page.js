export const dynamic = "force-dynamic";

import { db } from "@/lib/db-drizzle";
import { teachers } from "@/lib/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function TeachersPage() {
  const allTeachers = await db.select().from(teachers).orderBy(desc(teachers.joining_date));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-500 text-xs mt-0.5">{allTeachers.length} on staff</p>
        </div>
        <Link href="/teachers/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Add
        </Link>
      </div>

      {allTeachers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">
          No teachers found. Add your first teacher.
        </div>
      ) : (
        <div className="space-y-3">
          {allTeachers.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{teacher.name}</p>
                  <p className="text-indigo-600 text-xs font-medium mt-0.5">{teacher.subject}</p>
                  <p className="text-gray-400 text-xs mt-1">{teacher.qualification || "—"} · {teacher.phone || "—"}</p>
                  {teacher.email && <p className="text-gray-400 text-xs">{teacher.email}</p>}
                </div>
                <Link href={`/teachers/${teacher.id}`} className="ml-3 shrink-0 text-xs font-medium text-indigo-600">
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}