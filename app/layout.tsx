import type React from "react"
import type { Metadata } from "next"
import { Kode_Mono } from "next/font/google"
import "./globals.css"

const kodeMono = Kode_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-kode-mono",
})

export const metadata: Metadata = {
  title: "Moon Tracker",
  description: "Lunar phase calendar and celestial events tracker",
  generator: "v0.app",
}

import { SplashScreen } from "@/components/ui/splash-screen"

import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${kodeMono.variable} antialiased`}>
      <body className="font-mono bg-white text-gray-900">
        <SplashScreen />
        {children}
        <Toaster theme="system" position="bottom-center" />
      </body>
    </html>
  )
}
