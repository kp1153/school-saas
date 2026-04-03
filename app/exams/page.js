export const dynamic = "force-dynamic";

import { db } from "@/lib/db-drizzle";
import { exams } from "@/lib/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function ExamsPage() {
  const allExams = await db.select().from(exams).orderBy(desc(exams.created_at));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Exams & Results</h1>
          <p className="text-gray-500 text-xs mt-0.5">Schedule and manage marks</p>
        </div>
        <Link href="/exams/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          + New
        </Link>
      </div>

      {allExams.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center text-gray-400 text-sm">
          No exams yet. Schedule your first exam.
        </div>
      ) : (
        <div className="space-y-3">
          {allExams.map((exam) => (
            <div key={exam.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{exam.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Class {exam.class} · {exam.subject}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {exam.exam_date} · Max: {exam.max_marks} · Pass: {exam.passing_marks}
                  </p>
                </div>
                <div className="ml-3 shrink-0 flex flex-col gap-2 text-right">
                  <Link href={`/exams/${exam.id}/results`} className="text-xs font-medium text-indigo-600">
                    Marks Entry
                  </Link>
                  <Link href={`/exams/${exam.id}/report`} className="text-xs font-medium text-green-600">
                    Report Card
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}