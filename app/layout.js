import { Geist } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })

export const metadata = {
  title: "विद्यालय प्रबंधन प्रणाली",
  description: "छोटे स्कूलों के लिए सरल प्रबंधन सॉफ्टवेयर",
}

export default function RootLayout({ children }) {
  return (
    <html lang="hi">
      <body className={`${geist.variable} antialiased bg-gray-50`}>
        {children}
      </body>
    </html>
  )
}