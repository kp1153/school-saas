"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function NayiFees() {
  const router = useRouter()
  const [vidyarthiList, setVidyarthiList] = useState([])
  const [form, setForm] = useState({ vidyarthiId: "", maah: "", rakam: "", chukaya: "" })
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/vidyarthi").then(r => r.json()).then(setVidyarthiList)
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await fetch("/api/fees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) router.push("/dashboard/fees")
    else setError("कुछ गलत हुआ, दोबारा कोशिश करें")
  }

  const maahList = ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1a3f7a] text-white px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-lg">➕ फीस जमा करें</div>
        <a href="/dashboard/fees" className="text-sm text-blue-200 hover:text-white">← वापस</a>
      </nav>
      <div className="max-w-lg mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">विद्यार्थी</label>
            <select required value={form.vidyarthiId}
              onChange={e => setForm({ ...form, vidyarthiId: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1a3f7a]">
              <option value="">— चुनें —</option>
              {vidyarthiList.map(v => (
                <option key={v.id} value={v.id}>{v.naam} — कक्षा {v.kaksha}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">माह</label>
            <select required value={form.maah}
              onChange={e => setForm({ ...form, maah: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1a3f7a]">
              <option value="">— चुनें —</option>
              {maahList.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          {[
            { name: "rakam", label: "कुल फीस (₹)" },
            { name: "chukaya", label: "जमा राशि (₹)" },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
              <input type="number" required value={form[field.name]}
                onChange={e => setForm({ ...form, [field.name]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1a3f7a]" />
            </div>
          ))}
          <button type="submit"
            className="w-full bg-[#1a3f7a] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0f2d5e]">
            सेव करें
          </button>
        </form>
      </div>
    </div>
  )
}