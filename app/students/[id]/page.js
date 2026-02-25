import { db } from "@/lib/db-drizzle";
import { students } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function StudentDetailPage({ params }) {
  const { id } = await params;

  // Drizzle se single student fetch
  const student = await db
    .select()
    .from(students)
    .where(eq(students.id, Number(id)));

  if (student.length === 0) {
    notFound();
  }

  const s = student[0];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Details</h1>
        <div className="space-x-3">
          <Link
            href={`/students/${id}/edit`}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
          >
            Edit
          </Link>
          <Link
            href="/students"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-900">Personal Information</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-gray-900 font-medium">{s.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Roll Number</p>
              <p className="text-gray-900 font-medium">{s.roll_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Class</p>
              <p className="text-gray-900 font-medium">
                {s.class} - {s.section}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fee Status</p>
              <span
                className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                  s.fee_status === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {s.fee_status}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-medium text-gray-900 mb-3">
              Parent Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Parent Name</p>
                <p className="text-gray-900">{s.parent_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact Number</p>
                <p className="text-gray-900">{s.parent_phone}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500">Admission Date</p>
            <p className="text-gray-900">
              {s.admission_date
                ? new Date(s.admission_date).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
