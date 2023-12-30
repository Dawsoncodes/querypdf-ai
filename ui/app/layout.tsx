import "./globals.css"
import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { Providers } from "./_providers"
import { Toaster } from "sonner"
import { Footer } from "@/components/Footer"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "QueryPDF AI",
  description: "An AI to help you get answers from your documents",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen font-sans antialiased bg-slate-900 text-gray-50",
          fontSans.variable
        )}
      >
        <Providers>
          {children}
          <Footer />
        </Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
