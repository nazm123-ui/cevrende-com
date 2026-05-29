import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// Kullanıcının "şu an çevrimiçi" durumunu güncelleyen sade endpoint.
// Client her ~60 saniyede bir çağırır; sadece lastSeenAt'i now() yapar.
export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastSeenAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
