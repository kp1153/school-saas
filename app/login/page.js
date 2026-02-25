import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import PasswordInput from '@/components/PasswordInput'

async function login(formData) {
  'use server'
  
  const email = formData.get('email')
  const password = formData.get('password')
  const cookieStore = await cookies()
  
  if (email === 'hamaramorcha1153@gmail.com' && password === 'Maqbool2@') {
    // Vercel ke liye domain bhi set karo
    cookieStore.set('session', 'demo-session-token', {
      httpOnly: true,
      secure: true,  // Vercel par secure true rahega
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',  // Vercel ke liye ye zaroori hai
      domain: process.env.NODE_ENV === 'production' 
        ? '.vercel.app'  // production mein domain set karo
        : undefined      // localhost mein undefined rakho
    })
    redirect('/dashboard')
  } else {
    redirect('/login?error=Invalid credentials')
  }
}

export default async function LoginPage({ searchParams }) {
  const params = await searchParams
  const error = params?.error

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign in to EduSaaS
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            Invalid email or password
          </div>
        )}

        <form action={login} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue="hamaramorcha1153@gmail.com"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <PasswordInput defaultValue="Maqbool2@" />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <Link href="/" className="text-indigo-600 hover:text-indigo-500">
              ← Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}