export const dynamic = "force-dynamic";

import { db } from "@/lib/db-drizzle";
import { teachers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TeacherDetailPage({ params }) {
  const { id } = await params;

  const result = await db.select().from(teachers).where(eq(teachers.id, Number(id)));

  if (result.length === 0) notFound();

  const t = result[0];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Details</h1>
          <p className="text-gray-500 text-sm mt-1">{t.name}</p>
        </div>
        <div className="flex gap-3">
          <Link href="/teachers"
            className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-200 text-sm font-medium">
            ← Back
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Full Name</p>
            <p className="text-gray-900 font-medium">{t.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Subject</p>
            <p className="text-gray-900 font-medium">{t.subject}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Qualification</p>
            <p className="text-gray-900 font-medium">{t.qualification || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Phone</p>
            <p className="text-gray-900 font-medium">{t.phone || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Email</p>
            <p className="text-gray-900 font-medium">{t.email || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Joining Date</p>
            <p className="text-gray-900 font-medium">
              {t.joining_date ? new Date(t.joining_date).toLocaleDateString("en-IN") : "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}