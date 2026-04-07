import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req: NextRequest & { auth: any }) => {
  const { nextUrl } = req
  const session = req.auth
  const isLoggedIn = !!session?.user

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = nextUrl.pathname === "/"
  const isAuthRoute = ["/login", "/register"].includes(nextUrl.pathname)
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard")
  const isOnboardingRoute = nextUrl.pathname.startsWith("/onboarding")
  const isAdminRoute = nextUrl.pathname.startsWith("/admin")

  // Always allow AuthJS internal routes
  if (isApiAuthRoute) return NextResponse.next()

  // Always allow public landing page
  if (isPublicRoute) return NextResponse.next()

  // Auth routes (/login, /register)
  if (isAuthRoute) {
    if (isLoggedIn) {
      const isAdminUser = session.user.email === process.env.ADMIN_EMAIL
      if (isAdminUser) {
        return NextResponse.redirect(new URL("/admin", nextUrl))
      }
      const onboardingCompleted = session.user.onboardingCompleted
      return NextResponse.redirect(
        new URL(onboardingCompleted ? "/dashboard" : "/onboarding", nextUrl)
      )
    }
    return NextResponse.next()
  }

  // All remaining routes require authentication
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  const adminEmail = process.env.ADMIN_EMAIL
  const isAdmin = session.user.email === adminEmail
  const onboardingCompleted = isAdmin || session.user.onboardingCompleted

  // Onboarding route — if already completed, send to dashboard
  if (isOnboardingRoute && onboardingCompleted) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // Dashboard route — if onboarding not done, send to onboarding
  if (isDashboardRoute && !onboardingCompleted) {
    return NextResponse.redirect(new URL("/onboarding", nextUrl))
  }

  // Admin route — only the platform owner
  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
