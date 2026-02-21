import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a3f7a] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="text-5xl">🏫</div>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          विद्यालय प्रबंधन प्रणाली
        </h1>
        <p className="text-blue-200 text-lg max-w-md mx-auto">
          फीस, उपस्थिति, परिणाम — सब कुछ एक जगह
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/login"
            className="bg-white text-[#1a3f7a] font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition shadow-lg">
            लॉगिन करें
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-8 max-w-sm mx-auto">
          {[
            { icon: "💰", label: "फीस प्रबंधन" },
            { icon: "📋", label: "उपस्थिति" },
            { icon: "📊", label: "परिणाम" },
          ].map((item, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-4 text-center text-white">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-xs font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}