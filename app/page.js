import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          School Management Made Simple
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Complete platform for private schools to manage students, fees, and communication
        </p>
        <div className="mt-8">
          <Link 
            href="/dashboard" 
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Live Demo
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Student Records</h3>
          <p className="text-gray-600">Track attendance, grades, and personal info</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Fee Management</h3>
          <p className="text-gray-600">Real-time collection status and reminders</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-2">Reports</h3>
          <p className="text-gray-600">Generate instant reports for parents</p>
        </div>
      </div>
    </div>
  )
}