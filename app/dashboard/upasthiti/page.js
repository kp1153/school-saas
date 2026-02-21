"use client"
import { useState, useEffect } from "react"

export default function Upasthiti() {
  const [vidyarthiList, setVidyarthiList] = useState([])
  const [kaksha, setKaksha] = useState("")
  const [tarikh, setTarikh] = useState(new Date().toISOString().split("T")[0])
  const [upasthiti, setUpasthiti] = useState({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch("/api/vidyarthi").then(r => r.json()).then(setVidyarthiList)
  }, [])

  const filtered = kaksha ? vidyarthiList.filter(v => v.kaksha === Number(kaksha)) : vidyarthiList

  async function handleSave() {
    const res = await fetch("/api/upasthiti", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tarikh, upasthiti }),
    })
    if (res.ok) setSaved(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#1a3f7a] text-white px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-lg">📋 उपस्थिति</div>
        <a href="/dashboard" className="text-sm text-blue-200 hover:text-white">← डैशबोर्ड</a>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="flex gap-4">
          <input type="date" value={tarikh}
            onChange={e => setTarikh(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#1a3f7a]" />
          <select value={kaksha} onChange={e => setKaksha(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-[#1a3f7a]">
            <option value="">सभी कक्षाएं</option>
            {[1,2,3,4,5,6,7,8,9,10].map(k => <option key={k} value={k}>{k}वीं</option>)}
          </select>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                <th className="px-5 py-3 text-left">नाम</th>
                <th className="px-5 py-3 text-left">कक्षा</th>
                <th className="px-5 py-3 text-left">उपस्थिति</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id} className="border-t border-gray-50">
                  <td className="px-5 py-3 font-semibold text-[#1a3f7a]">{v.naam}</td>
                  <td className="px-5 py-3 text-sm">{v.kaksha}वीं</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-3">
                      {["उपस्थित","अनुपस्थित","छुट्टी"].map(status => (
                        <label key={status} className="flex items-center gap-1 text-sm cursor-pointer">
                          <input type="radio" name={`u-${v.id}`}
                            checked={upasthiti[v.id] === status}
                            onChange={() => setUpasthiti({ ...upasthiti, [v.id]: status })} />
                          {status}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {saved && <p className="text-green-600 text-sm font-semibold">✅ उपस्थिति सेव हो गई</p>}
        <button onClick={handleSave}
          className="bg-[#1a3f7a] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#0f2d5e]">
          सेव करें
        </button>
      </div>
    </div>
  )
}