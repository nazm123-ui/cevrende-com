import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/require-auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();

    const jobs = await prisma.jobPost.findMany({
      where: { status: "pending" },
      include: {
        employer: { select: { id: true, fullName: true, email: true, phone: true } },
        category: { select: { slug: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(jobs);
  } catch (err) {
    console.error("Admin GET /api/admin/jobs failed:", err);
    return NextResponse.json(
      { error: "İlanlar yüklenemedi." },
      { status: 500 }
    );
  }
}
