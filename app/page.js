import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
            🏫 School Management Platform
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            School Management<br />Made Simple
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Students, Fees, Attendance, Exams, Results — सब कुछ एक जगह।
            Private schools के लिए complete solution।
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/login"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-medium text-sm shadow-sm">
              Login करें →
            </Link>
            <Link
              href="/parent/login"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 font-medium text-sm border border-indigo-200">
              Parent Login
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">🎓</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Students & Teachers</h3>
            <p className="text-gray-500 text-sm">Complete records, attendance tracking, fee management</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Exams & Results</h3>
            <p className="text-gray-500 text-sm">Marks entry, grade calculation, printable report cards</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">👨‍👩‍👧</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Parent Portal</h3>
            <p className="text-gray-500 text-sm">Parents अपने बच्चे की fees, attendance, results देख सकते हैं</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fee Management</h3>
            <p className="text-gray-500 text-sm">Fee collect करो, receipt print करो, pending track करो</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Notice Board</h3>
            <p className="text-gray-500 text-sm">Announcements post करो, urgent notices highlight करो</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports</h3>
            <p className="text-gray-500 text-sm">Class-wise attendance, fee collection, exam results summary</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-indigo-900 rounded-2xl p-10 text-white">
          <h2 className="text-2xl font-bold mb-3">अपने school को digital बनाएं</h2>
          <p className="text-indigo-300 mb-6 text-sm">आज ही शुरू करें — setup में 5 मिनट लगते हैं</p>
          <Link
            href="/login"
            className="bg-white text-indigo-700 px-8 py-3 rounded-lg hover:bg-indigo-50 font-medium text-sm">
            Get Started →
          </Link>
        </div>
      </div>
    </div>
  );
}