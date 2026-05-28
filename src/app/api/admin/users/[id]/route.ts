import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/constants/admin-emails";
import { logActivity } from "@/lib/activity-log";

async function assertAdmin() {
  const user = await getCurrentUser();
  if (!user || !isAdminEmail(user.email)) {
    return null;
  }
  return user;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await assertAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Yetki yok." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  if (admin.id === id) {
    return NextResponse.json(
      { error: "Kendi hesabını değiştiremezsin." },
      { status: 400 },
    );
  }

  const data: { isActive?: boolean } = {};
  if (typeof body.isActive === "boolean") data.isActive = body.isActive;

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "Geçerli alan yok." },
      { status: 400 },
    );
  }

  const target = await prisma.user.findUnique({
    where: { id },
    select: { fullName: true },
  });

  await prisma.user.update({ where: { id }, data });

  if (target && typeof data.isActive === "boolean") {
    await logActivity({
      type: data.isActive ? "activate" : "deactivate",
      actorId: admin.id,
      targetId: id,
      title: data.isActive
        ? `${admin.fullName} ${target.fullName} hesabını aktif etti`
        : `${admin.fullName} ${target.fullName} hesabını pasifleştirdi`,
      sub: data.isActive ? "tekrar aktif" : "giriş engelli",
    });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await assertAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Yetki yok." }, { status: 403 });
  }

  const { id } = await params;

  if (admin.id === id) {
    return NextResponse.json(
      { error: "Kendi hesabını silemezsin." },
      { status: 400 },
    );
  }

  const target = await prisma.user.findUnique({
    where: { id },
    select: { email: true },
  });

  if (target && isAdminEmail(target.email)) {
    return NextResponse.json(
      { error: "Admin hesabı silinemez." },
      { status: 400 },
    );
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
