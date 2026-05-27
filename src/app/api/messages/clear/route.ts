import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { clearConversationSchema } from "@/lib/validators";

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.isEmailVerified) {
      return NextResponse.json(
        { error: "Kimlik doğrulaması gereklidir." },
        { status: 401 },
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
    }

    const parsed = clearConversationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Form hatalı.", issues: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { otherUserId } = parsed.data;

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
      { status: 500 },
    );
  }
}
