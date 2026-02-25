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

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-100`}>
        <FlashMessageContainer />

        {session ? (
          <div className="flex min-h-screen">
            <aside className="w-64 bg-indigo-900 text-white flex flex-col fixed h-full overflow-y-auto">
              <div className="px-6 py-5 border-b border-indigo-800">
                <div className="text-2xl font-bold text-white">EduSaaS</div>
                <div className="text-indigo-300 text-xs mt-1">
                  School Management
                </div>
              </div>
             <nav className="px-4 py-6 space-y-1">
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
                  href="/parent/login"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium"
                >
                  👨‍👩‍👧 Parent Portal
                </Link>
                <Link
                  href="/reports"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-indigo-100 hover:bg-indigo-800 transition text-sm font-medium"
                >
                  📊 Reports
                </Link>
                <Link
                  href="/logout"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-indigo-800 transition text-sm font-medium"
                >
                  🚪 Logout
                </Link>
              </nav>
            </aside>

            <main className="ml-64 flex-1 p-8">{children}</main>
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
