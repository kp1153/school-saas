// app/promote/page.js

export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { db } from "@/lib/db-drizzle";
import { students } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { setFlash } from "@/lib/flash";

async function promoteStudents(formData) {
  "use server";

  const from_class = formData.get("from_class");
  const to_class = formData.get("to_class");
  const new_academic_year = formData.get("new_academic_year");

  if (!from_class || !to_class || !new_academic_year) {
    redirect("/promote");
  }

  await db
    .update(students)
    .set({
      class: to_class,
      academic_year: new_academic_year,
      fee_status: "pending",
    })
    .where(eq(students.class, from_class));

  await setFlash("success", `Class ${from_class} के students Class ${to_class} में promote हो गए!`);
  redirect("/promote");
}

export default async function PromotePage() {
  const allStudents = await db.select().from(students);
  const classes = [...new Set(allStudents.map((s) => s.class))].sort();

  const now = new Date();
  const baseYear = now.getMonth() < 3 ? now.getFullYear() - 1 : now.getFullYear();
  const nextAcademicYear = `${baseYear + 1}-${String(baseYear + 2).slice(-2)}`;

  const classCounts = {};
  allStudents.forEach((s) => {
    classCounts[s.class] = (classCounts[s.class] || 0) + 1;
  });

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900">Student Promotion</h1>
        <p className="text-gray-500 text-xs mt-0.5">
          Class-wise bulk promotion — नया academic year
        </p>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 text-xs text-yellow-800">
        ⚠️ यह action सभी selected class के students को अगली class में move कर देगा। एक बार हो जाने के बाद undo नहीं होगा।
      </div>

      {/* Current Class Summary */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
        <p className="text-xs font-medium text-gray-600 mb-3">Current Classes</p>
        <div className="grid grid-cols-3 gap-2">
          {classes.map((c) => (
            <div key={c} className="bg-indigo-50 border border-indigo-100 rounded-lg p-2 text-center">
              <p className="text-sm font-bold text-indigo-700">Class {c}</p>
              <p className="text-xs text-indigo-500">{classCounts[c]} students</p>
            </div>
          ))}
        </div>
      </div>

      {/* Promotion Form */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs font-medium text-gray-600 mb-3">Promote Students</p>
        <form action={promoteStudents} className="space-y-4">

          {/* From Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Class <span className="text-red-500">*</span>
            </label>
            <select
              name="from_class"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select class to promote...</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  Class {c} ({classCounts[c]} students)
                </option>
              ))}
            </select>
          </div>

          {/* To Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Class <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="to_class"
              required
              placeholder="e.g. 6"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* New Academic Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Academic Year <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="new_academic_year"
              required
              defaultValue={nextAcademicYear}
              placeholder="e.g. 2025-26"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium"
          >
            Promote Students →
          </button>
        </form>
      </div>
    </div>
  );
}