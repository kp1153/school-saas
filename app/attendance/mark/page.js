import { db } from "@/lib/db-drizzle";
import { students, attendance } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";

async function saveAttendance(formData) {
  "use server";

  const date = formData.get("date");
  const studentIds = formData.getAll("student_id");
  const presentIds = formData.getAll("present");

  for (const id of studentIds) {
    const status = presentIds.includes(id) ? "present" : "absent";

    const existing = await db
      .select()
      .from(attendance)
      .where(
        and(eq(attendance.student_id, parseInt(id)), eq(attendance.date, date)),
      );

    if (existing.length > 0) {
      await db
        .update(attendance)
        .set({ status })
        .where(
          and(
            eq(attendance.student_id, parseInt(id)),
            eq(attendance.date, date),
          ),
        );
    } else {
      await db.insert(attendance).values({
        student_id: parseInt(id),
        date,
        status,
      });
    }
  }

  redirect("/attendance");
}

export default async function MarkAttendancePage({ searchParams }) {
  const params = await searchParams;
  const today = new Date().toISOString().split("T")[0];
  const selectedDate = params?.date || today;
  const selectedClass = params?.class || "";

  let allStudents = await db.select().from(students);
  const classes = [...new Set(allStudents.map((s) => s.class))];

  const filteredStudents = selectedClass
    ? allStudents.filter((s) => s.class === selectedClass)
    : allStudents;

  const existing = await db
    .select()
    .from(attendance)
    .where(eq(attendance.date, selectedDate));

  const attendanceMap = {};
  existing.forEach((a) => {
    attendanceMap[a.student_id] = a.status;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-gray-500 text-sm mt-1">{selectedDate}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex gap-4">
        <form className="flex gap-4 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Class</label>
            <select
              name="class"
              defaultValue={selectedClass}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Classes</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
          >
            Filter
          </button>
        </form>
      </div>

      <form action={saveAttendance}>
        <input type="hidden" name="date" value={selectedDate} />

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Roll No
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Present
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.class} - {student.section}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.roll_number}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input type="hidden" name="student_id" value={student.id} />
                    <input
                      type="checkbox"
                      name="present"
                      value={String(student.id)}
                      defaultChecked={
                        attendanceMap[student.id] === "present" ||
                        !attendanceMap[student.id]
                      }
                      className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium"
        >
          Save Attendance
        </button>
      </form>
    </div>
  );
}
