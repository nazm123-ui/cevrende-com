import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/constants/admin-emails";

async function assertAdmin() {
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) return null;
  return user;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Yetki yok." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const status =
    body.status === "resolved" || body.status === "open" ? body.status : null;
  const note =
    typeof body.resolvedNote === "string"
      ? body.resolvedNote.slice(0, 500)
      : null;

  if (!status) {
    return NextResponse.json(
      { error: "status 'resolved' veya 'open' olmalı." },
      { status: 400 },
    );
  }

  await prisma.messageReport.update({
    where: { id },
    data: {
      status,
      resolvedAt: status === "resolved" ? new Date() : null,
      resolvedNote: status === "resolved" ? note : null,
    },
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Yetki yok." }, { status: 403 });
  }

  const { id } = await params;
  await prisma.messageReport.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
