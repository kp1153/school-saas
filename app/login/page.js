export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 w-full max-w-md text-center">
        <div className="text-3xl font-bold text-indigo-700 mb-2">EduSaaS</div>
        <div className="text-gray-500 text-sm mb-8">School Management Platform</div>
        <a href="/api/auth/login"
          className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
          Sign in with Google
        </a>
      </div>
    </div>
  );
}