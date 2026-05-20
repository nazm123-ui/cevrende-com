import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateJob, deleteJob } from "@/lib/jobs";
import { jobInputSchema } from "@/lib/job-validators";

type Ctx = { params: Promise<{ id: string }> };

async function requireEmployerFromCookies() {
  const user = await getCurrentUser();
  if (!user)
    return { error: "Giriş yapın.", status: 401 as const, user: null };
  if (user.role !== "employer")
    return {
      error: "Sadece işverenler işlem yapabilir.",
      status: 403 as const,
      user: null,
    };
  if (!user.isPhoneVerified)
    return {
      error: "Telefonunuzu doğrulayın.",
      status: 403 as const,
      user: null,
    };
  return { error: null, status: 200 as const, user };
}

export async function PATCH(req: Request, ctx: Ctx) {
  const auth = await requireEmployerFromCookies();
  if (!auth.user)
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status },
    );

  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = jobInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const result = await updateJob(id, auth.user.id, parsed.data);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, blockedCategories: result.blockedCategories },
      { status: result.status ?? 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    pendingReview: result.pendingReview ?? false,
  });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const auth = await requireEmployerFromCookies();
  if (!auth.user)
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status },
    );

  const { id } = await ctx.params;

  const result = await deleteJob(id, auth.user.id);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status ?? 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
