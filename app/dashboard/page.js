import Link from "next/link";
import { db } from "@/lib/db-drizzle";
import { students, teachers, fees } from "@/lib/schema";
import { sql } from "drizzle-orm";

export default async function DashboardPage() {
  const [studentCount] = await db
    .select({ count: sql`COUNT(*)` })
    .from(students);
  const [teacherCount] = await db
    .select({ count: sql`COUNT(*)` })
    .from(teachers);
  const [pendingFees] = await db
    .select({
      total: sql`SUM(amount)`,
      count: sql`COUNT(*)`,
    })
    .from(fees)
    .where(sql`status = 'pending'`);
  const [paidFees] = await db
    .select({
      total: sql`SUM(amount)`,
    })
    .from(fees)
    .where(sql`status = 'paid'`);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Here's what's happening.
          </p>
        </div>
        <Link
          href="/students/add"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition text-sm font-medium shadow-sm"
        >
          + Add New Student
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">🎓</div>
          <div className="text-2xl font-bold text-gray-900">
            {studentCount?.count || 0}
          </div>
          <div className="text-sm text-gray-500 mt-1">Total Students</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">👨‍🏫</div>
          <div className="text-2xl font-bold text-gray-900">
            {teacherCount?.count || 0}
          </div>
          <div className="text-sm text-gray-500 mt-1">Total Teachers</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">⚠️</div>
          <div className="text-2xl font-bold text-red-600">
            ₹{pendingFees?.total || 0}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Pending Fees ({pendingFees?.count || 0})
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-600">
            ₹{paidFees?.total || 0}
          </div>
          <div className="text-sm text-gray-500 mt-1">Fees Collected</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Link
          href="/students"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-indigo-300 transition"
        >
          <div className="text-2xl mb-3">🎓</div>
          <div className="font-semibold text-gray-900">Manage Students</div>
          <div className="text-sm text-gray-500 mt-1">
            View, add, edit students
          </div>
        </Link>
        <Link
          href="/teachers"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-indigo-300 transition"
        >
          <div className="text-2xl mb-3">👨‍🏫</div>
          <div className="font-semibold text-gray-900">Manage Teachers</div>
          <div className="text-sm text-gray-500 mt-1">
            View, add, edit teachers
          </div>
        </Link>
        <Link
          href="/fees"
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-indigo-300 transition"
        >
          <div className="text-2xl mb-3">💰</div>
          <div className="font-semibold text-gray-900">Fee Management</div>
          <div className="text-sm text-gray-500 mt-1">
            Track and collect fees
          </div>
        </Link>
      </div>
    </div>
  );
}
