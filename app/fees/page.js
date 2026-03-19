export const dynamic = "force-dynamic";

import { db } from "@/lib/db-drizzle";
import { fees, students } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import Link from "next/link";

export default async function FeesPage() {
  const allFees = await db
    .select({
      id: fees.id,
      amount: fees.amount,
      due_date: fees.due_date,
      paid_date: fees.paid_date,
      status: fees.status,
      student_name: students.name,
      class: students.class,
      section: students.section,
    })
    .from(fees)
    .leftJoin(students, eq(fees.student_id, students.id))
    .orderBy(fees.due_date);

  const stats = await db
    .select({
      pending_count: sql`COUNT(CASE WHEN ${fees.status} = 'pending' THEN 1 END)`,
      paid_count: sql`COUNT(CASE WHEN ${fees.status} = 'paid' THEN 1 END)`,
      total_pending: sql`SUM(CASE WHEN ${fees.status} = 'pending' THEN ${fees.amount} ELSE 0 END)`,
      total_collected: sql`SUM(CASE WHEN ${fees.status} = 'paid' THEN ${fees.amount} ELSE 0 END)`,
    })
    .from(fees);

  const summary = stats[0] || {};

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage student fee payments</p>
        </div>
        <Link href="/fees/add"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition text-sm font-medium shadow-sm">
          + Record Payment
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Pending Count</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{summary.pending_count || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Paid Count</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{summary.paid_count || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Pending</p>
          <p className="text-2xl font-bold text-red-500 mt-1">₹{summary.total_pending || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Collected</p>
          <p className="text-2xl font-bold text-green-600 mt-1">₹{summary.total_collected || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allFees.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  No fee records found. Add the first payment.
                </td>
              </tr>
            ) : (
              allFees.map((fee) => (
                <tr key={fee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{fee.student_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{fee.class} - {fee.section}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{fee.amount}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(fee.due_date).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {fee.paid_date ? new Date(fee.paid_date).toLocaleDateString("en-IN") : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      fee.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {fee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-3">
                      {fee.status === "pending" && (
                        <Link href={`/fees/${fee.id}/pay`}
                          className="text-indigo-600 hover:text-indigo-900 font-medium">
                          Mark Paid
                        </Link>
                      )}
                      {fee.status === "paid" && (
                        <Link href={`/fees/${fee.id}/receipt`}
                          className="text-green-600 hover:text-green-800 font-medium">
                          🖨️ Receipt
                        </Link>
                      )}
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