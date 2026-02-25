import Link from "next/link";
import { db } from "@/lib/db-drizzle";
import { students, teachers, fees, attendance, exams, notices } from "@/lib/schema";
import { sql, eq } from "drizzle-orm";

export default async function DashboardPage() {
  const today = new Date().toISOString().split("T")[0];

  const [studentCount] = await db.select({ count: sql`COUNT(*)` }).from(students);
  const [teacherCount] = await db.select({ count: sql`COUNT(*)` }).from(teachers);
  const [pendingFees] = await db
    .select({ total: sql`SUM(amount)`, count: sql`COUNT(*)` })
    .from(fees)
    .where(sql`status = 'pending'`);
  const [paidFees] = await db
    .select({ total: sql`SUM(amount)` })
    .from(fees)
    .where(sql`status = 'paid'`);
  const [todayPresent] = await db
    .select({ count: sql`COUNT(*)` })
    .from(attendance)
    .where(sql`date = ${today} AND status = 'present'`);
  const [todayAbsent] = await db
    .select({ count: sql`COUNT(*)` })
    .from(attendance)
    .where(sql`date = ${today} AND status = 'absent'`);
  const [examCount] = await db.select({ count: sql`COUNT(*)` }).from(exams);
  const [noticeCount] = await db.select({ count: sql`COUNT(*)` }).from(notices);

  const recentNotices = await db
    .select()
    .from(notices)
    .orderBy(sql`created_at DESC`)
    .limit(3);

  const upcomingExams = await db
    .select()
    .from(exams)
    .where(sql`exam_date >= ${today}`)
    .orderBy(sql`exam_date ASC`)
    .limit(3);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            })}
          </p>
        </div>
        <Link href="/students/add"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition text-sm font-medium shadow-sm">
          + Add New Student
        </Link>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">🎓</div>
          <div className="text-2xl font-bold text-gray-900">{studentCount?.count || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Total Students</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">👨‍🏫</div>
          <div className="text-2xl font-bold text-gray-900">{teacherCount?.count || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Total Teachers</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">⚠️</div>
          <div className="text-2xl font-bold text-red-600">₹{pendingFees?.total || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Pending Fees ({pendingFees?.count || 0})</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-600">₹{paidFees?.total || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Fees Collected</div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">🟢</div>
          <div className="text-2xl font-bold text-green-600">{todayPresent?.count || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Present Today</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">🔴</div>
          <div className="text-2xl font-bold text-red-500">{todayAbsent?.count || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Absent Today</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">📝</div>
          <div className="text-2xl font-bold text-gray-900">{examCount?.count || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Total Exams</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="text-3xl mb-2">📋</div>
          <div className="text-2xl font-bold text-gray-900">{noticeCount?.count || 0}</div>
          <div className="text-sm text-gray-500 mt-1">Notices Posted</div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/students/add" className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 py-1">
              ➕ Add Student
            </Link>
            <Link href="/fees/add" className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 py-1">
              💰 Record Fee Payment
            </Link>
            <Link href="/attendance/mark" className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 py-1">
              ✅ Mark Attendance
            </Link>
            <Link href="/exams/add" className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 py-1">
              📝 Schedule Exam
            </Link>
            <Link href="/notices/add" className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 py-1">
              📋 Post Notice
            </Link>
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Upcoming Exams</h2>
          {upcomingExams.length === 0 ? (
            <p className="text-sm text-gray-400">कोई upcoming exam नहीं।</p>
          ) : (
            <div className="space-y-3">
              {upcomingExams.map(exam => (
                <div key={exam.id} className="flex justify-between items-center text-sm">
                  <div>
                    <div className="font-medium text-gray-900">{exam.name}</div>
                    <div className="text-gray-500 text-xs">{exam.class} — {exam.subject}</div>
                  </div>
                  <div className="text-indigo-600 text-xs font-medium">{exam.exam_date}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Notices */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Notices</h2>
          {recentNotices.length === 0 ? (
            <p className="text-sm text-gray-400">कोई notice नहीं।</p>
          ) : (
            <div className="space-y-3">
              {recentNotices.map(notice => (
                <div key={notice.id} className="text-sm">
                  <div className="font-medium text-gray-900">{notice.title}</div>
                  <div className="text-gray-500 text-xs mt-0.5">
                    {notice.category} •{" "}
                    <span className={
                      notice.priority === "urgent" ? "text-red-500" :
                      notice.priority === "important" ? "text-yellow-500" :
                      "text-gray-400"
                    }>
                      {notice.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}