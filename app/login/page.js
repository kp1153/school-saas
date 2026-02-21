"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [pass, setPass] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pass }),
    })
    if (res.ok) router.push("/dashboard")
    else setError("गलत पासवर्ड")
  }

  return (
    <div className="min-h-screen bg-[#1a3f7a] flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white rounded-xl p-8 w-80 space-y-4 shadow-xl">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#1a3f7a]">विद्यालय प्रबंधन</div>
          <div className="text-gray-400 text-sm mt-1">लॉगिन करें</div>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            placeholder="पासवर्ड डालें"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#1a3f7a] pr-10"
            value={pass}
            onChange={e => setPass(e.target.value)} />
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-700">
            {show ? "🙈" : "👁️"}
          </button>
        </div>
        <button type="submit"
          className="w-full bg-[#1a3f7a] text-white py-2.5 rounded-lg font-semibold hover:bg-[#0f2d5e]">
          लॉगिन
        </button>
      </form>
    </div>
  )
}