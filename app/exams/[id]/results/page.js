import { db } from "@/lib/db-drizzle";
import { exams, students, results } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";

async function saveResults(formData) {
  "use server";

  const exam_id = parseInt(formData.get("exam_id"));
  const studentIds = formData.getAll("student_id");

  for (const sid of studentIds) {
    const marks = formData.get(`marks_${sid}`);
    const remarks = formData.get(`remarks_${sid}`) || "";
    if (marks === "" || marks === null) continue;

    const marksNum = parseFloat(marks);

    const existing = await db
      .select()
      .from(results)
      .where(
        and(
          eq(results.exam_id, exam_id),
          eq(results.student_id, parseInt(sid)),
        ),
      );

    // grade calculate करो
    let grade = "F";
    const pct = marksNum;
    if (pct >= 90) grade = "A+";
    else if (pct >= 75) grade = "A";
    else if (pct >= 60) grade = "B";
    else if (pct >= 45) grade = "C";
    else if (pct >= 33) grade = "D";

    if (existing.length > 0) {
      await db
        .update(results)
        .set({ marks_obtained: marksNum, grade, remarks })
        .where(
          and(
            eq(results.exam_id, exam_id),
            eq(results.student_id, parseInt(sid)),
          ),
        );
    } else {
      await db.insert(results).values({
        exam_id,
        student_id: parseInt(sid),
        marks_obtained: marksNum,
        grade,
        remarks,
      });
    }
  }

  redirect("/exams");
}

export default async function MarksEntryPage({ params }) {
  const { id } = await params;

  const [exam] = await db
    .select()
    .from(exams)
    .where(eq(exams.id, parseInt(id)));
  if (!exam) return <div className="p-8 text-red-500">Exam नहीं मिला।</div>;

  const classStudents = await db
    .select()
    .from(students)
    .where(eq(students.class, exam.class));

  const existingResults = await db
    .select()
    .from(results)
    .where(eq(results.exam_id, parseInt(id)));

  const resultsMap = {};
  existingResults.forEach((r) => {
    resultsMap[r.student_id] = r;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Marks Entry</h1>
        <p className="text-gray-500 text-sm mt-1">
          {exam.name} — {exam.class} — {exam.subject} — Max: {exam.max_marks} |
          Pass: {exam.passing_marks}
        </p>
      </div>

      <form action={saveResults}>
        <input type="hidden" name="exam_id" value={exam.id} />

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Roll No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Marks (out of {exam.max_marks})
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {classStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    {exam.class} में कोई student नहीं है।
                  </td>
                </tr>
              ) : (
                classStudents.map((student) => {
                  const existing = resultsMap[student.id];
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {student.roll_number || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="hidden"
                          name="student_id"
                          value={student.id}
                        />
                        <input
                          type="number"
                          name={`marks_${student.id}`}
                          defaultValue={existing?.marks_obtained ?? ""}
                          min={0}
                          max={exam.max_marks}
                          placeholder="0"
                          className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {existing?.grade ? (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              existing.grade === "A+" || existing.grade === "A"
                                ? "bg-green-100 text-green-700"
                                : existing.grade === "B"
                                  ? "bg-blue-100 text-blue-700"
                                  : existing.grade === "C"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : existing.grade === "D"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-red-100 text-red-700"
                            }`}
                          >
                            {existing.grade}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          name={`remarks_${student.id}`}
                          defaultValue={existing?.remarks ?? ""}
                          placeholder="Optional"
                          className="w-36 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 text-sm font-medium"
          >
            Save Marks
          </button>
          <a
            href="/exams"
            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 text-sm font-medium"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
