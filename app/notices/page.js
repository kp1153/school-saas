import { db } from "@/lib/db-drizzle";
import { notices } from "@/lib/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function NoticesPage() {
  const allNotices = await db
    .select()
    .from(notices)
    .orderBy(desc(notices.created_at));

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notice Board</h1>
          <p className="text-gray-500 text-sm mt-1">
            School announcements और notices
          </p>
        </div>
        <Link
          href="/notices/add"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition text-sm font-medium shadow-sm"
        >
          + New Notice
        </Link>
      </div>

      <div className="space-y-4">
        {allNotices.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
            कोई notice नहीं है। पहला notice add करें।
          </div>
        ) : (
          allNotices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {notice.title}
                    </h2>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        notice.priority === "urgent"
                          ? "bg-red-100 text-red-700"
                          : notice.priority === "important"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {notice.priority === "urgent"
                        ? "🔴 Urgent"
                        : notice.priority === "important"
                          ? "🟡 Important"
                          : "🟢 Normal"}
                    </span>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                      {notice.category}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {notice.content}
                  </p>
                  <p className="text-gray-400 text-xs mt-3">
                    {new Date(notice.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Link
                  href={`/notices/${notice.id}/delete`}
                  className="ml-4 text-red-400 hover:text-red-600 text-sm"
                >
                  🗑️
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
