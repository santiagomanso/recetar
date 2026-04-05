"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { FileText, Menu, X, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary transition-all duration-300 hover:shadow-lg">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">RecetaMed</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/#features"
            className="text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            Funcionalidades
          </Link>
          <Link
            href="/#como-funciona"
            className="text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            Como Funciona
          </Link>
          <Link
            href="/#pricing"
            className="text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            Precios
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="font-medium">
                  Dashboard
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">
                Hola, {user?.username}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Salir
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="font-medium">
                  Log in
                </Button>
              </Link>
              <Link href="/login">
                <Button className="rounded-full bg-primary px-6 font-medium text-primary-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Comenzar gratis
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-muted md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "absolute left-0 right-0 top-16 overflow-hidden bg-background/95 backdrop-blur-lg transition-all duration-300 md:hidden",
          isMobileMenuOpen
            ? "max-h-96 border-b border-border"
            : "max-h-0"
        )}
      >
        <div className="flex flex-col gap-4 px-4 py-6">
          <Link
            href="/#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Funcionalidades
          </Link>
          <Link
            href="/#como-funciona"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Como Funciona
          </Link>
          <Link
            href="/#pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Precios
          </Link>
          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" onClick={logout} className="w-full gap-2">
                  <LogOut className="h-4 w-4" />
                  Cerrar sesion
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">
                    Comenzar gratis
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
