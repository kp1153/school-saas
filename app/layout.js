import { Inter } from 'next/font/google'
import FlashMessageContainer from '@/components/FlashMessageContainer'
import Link from 'next/link'
import { cookies } from 'next/headers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EduSaaS | School Management Platform',
  description: 'Complete solution for private educational institutions',
}

export default async function RootLayout({ children }) {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        <FlashMessageContainer />
        
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <Link href="/" className="text-2xl font-bold text-indigo-600">
                  EduSaaS
                </Link>
                <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium">
                  v1.0.0
                </span>
              </div>

              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-600 hover:text-indigo-600 transition text-sm font-medium">
                  Home
                </Link>
                
                {session ? (
                  <>
                    <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 transition text-sm font-medium">
                      Dashboard
                    </Link>
                    <Link href="/students" className="text-gray-600 hover:text-indigo-600 transition text-sm font-medium">
                      Students
                    </Link>
                    <Link href="/teachers" className="text-gray-600 hover:text-indigo-600 transition text-sm font-medium">
                      Teachers
                    </Link>
                    <Link href="/fees" className="text-gray-600 hover:text-indigo-600 transition text-sm font-medium">
                      Fees
                    </Link>
                    <Link 
                      href="/logout" 
                      className="text-gray-600 hover:text-indigo-600 transition text-sm font-medium"
                    >
                      Logout
                    </Link>
                  </>
                ) : (
                  <Link 
                    href="/login" 
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition text-sm font-medium"
                  >
                    Sign In
                  </Link>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-gray-500">
              © 2026 EduSaaS. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}