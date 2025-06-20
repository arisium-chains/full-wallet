import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import BottomNavigation from "@/components/bottom-navigation"
import { ReactQueryProvider, AuthProvider, WalletProvider } from "./providers"
import ErrorBoundary from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ARIS Web3 MVP",
  description: "Decentralized identity and credential platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <ReactQueryProvider>
            <AuthProvider>
              <WalletProvider>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                  <div className="min-h-screen bg-background">
                    <main className="pb-16">{children}</main>
                    <BottomNavigation />
                  </div>
                  <Toaster />
                </ThemeProvider>
              </WalletProvider>
            </AuthProvider>
          </ReactQueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
