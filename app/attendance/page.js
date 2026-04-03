// app/attendance/page.js
export const dynamic = "force-dynamic";

import { db } from "@/lib/db-drizzle";
import { students, attendance } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function AttendancePage({ searchParams }) {
  const params = await searchParams;
  const today = new Date().toISOString().split("T")[0];
  const selectedDate = params?.date || today;
  const selectedClass = params?.class || "";

  const allStudents = await db.select().from(students);
  const classes = [...new Set(allStudents.map((s) => s.class))].sort();

  const filteredStudents = selectedClass
    ? allStudents.filter((s) => s.class === selectedClass)
    : allStudents;

  const todayAttendance = await db
    .select()
    .from(attendance)
    .where(eq(attendance.date, selectedDate));

  const attendanceMap = {};
  todayAttendance.forEach((a) => { attendanceMap[a.student_id] = a.status; });

  const presentCount = filteredStudents.filter((s) => attendanceMap[s.id] === "present").length;
  const absentCount = filteredStudents.filter((s) => attendanceMap[s.id] === "absent").length;
  const notMarked = filteredStudents.filter((s) => !attendanceMap[s.id]).length;

  // Absent students with phone numbers — for WhatsApp links
  const absentWithPhone = filteredStudents.filter(
    (s) => attendanceMap[s.id] === "absent" && s.parent_phone
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500 text-xs mt-0.5">{selectedDate}</p>
        </div>
        <Link
          href={`/attendance/mark?date=${selectedDate}&class=${selectedClass}`}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Mark
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm">
        <form className="flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Date</label>
              <input type="date" name="date" defaultValue={selectedDate}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Class</label>
              <select name="class" defaultValue={selectedClass}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">All Classes</option>
                {classes.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-lg text-sm font-medium">
            Filter
          </button>
        </form>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
          <div className="text-xl font-bold text-green-700">{presentCount}</div>
          <div className="text-xs text-green-600 mt-0.5">Present</div>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center border border-red-100">
          <div className="text-xl font-bold text-red-600">{absentCount}</div>
          <div className="text-xs text-red-500 mt-0.5">Absent</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-200">
          <div className="text-xl font-bold text-gray-500">{notMarked}</div>
          <div className="text-xs text-gray-400 mt-0.5">Not Marked</div>
        </div>
      </div>

      {/* WhatsApp Alert Section */}
      {absentWithPhone.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5">
          <p className="text-sm font-semibold text-green-800 mb-3">
            📲 Absent Parents को WhatsApp करो ({absentWithPhone.length})
          </p>
          <div className="space-y-2">
            {absentWithPhone.map((s) => {
              const phone = s.parent_phone.replace(/\D/g, "");
              const fullPhone = phone.startsWith("91") ? phone : `91${phone}`;
              const msg = encodeURIComponent(
                `प्रिय ${s.parent_name || "अभिभावक"},\n\nआपके बच्चे ${s.name} (Class ${s.class}${s.section ? " " + s.section : ""}) आज ${selectedDate} को अनुपस्थित हैं। कृपया सूचित करें।\n\n— School Management`
              );
              return (
                <div key={s.id}
                  className="flex justify-between items-center bg-white rounded-lg px-3 py-2 border border-green-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{s.name}</p>
                    <p className="text-xs text-gray-500">
                      {s.parent_name || "—"} · {s.parent_phone}
                    </p>
                  </div>
                  <a href={`https://wa.me/${fullPhone}?text=${msg}`}
                    target="_blank" rel="noopener noreferrer"
                    className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-green-700">
                    WhatsApp
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
          No students found.
        </div>
      ) : (
        <div className="space-y-2">
          {filteredStudents.map((student) => (
            <div key={student.id}
              className="bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900 text-sm">{student.name}</p>
                <p className="text-gray-400 text-xs">
                  Class {student.class} {student.section} · Roll {student.roll_number}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                attendanceMap[student.id] === "present" ? "bg-green-100 text-green-700" :
                attendanceMap[student.id] === "absent" ? "bg-red-100 text-red-700" :
                "bg-gray-100 text-gray-500"
              }`}>
                {attendanceMap[student.id] || "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}