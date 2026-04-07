"use server"

import { getPendingUsers, updateUserStatus } from "@/services/users"

export async function getPendingUsersAction() {
  return getPendingUsers()
}

export async function approveUserAction(userId: string) {
  await updateUserStatus(userId, "APPROVED")
}

export async function rejectUserAction(userId: string) {
  await updateUserStatus(userId, "REJECTED")
}
