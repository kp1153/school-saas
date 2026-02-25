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
      <body className={`${inter.className} min-h-screen bg-gray-100`}>
        <FlashMessageContainer />
        
        {session ? (
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-indigo-900 text-white flex flex-col fixed h-full">
              <div className="px-6 py-5 border-b border-indigo-800">
                <div className="text-2xl font-bold text-white">EduSaaS</div>
                <div className="text-indigo-300 text-xs mt-1">School Management</div>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-1">
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium">
                  📊 Dashboard
                </Link>
                <Link href="/students" className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium">
                  🎓 Students
                </Link>
                <Link href="/teachers" className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium">
                  👨‍🏫 Teachers
                </Link>
                <Link href="/fees" className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium">
                  💰 Fees
                </Link>
                <Link href="/attendance" className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium">
                  ✅ Attendance
                </Link>
                <Link href="/notices" className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium">
                📋 Notice Board
                </Link>

                <Link href="/exams" className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium">
                📝 Exams & Results
                </Link>
              </nav>
              <div className="px-4 py-4 border-t border-indigo-800">
                <Link href="/logout" className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-300 hover:bg-indigo-800 transition text-sm">
                  🚪 Logout
                </Link>
              </div>
            </aside>

            {/* Main content */}
            <main className="ml-64 flex-1 p-8">
              {children}
            </main>
          </div>
        ) : (
          <main>{children}</main>
        )}
      </body>
    </html>
  )
}