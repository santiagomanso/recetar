"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { motion } from "framer-motion"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileText, House, Menu, LogOut, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle, ThemeToggleMobile } from "@/components/theme-toggle"

interface DashboardNavbarProps {
  userName: string | null | undefined
  userImage?: string | null
  userSpecialty?: string | null
}

export function DashboardNavbar({ userName, userImage, userSpecialty }: DashboardNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => signOut({ callbackUrl: "/login" })

  const navLinks = [
    { href: "/", label: "Inicio", icon: House },
    { href: "/dashboard", label: "Enviar Receta", icon: FileText },
    { href: "/configuracion", label: "Configuración", icon: Settings },
  ]

  const pageTitles: Record<string, string> = {
    "/dashboard": "Enviar Receta",
    "/configuracion": "Configuración",
  }
  const pageTitle = pageTitles[pathname] ?? "Recetar"

  const initials = userName
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const AvatarCircle = ({ size }: { size: "sm" | "lg" }) => {
    const sm = size === "sm"
    return userImage ? (
      <img
        src={userImage}
        alt={userName ?? ""}
        className={cn("rounded-full object-cover", sm ? "h-9 w-9" : "h-20 w-20")}
      />
    ) : (
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground",
          sm ? "h-9 w-9 text-xs" : "h-20 w-20 text-2xl"
        )}
      >
        {initials}
      </div>
    )
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center px-4">

          {/* ── Mobile: House | RECETAR | hamburger ── */}
          <div className="flex md:hidden items-center w-full">
            <Link
              href="/"
              className="shrink-0 flex items-center justify-center h-9 w-9 rounded-lg hover:bg-muted transition-colors"
            >
              <House className="h-5 w-5 text-foreground" />
            </Link>
            <span className="flex-1 text-center text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-foreground select-none px-3 truncate" style={{ fontFamily: "var(--font-space-mono)" }}>
              {pageTitle}
            </span>
            <SheetTrigger asChild>
              <button
                className="shrink-0 flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-muted"
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
          </div>

          {/* ── Desktop: House + Recetar | center links | avatar ── */}
          <Link
            href="/"
            className="hidden md:flex items-center gap-2 transition-transform duration-300 hover:scale-105"
          >
            <House className="h-5 w-5 text-foreground" />
            <span className="text-lg font-medium text-foreground">Recetar</span>
          </Link>

          <div
            className="hidden md:flex items-center gap-1 mx-auto"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  pathname === href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
                onMouseEnter={() => setHoveredLink(href)}
              >
                {(hoveredLink === href || (hoveredLink === null && pathname === href)) && (
                  <motion.div
                    layoutId="dashboard-nav-pill"
                    className="absolute inset-0 rounded-lg bg-muted"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 ml-auto">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  aria-label="Menú de cuenta"
                >
                  <AvatarCircle size="sm" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/configuracion" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </header>

      {/* Mobile sheet content */}
      <SheetContent side="right" className="w-72 flex flex-col p-0">
        <SheetTitle className="sr-only">Menú</SheetTitle>
        <div className="flex flex-col items-center gap-3 border-b border-border px-6 py-8">
          <AvatarCircle size="lg" />
          <div className="text-center">
            <p className="text-sm font-bold text-foreground">
              {userName ?? "Mi cuenta"}
            </p>
            {userSpecialty && (
              <p className="text-xs text-muted-foreground mt-0.5">{userSpecialty}</p>
            )}
          </div>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSheetOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border px-3 py-4 flex flex-col gap-1">
          <ThemeToggleMobile />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
