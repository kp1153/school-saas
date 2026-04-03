// app/fees/page.js
export const dynamic = "force-dynamic";

import { db } from "@/lib/db-drizzle";
import { fees, students } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";
import Link from "next/link";

export default async function FeesPage({ searchParams }) {
  const params = await searchParams;
  const tab = params?.tab || "all";

  const allFees = await db
    .select({
      id: fees.id,
      amount: fees.amount,
      due_date: fees.due_date,
      paid_date: fees.paid_date,
      status: fees.status,
      student_name: students.name,
      student_id: fees.student_id,
      class: students.class,
      section: students.section,
      parent_phone: students.parent_phone,
      parent_name: students.parent_name,
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

  const displayed = tab === "defaulters"
    ? allFees.filter((f) => f.status === "pending")
    : allFees;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-500 text-xs mt-0.5">Track and manage payments</p>
        </div>
        <Link href="/fees/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + Record
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-red-50 rounded-xl p-4 border border-red-100">
          <p className="text-xs text-red-500 font-medium">Pending</p>
          <p className="text-2xl font-bold text-red-600 mt-1">₹{summary.total_pending || 0}</p>
          <p className="text-xs text-red-400 mt-0.5">{summary.pending_count || 0} records</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="text-xs text-green-600 font-medium">Collected</p>
          <p className="text-2xl font-bold text-green-700 mt-1">₹{summary.total_collected || 0}</p>
          <p className="text-xs text-green-500 mt-0.5">{summary.paid_count || 0} records</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <a href="/fees?tab=all"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            tab === "all"
              ? "bg-indigo-600 text-white"
              : "bg-white border border-gray-200 text-gray-600"
          }`}>
          सभी ({allFees.length})
        </a>
        <a href="/fees?tab=defaulters"
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            tab === "defaulters"
              ? "bg-red-600 text-white"
              : "bg-white border border-gray-200 text-red-600"
          }`}>
          🔴 Defaulters ({allFees.filter((f) => f.status === "pending").length})
        </a>
      </div>

      {displayed.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">
          {tab === "defaulters" ? "कोई defaulter नहीं। 🎉" : "No fee records."}
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((fee) => {
            const phone = fee.parent_phone?.replace(/\D/g, "") || "";
            const fullPhone = phone.startsWith("91") ? phone : `91${phone}`;
            const msg = encodeURIComponent(
              `प्रिय ${fee.parent_name || "अभिभावक"},\n\n${fee.student_name} की ₹${fee.amount} fees अभी बाकी है। कृपया जल्द जमा करें।\n\n— School`
            );
            return (
              <div key={fee.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">{fee.student_name}</p>
                      <span className={`shrink-0 px-2 py-0.5 text-xs rounded-full font-medium ${
                        fee.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {fee.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs">Class {fee.class} {fee.section}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Due: {new Date(fee.due_date).toLocaleDateString("en-IN")}
                      {fee.paid_date && ` · Paid: ${new Date(fee.paid_date).toLocaleDateString("en-IN")}`}
                    </p>
                  </div>
                  <div className="ml-3 shrink-0 text-right space-y-1">
                    <p className="text-sm font-bold text-gray-900">₹{fee.amount}</p>
                    {fee.status === "pending" && (
                      <div className="flex flex-col gap-1 items-end">
                        <Link href={`/fees/${fee.id}/pay`}
                          className="text-xs font-medium text-indigo-600">
                          Mark Paid
                        </Link>
                        {fee.parent_phone && (
                          <a href={`https://wa.me/${fullPhone}?text=${msg}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-xs font-medium text-green-600">
                            📲 Remind
                          </a>
                        )}
                      </div>
                    )}
                    {fee.status === "paid" && (
                      <Link href={`/fees/${fee.id}/receipt`}
                        className="text-xs font-medium text-green-600">
                        🖨️ Receipt
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}