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

        const valid = await verifyPassword(
          credentials.password as string,
          user.password
        )
        if (!valid) return null

        if (user.status !== "APPROVED") {
          throw new Error(
            user.status === "PENDING" ? "PENDING_APPROVAL" : "ACCOUNT_REJECTED"
          )
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          status: user.status,
          specialty: user.specialty,
          onboardingCompleted: user.onboardingCompleted,
        }
      },
    }),
  ],
} satisfies NextAuthConfig
