import { Inter } from "next/font/google";
import FlashMessageContainer from "@/components/FlashMessageContainer";
import Link from "next/link";
import { cookies } from "next/headers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EduSaaS | School Management Platform",
  description: "Complete solution for private educational institutions",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#4338ca",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="EduSaaS" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js')})}`,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-gray-100`}>
        <FlashMessageContainer />

        {session ? (
          <div className="flex min-h-screen">
            <aside className="hidden md:flex w-64 bg-indigo-900 text-white flex-col fixed h-full overflow-y-auto">
              <div className="px-6 py-5 border-b border-indigo-800">
                <div className="text-2xl font-bold text-white">EduSaaS</div>
                <div className="text-indigo-300 text-xs mt-1">
                  School Management
                </div>
              </div>
              <nav className="px-4 py-6 space-y-1 flex-1">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium"
                >
                  📊 Dashboard
                </Link>
                <Link
                  href="/students"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium"
                >
                  🎓 Students
                </Link>
                <Link
                  href="/admissions"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium"
                >
                  📋 Admissions
                </Link>
                <Link
                  href="/teachers"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium"
                >
                  👨‍🏫 Teachers
                </Link>
                <Link
                  href="/fees"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium"
                >
                  💰 Fees
                </Link>
                <Link
                  href="/attendance"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium"
                >
                  ✅ Attendance
                </Link>
                <Link
                  href="/exams"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium"
                >
                  📝 Exams & Results
                </Link>
                <Link
                  href="/notices"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium"
                >
                  📋 Notice Board
                </Link>
                <Link
                  href="/timetable"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium"
                >
                  🗓️ Timetable
                </Link>
                <Link
                  href="/reports"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium"
                >
                  📊 Reports
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium"
                >
                  ⚙️ Settings
                </Link>
                <Link
                  href="/logout"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-indigo-800 transition text-sm font-medium"
                >
                  🚪 Logout
                </Link>
              </nav>
            </aside>

            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-indigo-900 flex items-center justify-between px-4 py-3 shadow-md">
              <div className="text-white font-bold text-lg">EduSaaS</div>
              <Link href="/logout" className="text-red-300 text-sm">
                Logout
              </Link>
            </div>

            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex overflow-x-auto">
              <Link
                href="/dashboard"
                className="flex-1 min-w-[56px] flex flex-col items-center justify-center py-2 text-[10px] font-medium text-gray-500"
              >
                📊<span>Home</span>
              </Link>
              <Link
                href="/students"
                className="flex-1 min-w-[56px] flex flex-col items-center justify-center py-2 text-[10px] font-medium text-gray-500"
              >
                🎓<span>Students</span>
              </Link>
              <Link
                href="/admissions"
                className="flex-1 min-w-[56px] flex flex-col items-center justify-center py-2 text-[10px] font-medium text-gray-500"
              >
                📋<span>Admit</span>
              </Link>
              <Link
                href="/fees"
                className="flex-1 min-w-[56px] flex flex-col items-center justify-center py-2 text-[10px] font-medium text-gray-500"
              >
                💰<span>Fees</span>
              </Link>
              <Link
                href="/attendance"
                className="flex-1 min-w-[56px] flex flex-col items-center justify-center py-2 text-[10px] font-medium text-gray-500"
              >
                ✅<span>Attend</span>
              </Link>
              <Link
                href="/exams"
                className="flex-1 min-w-[56px] flex flex-col items-center justify-center py-2 text-[10px] font-medium text-gray-500"
              >
                📝<span>Exams</span>
              </Link>
              <Link
                href="/notices"
                className="flex-1 min-w-[56px] flex flex-col items-center justify-center py-2 text-[10px] font-medium text-gray-500"
              >
                📋<span>Notices</span>
              </Link>
              <Link
                href="/reports"
                className="flex-1 min-w-[56px] flex flex-col items-center justify-center py-2 text-[10px] font-medium text-gray-500"
              >
                📊<span>Reports</span>
              </Link>
              <Link
                href="/timetable"
                className="flex-1 min-w-[56px] flex flex-col items-center justify-center py-2 text-[10px] font-medium text-gray-500"
              >
                🗓️<span>Time</span>
              </Link>
              <Link
                href="/teachers"
                className="flex-1 min-w-[56px] flex flex-col items-center justify-center py-2 text-[10px] font-medium text-gray-500"
              >
                👨‍🏫<span>Teachers</span>
              </Link>
              <Link
                href="/settings"
                className="flex-1 min-w-[56px] flex flex-col items-center justify-center py-2 text-[10px] font-medium text-gray-500"
              >
                ⚙️<span>Settings</span>
              </Link>
            </div>

            <main className="w-full md:ml-64 flex-1 p-4 pt-16 pb-24 md:pt-6 md:pb-6 md:p-8">
              {children}
            </main>
          </div>
        ) : (
          <div>
            <nav className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <div className="text-xl font-bold text-indigo-600">
                    EduSaaS
                  </div>
                  <Link
                    href="/login"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </nav>
            <main>{children}</main>
          </div>
        )}
      </body>
    </html>
  );
}
