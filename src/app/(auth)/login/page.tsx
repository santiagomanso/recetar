import { Suspense } from "react"
import { LoginPageData } from "@/app/(auth)/login/_components/login-page-data"
import { AuthErrorToast } from "@/app/(auth)/login/_components/auth-error-toast"

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <>
      <Suspense>
        <AuthErrorToast />
      </Suspense>
      <Suspense>
        <LoginPageData searchParams={searchParams} />
      </Suspense>
    </>
  )
}
