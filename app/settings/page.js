export const dynamic = "force-dynamic";

import { db } from "@/lib/db-drizzle";
import { school_settings, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { setFlash } from "@/lib/flash";
import { getSession } from "@/lib/session";
import { cookies } from "next/headers";

async function saveSettings(formData) {
  "use server";

  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/login");

  const session = await getSession(token);
  if (!session) redirect("/login");

  const userResult = await db.select().from(users).where(eq(users.email, session.email));
  const user = userResult[0];
  if (!user) redirect("/login");

  const data = {
    user_id: user.id,
    school_name: formData.get("school_name"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    principal_name: formData.get("principal_name"),
    affiliation_no: formData.get("affiliation_no"),
    school_code: formData.get("school_code"),
    logo_url: formData.get("logo_url"),
    updated_at: new Date(),
  };

  const existing = await db.select().from(school_settings).where(eq(school_settings.user_id, user.id));

  if (existing.length > 0) {
    await db.update(school_settings).set(data).where(eq(school_settings.user_id, user.id));
  } else {
    await db.insert(school_settings).values(data);
  }

  await setFlash("success", "Settings saved successfully!");
  redirect("/settings");
}

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) redirect("/login");

  const session = await getSession(token);
  if (!session) redirect("/login");

  const userResult = await db.select().from(users).where(eq(users.email, session.email));
  const user = userResult[0];
  if (!user) redirect("/login");

  const result = await db.select().from(school_settings).where(eq(school_settings.user_id, user.id));
  const s = result[0] || {};

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">School Settings</h1>
        <p className="text-gray-500 text-sm mt-1">This information will appear on receipts and report cards</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl">
        <form action={saveSettings} className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School Name <span className="text-red-500">*</span>
            </label>
            <input type="text" name="school_name" required defaultValue={s.school_name || ""}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea name="address" rows={3} defaultValue={s.address || ""}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input type="tel" name="phone" defaultValue={s.phone || ""}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" defaultValue={s.email || ""}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Principal Name</label>
            <input type="text" name="principal_name" defaultValue={s.principal_name || ""}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation No</label>
              <input type="text" name="affiliation_no" defaultValue={s.affiliation_no || ""}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School Code</label>
              <input type="text" name="school_code" defaultValue={s.school_code || ""}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
            <input type="url" name="logo_url" defaultValue={s.logo_url || ""}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            {s.logo_url && (
              <img src={s.logo_url} alt="logo" className="mt-3 h-16 object-contain" />
            )}
          </div>

          <div className="pt-2">
            <button type="submit"
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 text-sm font-medium">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}