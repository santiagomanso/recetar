import { db } from "@/lib/prisma";
import { DeliveryStatus } from "@prisma/client";

export async function createDelivery(data: {
  doctorId: string;
  pdfKey: string;
  pdfUrl: string;
  pdfName?: string;
  patientPhone: string;
  amount: number;
  mpPreferenceId?: string;
}) {
  return db.delivery.create({
    data: {
      doctorId: data.doctorId,
      type: "PRESCRIPTION",
      pdfKey: data.pdfKey,
      pdfUrl: data.pdfUrl,
      pdfName: data.pdfName,
      patientPhone: data.patientPhone,
      amount: data.amount,
      mpPreferenceId: data.mpPreferenceId,
    },
  });
}

export async function hasDeliveries(doctorId: string) {
  const count = await db.delivery.count({ where: { doctorId }, take: 1 })
  return count > 0
}

export async function getDeliveriesByDoctor(doctorId: string, limit = 20) {
  return db.delivery.findMany({
    where: { doctorId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getDeliveryById(id: string) {
  return db.delivery.findUnique({ where: { id } });
}

export async function getDeliveryWithDoctor(id: string) {
  return db.delivery.findUnique({
    where: { id },
    include: { doctor: true },
  });
}

export async function getDeliveryByPreferenceId(mpPreferenceId: string) {
  return db.delivery.findFirst({ where: { mpPreferenceId } });
}

export async function updateDeliveryPreferenceId(
  id: string,
  mpPreferenceId: string
) {
  return db.delivery.update({ where: { id }, data: { mpPreferenceId } });
}

export async function updateDeliveryStatus(
  id: string,
  status: DeliveryStatus,
  extra?: { mpPaymentId?: string; paidAt?: Date; sentAt?: Date }
) {
  return db.delivery.update({
    where: { id },
    data: { status, ...extra },
  });
}
