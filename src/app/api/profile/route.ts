import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireVerifiedUser } from "@/lib/require-auth";
import { workerProfileSchema } from "@/lib/validators";
import { checkContent, describeCategories } from "@/lib/content-filter";

export async function PATCH(req: Request) {
  const user = await requireVerifiedUser();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = workerProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const {
    professions,
    bio,
    neighborhood,
    showName,
    showDistrict,
    phoneVisibility,
  } = parsed.data;

  const validSlugs = new Set(
    (
      await prisma.jobCategory.findMany({
        where: { isActive: true },
        select: { slug: true },
      })
    ).map((c) => c.slug),
  );
  const invalidSlug = professions.find((p) => !validSlugs.has(p));
  if (invalidSlug) {
    return NextResponse.json(
      { error: "Geçersiz meslek seçimi." },
      { status: 400 },
    );
  }

  if (bio && bio.trim()) {
    const filter = checkContent(bio);
    if (filter.blockedCategories.length > 0) {
      return NextResponse.json(
        {
          error: `Tanıtım metni uygunsuz içerik barındırıyor (${describeCategories(filter.blockedCategories)}).`,
        },
        { status: 400 },
      );
    }
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      professions,
      bio: bio?.trim() || null,
      neighborhood: neighborhood?.trim() || null,
      workerSettings: {
        showName,
        showDistrict,
        phoneVisibility,
      },
    },
    select: {
      id: true,
      professions: true,
      bio: true,
      neighborhood: true,
      workerSettings: true,
    },
  });

  return NextResponse.json({ ok: true, user: updated });
}
