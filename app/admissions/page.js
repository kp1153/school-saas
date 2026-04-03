// app/admissions/page.js
export const dynamic = "force-dynamic";

import { db } from "@/lib/db-drizzle";
import { students } from "@/lib/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function AdmissionsPage() {
  // नए admissions = last 30 दिन में जुड़े students
  const allStudents = await db.select().from(students).orderBy(desc(students.admission_date));

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const recent = allStudents.filter(
    (s) => s.admission_date && new Date(s.admission_date) >= thirtyDaysAgo
  );
  const older = allStudents.filter(
    (s) => !s.admission_date || new Date(s.admission_date) < thirtyDaysAgo
  );

  const renderStudent = (s) => (
    <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{s.name}</p>
          <p className="text-gray-500 text-xs mt-0.5">
            Class {s.class} {s.section} · Roll {s.roll_number || "—"}
          </p>
          <p className="text-gray-400 text-xs mt-0.5">
            👤 {s.parent_name || "—"} · 📞 {s.parent_phone || "—"}
          </p>
          <p className="text-indigo-500 text-xs mt-1">
            📅 Admitted:{" "}
            {s.admission_date
              ? new Date(s.admission_date).toLocaleDateString("en-IN", {
                  day: "numeric", month: "long", year: "numeric",
                })
              : "—"}
          </p>
        </div>
        <Link href={`/students/${s.id}`}
          className="text-xs font-medium text-indigo-600 ml-3 shrink-0">
          View →
        </Link>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">🎓 Admissions</h1>
          <p className="text-gray-500 text-xs mt-0.5">
            {allStudents.length} total · {recent.length} this month
          </p>
        </div>
        <Link href="/students/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + New Admission
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 text-center">
          <div className="text-2xl font-bold text-indigo-700">{allStudents.length}</div>
          <div className="text-xs text-indigo-500 mt-1">Total Students</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100 text-center">
          <div className="text-2xl font-bold text-green-700">{recent.length}</div>
          <div className="text-xs text-green-500 mt-1">Last 30 Days</div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 text-center">
          <div className="text-2xl font-bold text-yellow-700">
            {allStudents.filter((s) => s.fee_status !== "paid").length}
          </div>
          <div className="text-xs text-yellow-600 mt-1">Fee Pending</div>
        </div>
      </div>

      {recent.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            🆕 इस महीने के admissions ({recent.length})
          </h2>
          <div className="space-y-2">{recent.map(renderStudent)}</div>
        </div>
      )}

      {older.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">
            पुराने records ({older.length})
          </h2>
          <div className="space-y-2">{older.map(renderStudent)}</div>
        </div>
      )}

      {allStudents.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">
          अभी कोई admission नहीं है।
        </div>
      )}
    </div>
  );
}