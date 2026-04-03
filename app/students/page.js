// app/students/page.js
export const dynamic = "force-dynamic";

import { db } from "@/lib/db-drizzle";
import { students } from "@/lib/schema";
import Link from "next/link";

export default async function StudentsPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search?.toLowerCase() || "";
  const selectedClass = params?.class || "";

  const allStudents = await db.select().from(students);
  const classes = [...new Set(allStudents.map((s) => s.class))].sort();

  const filtered = allStudents.filter((s) => {
    const matchSearch =
      !search ||
      s.name?.toLowerCase().includes(search) ||
      s.roll_number?.toLowerCase().includes(search) ||
      s.parent_name?.toLowerCase().includes(search) ||
      s.parent_phone?.includes(search);
    const matchClass = !selectedClass || s.class === selectedClass;
    return matchSearch && matchClass;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 text-xs mt-0.5">
            {filtered.length} of {allStudents.length} enrolled
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/students/import"
            className="bg-white border border-indigo-300 text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium">
            📥 Import
          </Link>
          <Link href="/students/add"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            + Add
          </Link>
        </div>
      </div>

      <form className="bg-white rounded-xl border border-gray-100 p-3 mb-4 shadow-sm flex flex-col gap-2">
        <input type="text" name="search" defaultValue={search}
          placeholder="🔍 Name, roll no, parent phone..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <div className="flex gap-2">
          <select name="class" defaultValue={selectedClass}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option value="">All Classes</option>
            {classes.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
            Filter
          </button>
          {(search || selectedClass) && (
            <a href="/students"
              className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm">✕</a>
          )}
        </div>
      </form>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-indigo-50 rounded-lg p-3 text-center border border-indigo-100">
          <div className="text-lg font-bold text-indigo-700">{allStudents.length}</div>
          <div className="text-xs text-indigo-500">Total</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
          <div className="text-lg font-bold text-green-700">
            {allStudents.filter((s) => s.fee_status === "paid").length}
          </div>
          <div className="text-xs text-green-500">Fees Paid</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-100">
          <div className="text-lg font-bold text-yellow-700">
            {allStudents.filter((s) => s.fee_status !== "paid").length}
          </div>
          <div className="text-xs text-yellow-600">Pending</div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">
          {search || selectedClass ? "कोई student नहीं मिला।" : "No students yet."}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((student) => (
            <div key={student.id}
              className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
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
                  <p className="text-gray-500 text-xs">
                    Class {student.class} {student.section} · Roll {student.roll_number || "—"}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    👤 {student.parent_name || "—"} · 📞 {student.parent_phone || "—"}
                  </p>
                </div>
                <div className="flex flex-col gap-2 ml-3 shrink-0 text-xs font-medium items-end">
                  <div className="flex gap-3">
                    <Link href={`/students/${student.id}`} className="text-indigo-600">View</Link>
                    <Link href={`/students/${student.id}/edit`} className="text-gray-500">Edit</Link>
                  </div>
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