import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.isEmailVerified) {
      return NextResponse.json(
        { error: "Kimlik doğrulaması gereklidir." },
        { status: 401 }
      );
    }

    const { otherUserId } = await req.json();
    if (!otherUserId) {
      return NextResponse.json(
        { error: "otherUserId gereklidir." },
        { status: 400 }
      );
    }

    // Sil: kullanıcı ve otherUser arasındaki tüm mesajlar
    const result = await prisma.message.deleteMany({
      where: {
        OR: [
          { senderId: user.id, recipientId: otherUserId },
          { senderId: otherUserId, recipientId: user.id },
        ],
      },
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Clear messages error:", error);
    return NextResponse.json(
      { error: "Mesajlar temizlenemedi." },
      { status: 500 }
    );
  }
}
