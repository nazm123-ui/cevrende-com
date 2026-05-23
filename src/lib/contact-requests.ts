import { prisma } from "@/lib/db";
import { maskName } from "@/lib/masking";
import { canSeePhone, type WorkerSettings as PhoneSettings } from "@/lib/phone-visibility";

export type ContactRequestStatus = "pending" | "accepted" | "declined";

export type IncomingRequest = {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserDistrict: string;
  fromUserNeighborhood: string | null;
  fromUserPhone: string | null;
  message: string | null;
  status: ContactRequestStatus;
  createdAt: Date;
  respondedAt: Date | null;
};

export type OutgoingRequest = {
  id: string;
  toWorkerId: string;
  toWorkerName: string;
  toWorkerPhone: string | null;
  message: string | null;
  status: ContactRequestStatus;
  createdAt: Date;
  respondedAt: Date | null;
};

type WorkerSettings = PhoneSettings & { showName?: boolean };

export async function getRequestStatusMap(
  fromUserId: string,
  toWorkerIds: string[],
): Promise<Map<string, ContactRequestStatus>> {
  if (toWorkerIds.length === 0) return new Map();
  const rows = await prisma.contactRequest.findMany({
    where: { fromUserId, toWorkerId: { in: toWorkerIds } },
    select: { toWorkerId: true, status: true },
  });
  const map = new Map<string, ContactRequestStatus>();
  for (const r of rows) {
    map.set(r.toWorkerId, r.status as ContactRequestStatus);
  }
  return map;
}

export async function canMessageWorker(
  fromUserId: string,
  toWorkerId: string,
): Promise<boolean> {
  const req = await prisma.contactRequest.findUnique({
    where: { fromUserId_toWorkerId: { fromUserId, toWorkerId } },
    select: { status: true },
  });
  if (req?.status === "accepted") return true;

  const workerInitiated = await prisma.message.findFirst({
    where: { senderId: toWorkerId, recipientId: fromUserId },
    select: { id: true },
  });
  return !!workerInitiated;
}

export async function hasEstablishedContact(
  userA: string,
  userB: string,
): Promise<boolean> {
  const [acceptedReq, anyMessage] = await Promise.all([
    prisma.contactRequest.findFirst({
      where: {
        status: "accepted",
        OR: [
          { fromUserId: userA, toWorkerId: userB },
          { fromUserId: userB, toWorkerId: userA },
        ],
      },
      select: { id: true },
    }),
    prisma.message.findFirst({
      where: {
        OR: [
          { senderId: userA, recipientId: userB },
          { senderId: userB, recipientId: userA },
        ],
      },
      select: { id: true },
    }),
  ]);
  return !!acceptedReq || !!anyMessage;
}

export async function getIncomingRequests(
  workerId: string,
): Promise<IncomingRequest[]> {
  const rows = await prisma.contactRequest.findMany({
    where: { toWorkerId: workerId },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      message: true,
      status: true,
      createdAt: true,
      respondedAt: true,
      fromUser: {
        select: {
          id: true,
          fullName: true,
          district: true,
          neighborhood: true,
          phone: true,
        },
      },
    },
  });

  return rows.map((r) => ({
    id: r.id,
    fromUserId: r.fromUser.id,
    fromUserName: r.fromUser.fullName,
    fromUserDistrict: r.fromUser.district,
    fromUserNeighborhood: r.fromUser.neighborhood,
    fromUserPhone: r.status === "accepted" ? r.fromUser.phone : null,
    message: r.message,
    status: r.status as ContactRequestStatus,
    createdAt: r.createdAt,
    respondedAt: r.respondedAt,
  }));
}

export async function getOutgoingRequests(
  userId: string,
): Promise<OutgoingRequest[]> {
  const rows = await prisma.contactRequest.findMany({
    where: { fromUserId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      message: true,
      status: true,
      createdAt: true,
      respondedAt: true,
      toWorker: {
        select: {
          id: true,
          fullName: true,
          phone: true,
          workerSettings: true,
        },
      },
    },
  });

  return rows.map((r) => {
    const settings = (r.toWorker.workerSettings ?? {}) as WorkerSettings;
    const showName = settings.showName ?? false;
    const accepted = r.status === "accepted";
    return {
      id: r.id,
      toWorkerId: r.toWorker.id,
      toWorkerName:
        showName || accepted ? r.toWorker.fullName : maskName(r.toWorker.fullName),
      toWorkerPhone: canSeePhone(settings, accepted) ? r.toWorker.phone : null,
      message: r.message,
      status: r.status as ContactRequestStatus,
      createdAt: r.createdAt,
      respondedAt: r.respondedAt,
    };
  });
}

export async function getPendingIncomingCount(workerId: string): Promise<number> {
  return prisma.contactRequest.count({
    where: { toWorkerId: workerId, status: "pending" },
  });
}
