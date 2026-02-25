'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ParentLoginPage() {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    const res = await fetch('/api/parent-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    })
    if (res.ok) {
      const data = await res.json()
      router.push(`/parent/dashboard`)
    } else {
      setError('Phone number या password गलत है।')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="text-4xl mb-4">👨‍👩‍👧</div>
          <h2 className="text-3xl font-bold text-gray-900">Parent Portal</h2>
          <p className="text-gray-500 text-sm mt-2">अपने बच्चे की जानकारी देखें</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="अपना phone number डालें"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password डालें"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
            Login
          </button>
          <div className="text-center text-sm text-gray-500">
            <a href="/login" className="text-indigo-600 hover:text-indigo-500">
              School Admin Login →
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}