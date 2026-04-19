import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      onboardingCompleted: boolean
      lastAuthProvider: string
    } & DefaultSession["user"]
  }
}

// JWT interface augmentation: next-auth/jwt re-exports from @auth/core/jwt which is
// bundled inside pnpm's virtual store and not directly resolvable as a module path.
// Since JWT extends Record<string, unknown>, the custom fields are
// assignable without augmentation — type-casts in auth.ts callbacks handle typing.
