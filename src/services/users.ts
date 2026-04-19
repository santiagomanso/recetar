import { db } from "@/lib/prisma"
import type { RegisterInput, SafeUser } from "@/types/user"
import type { UserStatus } from "@prisma/client"

export async function createUser(input: RegisterInput): Promise<SafeUser> {
  const existing = await db.user.findUnique({ where: { email: input.email.toLowerCase() } })
  if (existing) throw new Error("EMAIL_TAKEN")

  const user = await db.user.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      password: input.password, // already hashed — hashing is done in auth.ts before calling this
      specialty: input.specialty,
      status: "PENDING",
    },
  })

  const { password, mpAccessToken, mpRefreshToken, ...safeUser } = user
  return safeUser
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({ where: { email: email.toLowerCase() } })
}

export async function getUserById(id: string) {
  return db.user.findUnique({ where: { id } })
}

export async function getPendingUsers() {
  return db.user.findMany({
    where: { status: "PENDING" },
    select: {
      id: true,
      name: true,
      email: true,
      specialty: true,
      createdAt: true,
      status: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function updateUserStatus(userId: string, status: UserStatus) {
  return db.user.update({
    where: { id: userId },
    data: { status },
  })
}

export async function createGoogleUser(input: {
  name: string
  email: string
}): Promise<SafeUser> {
  const user = await db.user.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      password: null,
      status: "PENDING",
      lastAuthProvider: "google",
    },
  })

  const { password, mpAccessToken, mpRefreshToken, ...safeUser } = user
  return safeUser
}

export async function updateLastAuthProvider(
  userId: string,
  provider: "credentials" | "google"
): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { lastAuthProvider: provider },
  })
}

export async function completeOnboarding(
  userId: string,
  data: { telephone: string; specialty?: string }
): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: {
      telephone: data.telephone,
      ...(data.specialty ? { specialty: data.specialty } : {}),
      onboardingCompleted: true,
    },
  })
}

export async function saveMpTokens(
  userId: string,
  tokens: { accessToken: string; refreshToken: string; mpUserId: string }
): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: {
      mpAccessToken: tokens.accessToken,
      mpRefreshToken: tokens.refreshToken,
      mpUserId: tokens.mpUserId,
    },
  })
}
