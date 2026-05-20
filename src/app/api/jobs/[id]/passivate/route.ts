import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { passivateJob } from "@/lib/jobs";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, ctx: Ctx) {
  const user = await getCurrentUser();
  if (!user || user.role !== "employer" || !user.isPhoneVerified) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 403 });
  }
  const { id } = await ctx.params;
  const result = await passivateJob(id, user.id);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status ?? 400 },
    );
  }
  return NextResponse.json({ ok: true });
}
