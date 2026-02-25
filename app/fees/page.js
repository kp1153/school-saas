import { db } from "@/lib/db-drizzle";
import { fees, students } from "@/lib/schema";
import { eq, sql } from "drizzle-orm"; // ← यहाँ sql import किया
import Link from "next/link";

export default async function FeesPage() {
  // Fees with student details using Drizzle
  const allFees = await db
    .select({
      id: fees.id,
      amount: fees.amount,
      due_date: fees.due_date,
      paid_date: fees.paid_date,
      status: fees.status,
      student_id: students.id,
      student_name: students.name,
      class: students.class,
      section: students.section,
    })
    .from(fees)
    .leftJoin(students, eq(fees.student_id, students.id))
    .orderBy(fees.due_date);

  // Summary stats - ab sql function kaam karega
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
        <Link
          href="/fees/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
        >
          + Record Payment
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Pending Fees</p>
          <p className="text-2xl font-bold text-gray-900">
            {summary.pending_count || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Paid Fees</p>
          <p className="text-2xl font-bold text-gray-900">
            {summary.paid_count || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Total Pending Amount</p>
          <p className="text-2xl font-bold text-gray-900">
            ₹{summary.total_pending || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-500">Total Collected</p>
          <p className="text-2xl font-bold text-green-600">
            ₹{summary.total_collected || 0}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Paid Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allFees.map((fee) => (
              <tr key={fee.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {fee.student_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {fee.class} - {fee.section}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ₹{fee.amount}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(fee.due_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {fee.paid_date
                    ? new Date(fee.paid_date).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      fee.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {fee.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-3">
                    {fee.status === "pending" && (
                      <Link
                        href={`/fees/${fee.id}/pay`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Mark Paid
                      </Link>
                    )}
                    {fee.status === "paid" && (
                      <Link
                        href={`/fees/${fee.id}/receipt`}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        🖨️ Receipt
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
