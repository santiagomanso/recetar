import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserByEmail } from "@/services/users"
import { verifyPassword } from "@/services/auth"

export default {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await getUserByEmail(credentials.email as string)
        if (!user) return null

        // Google-registered users have no password — block credentials login
        if (!user.password) return null

        const valid = await verifyPassword(
          credentials.password as string,
          user.password
        )
        if (!valid) return null

        // Only block REJECTED users — PENDING users can now log in
        if (user.status === "REJECTED") return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          onboardingCompleted: user.onboardingCompleted,
        }
      },
    }),
  ],
} satisfies NextAuthConfig
