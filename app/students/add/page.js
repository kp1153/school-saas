import { redirect } from "next/navigation";
import { db } from "@/lib/db-drizzle";
import { students } from "@/lib/schema";
import { setFlash } from "@/lib/flash";

async function addStudent(formData) {
  "use server";

  const name = formData.get("name");
  const className = formData.get("class");
  const section = formData.get("section");
  const rollNumber = formData.get("roll_number");
  const parentName = formData.get("parent_name");
  const parentPhone = formData.get("parent_phone");

  await db.insert(students).values({
    name,
    class: className,
    section,
    roll_number: rollNumber,
    parent_name: parentName,
    parent_phone: parentPhone,
    fee_status: "pending",
  });

  await setFlash("success", "Student added successfully!");
  redirect("/students");
}

export default function AddStudentPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Student</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the student details below</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl">
        <form action={addStudent} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input type="text" name="name" required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class <span className="text-red-500">*</span>
              </label>
              <input type="text" name="class" required placeholder="e.g., Class 10"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section <span className="text-red-500">*</span>
              </label>
              <input type="text" name="section" required placeholder="e.g., A"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Roll Number <span className="text-red-500">*</span>
            </label>
            <input type="text" name="roll_number" required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Name <span className="text-red-500">*</span>
              </label>
              <input type="text" name="parent_name" required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Phone <span className="text-red-500">*</span>
              </label>
              <input type="tel" name="parent_phone" required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit"
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 text-sm font-medium">
              Save Student
            </button>
            <a href="/students"
              className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 text-sm font-medium">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}