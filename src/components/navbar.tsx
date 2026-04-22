"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { House, Menu, LogOut, LayoutDashboard, Zap, Play, Tag, Send, Settings, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle, ThemeToggleMobile } from "@/components/theme-toggle";

type NavLink = { href: string; label: string; icon: LucideIcon };

const publicLinks: NavLink[] = [
  { href: "/#features", label: "Funcionalidades", icon: Zap },
  { href: "/#como-funciona", label: "Cómo Funciona", icon: Play },
  { href: "/#pricing", label: "Precios", icon: Tag },
];

const authLinks: NavLink[] = [
  { href: "/dashboard", label: "Enviar Receta", icon: Send },
  { href: "/configuracion", label: "Configuración", icon: Settings },
];

export function Navbar() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  // Defer auth-dependent rendering to avoid SSR/client hydration mismatch
  const isAuthenticated = mounted && !!session?.user;
  const navLinks = isAuthenticated
    ? [...publicLinks, ...authLinks]
    : publicLinks;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userName = session?.user?.name;
  const userImage = session?.user?.image;

  const initials = userName
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const AvatarCircle = ({ size }: { size: "sm" | "lg" }) => {
    const sm = size === "sm";
    return userImage ? (
      <img
        src={userImage}
        alt={userName ?? ""}
        className={cn(
          "rounded-full object-cover",
          sm ? "h-9 w-9" : "h-20 w-20",
        )}
      />
    ) : (
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground",
          sm ? "h-9 w-9 text-xs" : "h-20 w-20 text-2xl",
        )}
      >
        {initials}
      </div>
    );
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-sm"
            : "bg-transparent",
        )}
      >
        <nav className='mx-auto flex h-16 max-w-6xl items-center px-4'>
          {/* ── Mobile: House | RECETAR | hamburger ── */}
          <div className='flex md:hidden items-center w-full'>
            <Link
              href='/'
              className='shrink-0 flex items-center justify-center h-9 w-9 rounded-lg hover:bg-muted transition-colors'
            >
              <House className='h-5 w-5 text-foreground' />
            </Link>
            <span
              className='flex-1 text-center text-sm font-semibold tracking-[0.18em] uppercase text-foreground select-none px-3 truncate'
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Recetar
            </span>
            <SheetTrigger asChild>
              <button
                className='shrink-0 flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-muted'
                aria-label='Abrir menú'
              >
                <Menu className='h-5 w-5' />
              </button>
            </SheetTrigger>
          </div>

          {/* ── Desktop: Logo ── */}
          <Link
            href='/'
            className='hidden md:flex items-center gap-2 transition-transform duration-300 hover:scale-105'
          >
            <House className='h-5 w-5 text-foreground' />
            <span className='text-lg font-medium text-foreground'>Recetar</span>
          </Link>

          {/* ── Desktop: Nav links with animated pill ── */}
          <div
            className='hidden md:flex items-center gap-1 mx-auto'
            onMouseLeave={() => setHoveredLink(null)}
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className='relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg'
                onMouseEnter={() => setHoveredLink(href)}
              >
                {hoveredLink === href && (
                  <motion.div
                    layoutId='landing-nav-pill'
                    className='absolute inset-0 rounded-lg bg-muted'
                    transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                  />
                )}
                <span className='relative z-10'>{label}</span>
              </Link>
            ))}
          </div>

          {/* ── Desktop: Right side ── */}
          <div className='hidden md:flex items-center gap-3 ml-auto'>
            <ThemeToggle />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className='rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                    aria-label='Menú de cuenta'
                  >
                    <AvatarCircle size='sm' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-48'>
                  <DropdownMenuItem asChild>
                    <Link
                      href='/dashboard'
                      className='flex items-center gap-2 cursor-pointer'
                    >
                      <LayoutDashboard className='h-4 w-4' />
                      Panel de control
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className='flex items-center gap-2 cursor-pointer'
                  >
                    <LogOut className='h-4 w-4' />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href='/login'>
                <Button className='rounded-full px-6 font-medium text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg'>
                  Enviar recetas
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </header>

      {/* ── Mobile Sheet ── */}
      <SheetContent side='right' className='w-72 flex flex-col p-0'>
        <SheetTitle className='sr-only'>Menú</SheetTitle>
        {isAuthenticated && (
          <div className='flex flex-col items-center gap-3 border-b border-border px-6 py-8'>
            <AvatarCircle size='lg' />
            <p className='text-sm font-bold text-foreground'>
              {userName ?? "Mi cuenta"}
            </p>
          </div>
        )}
        <nav className='flex flex-col gap-1 px-3 py-4 flex-1'>
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSheetOpen(false)}
              className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
            >
              <Icon className='h-4 w-4 shrink-0' />
              {label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              href='/dashboard'
              onClick={() => setSheetOpen(false)}
              className='flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
            >
              <LayoutDashboard className='h-4 w-4' />
              Dashboard
            </Link>
          )}
        </nav>
        <div className='border-t border-border px-3 py-4 flex flex-col gap-1'>
          <ThemeToggleMobile />
          {isAuthenticated ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className='flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
            >
              <LogOut className='h-4 w-4' />
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link
                href='/login'
                onClick={() => setSheetOpen(false)}
                className='flex w-full items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium bg-primary text-primary-foreground transition-colors hover:bg-primary/90'
              >
                Enviar recetas
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
