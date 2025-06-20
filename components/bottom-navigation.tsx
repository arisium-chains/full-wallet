"use client"

import { Home, Shield, FileText, Wallet, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Learn", href: "/learn", icon: Shield },
  { name: "Wallet", href: "/wallet", icon: Wallet },
  { name: "Resume", href: "/resume", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  // Don't show navigation on login page
  if (pathname === "/login") return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-2xl z-50">
      <nav className="flex justify-around items-center py-3 px-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 min-w-[60px]",
                isActive
                  ? "text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg scale-105"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100 hover:scale-105",
              )}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-semibold">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
