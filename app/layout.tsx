import type React from "react"
import "@/app/globals.css"
import { Poppins } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { RoutineProvider } from "@/components/routine-provider"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata = {
  title: "প্রতিদিনের রুটিন - Daily Routine Tracker",
  description: "A beautiful app to track your daily routine",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-poppins`} id="top">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <RoutineProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="flex-1">{children}</div>
              <MobileNav />
            </div>
          </RoutineProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
