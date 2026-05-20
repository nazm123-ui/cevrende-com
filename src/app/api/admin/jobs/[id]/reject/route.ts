import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;

    let body: { reason?: string } = {};
    try {
      body = await req.json();
    } catch {
      // No body is OK
    }

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

    await prisma.jobPost.update({
      where: { id },
      data: { status: "rejected" },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Admin POST /api/admin/jobs/[id]/reject failed:", err);
    return NextResponse.json(
      { error: "Reddetme işlemi başarısız." },
      { status: 500 }
    );
  }
}
