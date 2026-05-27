import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireVerifiedUser } from "@/lib/require-auth";
import { accountInfoSchema } from "@/lib/validators";
import { PENDIK_NEIGHBORHOODS } from "@/lib/constants/pendik-neighborhoods";

export async function PATCH(req: Request) {
  const user = await requireVerifiedUser();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = accountInfoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { fullName, neighborhood } = parsed.data;

  if (!PENDIK_NEIGHBORHOODS.includes(neighborhood as never)) {
    return NextResponse.json(
      { error: "Geçersiz mahalle.", issues: { neighborhood: ["Listeden bir mahalle seç."] } },
      { status: 400 },
    );
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { fullName, neighborhood },
    select: { id: true, fullName: true, neighborhood: true },
  });

  return NextResponse.json({ ok: true, user: updated });
}
