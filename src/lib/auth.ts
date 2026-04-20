import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import authConfig from "@/auth.config"
import {
  getUserByEmail,
  getUserById,
  createGoogleUser,
  updateLastAuthProvider,
  saveUserImageIfEmpty,
} from "@/services/users"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    ...authConfig.providers,
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days — persistent across browser/tab closes
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Only apply extra logic for Google OAuth
      if (account?.provider === "google") {
        if (!user.email || !user.name) return false

        const existing = await getUserByEmail(user.email)

        // Block: email exists and was NOT previously a Google login — prevent account takeover.
        // Treats null lastAuthProvider (registered before this field existed) as credentials user.
        if (existing && existing.lastAuthProvider !== "google") {
          return false
        }

        // New Google user — create with PENDING status
        if (!existing) {
          await createGoogleUser({ name: user.name, email: user.email })
          // Save Google profile image for new users
          if (user.image) {
            const newUser = await getUserByEmail(user.email)
            if (newUser) await saveUserImageIfEmpty(newUser.id, user.image)
          }
        } else {
          // Returning Google user — keep lastAuthProvider current
          await updateLastAuthProvider(existing.id, "google")
          // Save Google profile image if user has none yet
          if (user.image && !existing.image) {
            await saveUserImageIfEmpty(existing.id, user.image)
          }
        }
      }

      return true
    },

    async jwt({ token, user, account, trigger }) {
      // Session update (e.g. after onboarding completes) — refresh onboardingCompleted from DB
      if (trigger === "update") {
        const dbUser = await getUserById(token.id as string)
        if (dbUser) token.onboardingCompleted = dbUser.onboardingCompleted
        return token
      }

      if (user) {
        // Fresh login — account is present only on the initial sign-in
        if (account?.provider === "google") {
          // IMPORTANT: user.id here is the Google profile ID, not our DB id.
          // We must query the DB to get the Prisma cuid and onboardingCompleted.
          const dbUser = await getUserByEmail(user.email!)
          token.id = dbUser?.id ?? (user.id as string)
          token.onboardingCompleted = dbUser?.onboardingCompleted ?? false
        } else {
          // Credentials: authorize() returns our DB id and onboardingCompleted directly
          token.id = user.id as string
          token.onboardingCompleted = (
            user as { onboardingCompleted: boolean }
          ).onboardingCompleted ?? false
        }
        // account.provider is 'credentials' or 'google' on fresh login
        token.lastAuthProvider = account?.provider ?? "credentials"
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.onboardingCompleted = token.onboardingCompleted as boolean
        session.user.lastAuthProvider = token.lastAuthProvider as string
      }
      return session
    },
  },
})
