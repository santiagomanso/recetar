import { unstable_cache } from "next/cache"
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

export async function getUserByMpUserId(mpUserId: string) {
  return db.user.findFirst({ where: { mpUserId } })
}

export async function getUserWithConfig(id: string) {
  return db.user.findUnique({
    where: { id },
    include: { config: true },
  })
}

export async function updateUserProfile(
  userId: string,
  data: { specialty?: string; email: string; telephone?: string }
): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: {
      ...(data.specialty !== undefined ? { specialty: data.specialty } : {}),
      email: data.email.toLowerCase(),
      ...(data.telephone !== undefined ? { telephone: data.telephone } : {}),
    },
  })
}

export async function updateUserImage(
  userId: string,
  imageUrl: string
): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { image: imageUrl },
  })
}

export async function unlinkMercadoPago(userId: string): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: {
      mpAccessToken: null,
      mpRefreshToken: null,
      mpUserId: null,
    },
  })
}

export async function upsertDefaultAmount(
  userId: string,
  amount: number
): Promise<void> {
  await db.doctorConfig.upsert({
    where: { doctorId: userId },
    update: { defaultAmount: amount },
    create: { doctorId: userId, defaultAmount: amount },
  })
}

export function getCachedDefaultAmount(userId: string) {
  return unstable_cache(
    async () => {
      const config = await db.doctorConfig.findUnique({ where: { doctorId: userId } })
      return config?.defaultAmount ? Number(config.defaultAmount) : null
    },
    [`default-amount-${userId}`],
    { revalidate: 60 }
  )()
}

export async function saveUserImageIfEmpty(
  userId: string,
  imageUrl: string
): Promise<void> {
  await db.user.update({
    where: { id: userId, image: null },
    data: { image: imageUrl },
  })
}
