import { prisma } from "@/lib/db";

export type ActivityType =
  | "signup"
  | "report"
  | "resolve"
  | "warn"
  | "deactivate"
  | "activate"
  | "category"
  | "district";

type LogInput = {
  type: ActivityType;
  actorId?: string | null;
  targetId?: string | null;
  title: string;
  sub?: string | null;
  metadata?: Record<string, unknown> | null;
};

// Activity log yazımı silent — feed'in görsel bir özelliği olduğu için DB hatası
// asıl işlemi (kullanıcı kaydı, rapor vs.) düşürmesin.
export async function logActivity(input: LogInput): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        type: input.type,
        actorId: input.actorId ?? null,
        targetId: input.targetId ?? null,
        title: input.title,
        sub: input.sub ?? null,
        metadata: input.metadata ?? undefined,
      },
    });
  } catch (err) {
    console.error("[activity-log]", input.type, err);
  }
}
