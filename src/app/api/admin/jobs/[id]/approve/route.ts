import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;

    const job = await prisma.jobPost.findUnique({ where: { id } });
    if (!job) {
      return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 });
    }
    if (job.status !== "pending") {
      return NextResponse.json(
        { error: "Bu ilan incelemede değil." },
        { status: 400 },
      );
    }

    const updated = await prisma.jobPost.update({
      where: { id },
      data: { status: "active" },
    });

    return NextResponse.json({ ok: true, job: updated });
  } catch (err) {
    console.error("Admin POST /api/admin/jobs/[id]/approve failed:", err);
    return NextResponse.json(
      { error: "Onaylama işlemi başarısız." },
      { status: 500 }
    );
  }
}
