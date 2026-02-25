import { redirect } from "next/navigation";
import { initDB } from "@/lib/db";

async function addTeacher(formData) {
  "use server";

  const name = formData.get("name");
  const subject = formData.get("subject");
  const qualification = formData.get("qualification");
  const phone = formData.get("phone");
  const email = formData.get("email");

  const db = await initDB();

  await db.execute({
    sql: `INSERT INTO teachers (name, subject, qualification, phone, email, joining_date) 
          VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    args: [name, subject, qualification, phone, email],
  });

  redirect("/teachers");
}

export default function AddTeacherPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Teacher</h1>

      <form
        action={addTeacher}
        className="bg-white rounded-lg border border-gray-200 p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            required
            placeholder="e.g., Mathematics"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Qualification
          </label>
          <input
            type="text"
            name="qualification"
            required
            placeholder="e.g., M.Sc, B.Ed"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Save Teacher
          </button>
          <a
            href="/teachers"
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
