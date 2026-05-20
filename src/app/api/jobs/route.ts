import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createJob } from "@/lib/jobs";
import { jobInputSchema } from "@/lib/job-validators";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Giriş yapın." }, { status: 401 });
  }
  if (user.role !== "employer") {
    return NextResponse.json(
      { error: "Sadece işverenler ilan oluşturabilir." },
      { status: 403 },
    );
  }
  if (!user.isPhoneVerified) {
    return NextResponse.json(
      { error: "Telefonunuzu doğrulamadan ilan veremezsiniz." },
      { status: 403 },
    );
  }

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

  const result = await createJob(user.id, parsed.data);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, blockedCategories: result.blockedCategories },
      { status: result.status ?? 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    jobId: result.jobId,
    pendingReview: result.pendingReview ?? false,
  });
}
