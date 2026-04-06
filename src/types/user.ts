import type { User, UserStatus } from "@prisma/client"

// Safe user type — excludes sensitive fields never exposed to the frontend
export type SafeUser = Omit<User, "password" | "mpAccessToken" | "mpRefreshToken">

// Input shape for new doctor registration
export interface RegisterInput {
  name: string
  email: string
  password: string
  specialty?: string
}

// Re-export Prisma enum for use across the app
export type { UserStatus }
