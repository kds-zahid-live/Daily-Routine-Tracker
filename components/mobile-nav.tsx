"use client"

import { Home, Clock, BarChart2, Music, Database } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Timer",
      href: "/timer",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      name: "Progress",
      href: "/progress",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      name: "Music",
      href: "/music",
      icon: <Music className="h-5 w-5" />,
    },
    {
      name: "Data",
      href: "/data",
      icon: <Database className="h-5 w-5" />,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-background md:hidden">
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center ${pathname === item.href ? "text-primary" : ""}`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
