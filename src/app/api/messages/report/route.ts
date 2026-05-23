import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.isEmailVerified) {
      return NextResponse.json(
        { error: "Kimlik doğrulaması gereklidir." },
        { status: 401 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const messageId =
      typeof body.messageId === "string" ? body.messageId : null;
    const reason =
      typeof body.reason === "string" ? body.reason.slice(0, 500) : null;

    if (!messageId || !reason) {
      return NextResponse.json(
        { error: "messageId ve reason gereklidir." },
        { status: 400 },
      );
    }

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Mesaj bulunamadı." },
        { status: 404 },
      );
    }

    if (message.recipientId !== user.id && message.senderId !== user.id) {
      return NextResponse.json(
        { error: "Bu mesajı rapor edemezsin." },
        { status: 403 },
      );
    }

    await prisma.messageReport.create({
      data: {
        messageId,
        reportedById: user.id,
        reason,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Rapor gönderildi. Yöneticiler inceleyecek.",
    });
  } catch (error) {
    console.error("Report message error:", error);
    return NextResponse.json(
      { error: "Rapor gönderilemedi." },
      { status: 500 },
    );
  }
}
