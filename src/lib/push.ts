import webpush from "web-push";
import { prisma } from "@/lib/db";

let initialized = false;

function init() {
  if (initialized) return;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;
  if (!publicKey || !privateKey || !subject) {
    console.warn("[push] VAPID env değişkenleri eksik — push devre dışı");
    return;
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);
  initialized = true;
}

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  badge?: number; // App icon badge sayısı (okunmamış mesaj toplamı)
};

// Bir kullanıcının tüm cihazlarına push gönderir. Geçersiz/eskimiş subscription'lar
// otomatik silinir. Asla throw etmez — mesaj kaydetme akışını düşürmesin.
export async function sendPushToUser(userId: string, payload: PushPayload) {
  init();
  if (!initialized) return;

  const subs = await prisma.pushSubscription.findMany({
    where: { userId },
    select: { id: true, endpoint: true, p256dh: true, auth: true },
  });
  if (subs.length === 0) return;

  const body = JSON.stringify(payload);

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          body,
        );
        await prisma.pushSubscription.update({
          where: { id: sub.id },
          data: { lastUsedAt: new Date() },
        });
      } catch (err: unknown) {
        // 410 Gone / 404 → subscription geçersiz, sil
        const status =
          (err as { statusCode?: number } | undefined)?.statusCode ?? 0;
        if (status === 404 || status === 410) {
          await prisma.pushSubscription
            .delete({ where: { id: sub.id } })
            .catch(() => {});
        } else {
          console.warn("[push] send failed:", status, err);
        }
      }
    }),
  );
}
