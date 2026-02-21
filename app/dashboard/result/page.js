"use client"
import { useState, useEffect } from "react"

export default function Result() {
  const [vidyarthiList, setVidyarthiList] = useState([])
  const [kaksha, setKaksha] = useState("")
  const [selected, setSelected] = useState("")
  const [marks, setMarks] = useState({})
  const [saved, setSaved] = useState(false)

  const vishay = ["हिंदी", "अंग्रेजी", "गणित", "विज्ञान", "सामाजिक विज्ञान"]

  useEffect(() => {
    fetch("/api/vidyarthi").then(r => r.json()).then(setVidyarthiList)
  }, [])

  const filtered = kaksha ? vidyarthiList.filter(v => v.kaksha === Number(kaksha)) : vidyarthiList

  async function handleSave() {
    const res = await fetch("/api/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vidyarthiId: selected, marks }),
    })
    if (res.ok) setSaved(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1a3f7a] text-white px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-lg">📊 परिणाम</div>
        <a href="/dashboard" className="text-sm text-blue-200 hover:text-white">← डैशबोर्ड</a>
      </nav>
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="flex gap-4">
          <select value={kaksha} onChange={e => { setKaksha(e.target.value); setSelected("") }}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#1a3f7a]">
            <option value="">सभी कक्षाएं</option>
            {[1,2,3,4,5,6,7,8,9,10].map(k => <option key={k} value={k}>{k}वीं</option>)}
          </select>
          <select value={selected} onChange={e => { setSelected(e.target.value); setSaved(false) }}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#1a3f7a]">
            <option value="">— विद्यार्थी चुनें —</option>
            {filtered.map(v => <option key={v.id} value={v.id}>{v.naam}</option>)}
          </select>
        </div>
        {selected && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            {vishay.map(v => (
              <div key={v} className="flex items-center gap-4">
                <label className="w-40 text-sm font-semibold text-gray-700">{v}</label>
                <input type="number" min="0" max="100"
                  value={marks[v] || ""}
                  onChange={e => setMarks({ ...marks, [v]: e.target.value })}
                  placeholder="अंक (100 में)"
                  className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#1a3f7a] w-36" />
              </div>
            ))}
            {saved && <p className="text-green-600 text-sm font-semibold">✅ परिणाम सेव हो गया</p>}
            <button onClick={handleSave}
              className="w-full bg-[#1a3f7a] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0f2d5e]">
              सेव करें
            </button>
          </div>
        )}
      </div>
    </div>
  )
}