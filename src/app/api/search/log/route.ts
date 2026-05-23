import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isAdminEmail } from "@/lib/constants/admin-emails";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    // Skip logging for admin (avoids polluting analytics)
    if (user && isAdminEmail(user.email)) {
      return NextResponse.json({ skipped: true });
    }

    const body = await req.json().catch(() => ({}));
    const query =
      typeof body.query === "string" ? body.query.slice(0, 200) : null;
    const professionSlug =
      typeof body.professionSlug === "string"
        ? body.professionSlug.slice(0, 80)
        : null;
    const neighborhood =
      typeof body.neighborhood === "string"
        ? body.neighborhood.slice(0, 80)
        : null;

    // Don't log empty searches
    if (!query && !professionSlug && !neighborhood) {
      return NextResponse.json({ skipped: true });
    }

    await prisma.searchEvent.create({
      data: {
        userId: user?.id ?? null,
        query: query || null,
        professionSlug: professionSlug || null,
        neighborhood: neighborhood || null,
      },
    });

    return NextResponse.json({ logged: true });
  } catch (error) {
    console.error("Search log error:", error);
    return NextResponse.json({ error: "log failed" }, { status: 500 });
  }
}
