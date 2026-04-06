import NextAuth from "next-auth"
import authConfig from "@/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.status = (user as { status: string }).status
        token.specialty = (user as { specialty: string | null }).specialty
        token.onboardingCompleted = (user as { onboardingCompleted: boolean }).onboardingCompleted
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.status = token.status as string
        session.user.specialty = token.specialty as string | null
        session.user.onboardingCompleted = token.onboardingCompleted as boolean
      }
      return session
    },
  },
})
