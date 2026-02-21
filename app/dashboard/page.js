import Link from "next/link"
import { db } from "@/db"
import { vidyarthi, fees } from "@/db/schema"
import { sql } from "drizzle-orm"

export default async function Dashboard() {
  const kulVidyarthi = await db.select({ count: sql`count(*)` }).from(vidyarthi)
  const kulFees = await db.select({ total: sql`sum(rakam)` }).from(fees)
  const baakiFees = await db.select({ total: sql`sum(rakam - chukaya)` }).from(fees)

  const cards = [
    { icon: "🎓", label: "कुल विद्यार्थी", value: kulVidyarthi[0].count },
    { icon: "💰", label: "कुल फीस", value: `₹${Number(kulFees[0].total || 0).toLocaleString("hi-IN")}` },
    { icon: "⚠️", label: "बाकी फीस", value: `₹${Number(baakiFees[0].total || 0).toLocaleString("hi-IN")}` },
  ]

  const menu = [
    { href: "/dashboard/vidyarthi", icon: "🎓", label: "विद्यार्थी" },
    { href: "/dashboard/fees", icon: "💰", label: "फीस" },
    { href: "/dashboard/upasthiti", icon: "📋", label: "उपस्थिति" },
    { href: "/dashboard/result", icon: "📊", label: "परिणाम" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1a3f7a] text-white px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-lg">🏫 विद्यालय प्रबंधन</div>
        <Link href="/api/logout" className="text-sm text-blue-200 hover:text-white">लॉगआउट</Link>
      </nav>
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <div className="grid grid-cols-3 gap-4">
          {cards.map((c, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="text-2xl font-bold text-[#1a3f7a]">{c.value}</div>
              <div className="text-xs text-gray-400 mt-1">{c.label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {menu.map((m, i) => (
            <Link key={i} href={m.href}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center hover:border-[#1a3f7a] hover:shadow-md transition">
              <div className="text-3xl mb-2">{m.icon}</div>
              <div className="font-semibold text-[#1a3f7a]">{m.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}