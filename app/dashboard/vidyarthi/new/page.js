"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NayaVidyarthi() {
  const router = useRouter()
  const [form, setForm] = useState({ naam: "", kaksha: "", pitaNaam: "", mobile: "" })
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await fetch("/api/vidyarthi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) router.push("/dashboard/vidyarthi")
    else setError("कुछ गलत हुआ, दोबारा कोशिश करें")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1a3f7a] text-white px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-lg">➕ नया विद्यार्थी</div>
        <a href="/dashboard/vidyarthi" className="text-sm text-blue-200 hover:text-white">← वापस</a>
      </nav>
      <div className="max-w-lg mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {[
            { name: "naam", label: "विद्यार्थी का नाम", type: "text", required: true },
            { name: "kaksha", label: "कक्षा (1-10)", type: "number", required: true },
            { name: "pitaNaam", label: "पिता का नाम", type: "text", required: false },
            { name: "mobile", label: "मोबाइल नंबर", type: "tel", required: false },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{field.label}</label>
              <input
                type={field.type}
                required={field.required}
                value={form[field.name]}
                onChange={e => setForm({ ...form, [field.name]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1a3f7a]"
              />
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