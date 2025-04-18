"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, Database, Clock, BarChart2, Music } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useRoutine } from "./routine-provider"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { resetTasks, categories, filterTasks, activeFilter } = useRoutine()
  const pathname = usePathname()

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Define navigation items
  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: null,
    },
    {
      name: "Timer",
      href: "/timer",
      icon: <Clock className="h-4 w-4 mr-2" />,
    },
    {
      name: "Progress",
      href: "/progress",
      icon: <BarChart2 className="h-4 w-4 mr-2" />,
    },
    {
      name: "Music",
      href: "/music",
      icon: <Music className="h-4 w-4 mr-2" />,
    },
    {
      name: "Data",
      href: "/data",
      icon: <Database className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">রতিদিনের রুটিন</span>
          </Link>
          <nav className="flex items-center space-x-2 text-sm font-medium">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} passHref>
                <Button variant="ghost" className={pathname === item.href ? "bg-accent" : ""}>
                  {item.icon}
                  {item.name}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <nav className="grid gap-2 py-6">
                  {navItems.map((item) => (
                    <Link key={item.name} href={item.href} passHref>
                      <Button variant="ghost" className={`justify-start ${pathname === item.href ? "bg-accent" : ""}`}>
                        {item.icon}
                        {item.name}
                      </Button>
                    </Link>
                  ))}

                  <div className="pt-4 border-t mt-4">
                    <h3 className="text-sm font-medium mb-2 px-4">Categories</h3>
                    <Button variant="ghost" className="justify-start" onClick={() => filterTasks(null)}>
                      All Tasks
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant="ghost"
                        className={`justify-start ${activeFilter === category ? "bg-accent" : ""}`}
                        onClick={() => filterTasks(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>

                  <div className="pt-4 border-t mt-4">
                    <Button variant="ghost" className="justify-start" onClick={resetTasks}>
                      Reset Completed Tasks
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button variant="outline" className="hidden md:inline-flex" onClick={resetTasks}>
            Reset Completed Tasks
          </Button>
        </div>
      </div>
    </header>
  )
}
