export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { db } from "@/lib/db-drizzle";
import { fees, students } from "@/lib/schema";
import { setFlash } from "@/lib/flash";

async function addPayment(formData) {
  "use server";

  const studentId = parseInt(formData.get("student_id"));
  const amount = parseFloat(formData.get("amount"));
  const dueDate = formData.get("due_date");
  const paidDate = formData.get("paid_date") || null;
  const status = paidDate ? "paid" : "pending";

  await db.insert(fees).values({
    student_id: studentId,
    amount,
    due_date: new Date(dueDate),
    paid_date: paidDate ? new Date(paidDate) : null,
    status,
  });

  await setFlash("success", "Fee record saved successfully!");
  redirect("/fees");
}

export default async function AddFeePage() {
  const allStudents = await db.select().from(students);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Record Fee Payment</h1>
        <p className="text-gray-500 text-sm mt-1">Add a new fee entry for a student</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl">
        <form action={addPayment} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Student <span className="text-red-500">*</span>
            </label>
            <select name="student_id" required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Choose a student...</option>
              {allStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} — {student.class} {student.section}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input type="number" name="amount" required min="1" step="1"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input type="date" name="due_date" required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paid Date <span className="text-gray-400 font-normal">(leave empty if pending)</span>
              </label>
              <input type="date" name="paid_date"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 text-sm font-medium">
              Save Payment
            </button>
            <a href="/fees"
              className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 text-sm font-medium">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}