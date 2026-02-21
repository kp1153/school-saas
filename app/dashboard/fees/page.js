import { db } from "@/db"
import { fees, vidyarthi } from "@/db/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"

export default async function FeesPage() {
  const sabFees = await db
    .select()
    .from(fees)
    .leftJoin(vidyarthi, eq(fees.vidyarthiId, vidyarthi.id))
    .orderBy(fees.tarikh)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1a3f7a] text-white px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-lg">💰 फीस प्रबंधन</div>
        <a href="/dashboard" className="text-sm text-blue-200 hover:text-white">← डैशबोर्ड</a>
      </nav>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-[#1a3f7a]">फीस रिकॉर्ड</h1>
          <Link href="/dashboard/fees/new"
            className="bg-[#1a3f7a] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#0f2d5e]">
            + फीस जमा करें
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                <th className="px-5 py-3 text-left">विद्यार्थी</th>
                <th className="px-5 py-3 text-left">माह</th>
                <th className="px-5 py-3 text-left">कुल फीस</th>
                <th className="px-5 py-3 text-left">जमा</th>
                <th className="px-5 py-3 text-left">बाकी</th>
              </tr>
            </thead>
            <tbody>
              {sabFees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-sm">
                    कोई रिकॉर्ड नहीं
                  </td>
                </tr>
              ) : (
                sabFees.map((row) => (
                  <tr key={row.fees.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3 font-semibold text-[#1a3f7a]">{row.vidyarthi?.naam ?? "—"}</td>
                    <td className="px-5 py-3 text-sm">{row.fees.maah}</td>
                    <td className="px-5 py-3 text-sm">₹{row.fees.rakam}</td>
                    <td className="px-5 py-3 text-sm text-green-600">₹{row.fees.chukaya}</td>
                    <td className="px-5 py-3 text-sm text-red-600 font-bold">₹{row.fees.rakam - row.fees.chukaya}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}