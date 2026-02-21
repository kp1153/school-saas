import { db } from "@/db"
import { vidyarthi } from "@/db/schema"

export default async function VidyarthiPage() {
  const sabVidyarthi = await db.select().from(vidyarthi).orderBy(vidyarthi.kaksha)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1a3f7a] text-white px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-lg">🎓 विद्यार्थी सूची</div>
        <a href="/dashboard" className="text-sm text-blue-200 hover:text-white">← डैशबोर्ड</a>
      </nav>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-[#1a3f7a]">सभी विद्यार्थी</h1>
          <a href="/dashboard/vidyarthi/new"
            className="bg-[#1a3f7a] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#0f2d5e]">
            + नया विद्यार्थी
          </a>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                <th className="px-5 py-3 text-left">नाम</th>
                <th className="px-5 py-3 text-left">कक्षा</th>
                <th className="px-5 py-3 text-left">पिता का नाम</th>
                <th className="px-5 py-3 text-left">मोबाइल</th>
              </tr>
            </thead>
            <tbody>
              {sabVidyarthi.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-400 text-sm">
                    कोई विद्यार्थी नहीं मिला
                  </td>
                </tr>
              ) : (
                sabVidyarthi.map((v) => (
                  <tr key={v.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-5 py-3 font-semibold text-[#1a3f7a]">{v.naam}</td>
                    <td className="px-5 py-3 text-sm">{v.kaksha}वीं</td>
                    <td className="px-5 py-3 text-sm">{v.pitaNaam ?? "—"}</td>
                    <td className="px-5 py-3 text-sm">{v.mobile ?? "—"}</td>
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