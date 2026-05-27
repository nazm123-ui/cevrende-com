import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";

const feedbackSchema = z.object({
  topic: z.enum(["bug", "suggestion", "other"]),
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta girin."),
  message: z
    .string()
    .trim()
    .min(10, "En az 10 karakter yaz.")
    .max(2000, "En fazla 2000 karakter."),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Form hatalı.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const me = await getCurrentUser();
  const { topic, email, message } = parsed.data;

  // Şimdilik sunucu loguna yaz. E-posta servisi (SES/Resend) eklenince oraya yönlendirilir.
  const topicLabel =
    topic === "bug"
      ? "Hata bildirimi"
      : topic === "suggestion"
        ? "Öneri"
        : "Diğer";

  console.info(
    "[feedback]",
    JSON.stringify({
      topic: topicLabel,
      email,
      message,
      fromUserId: me?.id ?? null,
      receivedAt: new Date().toISOString(),
    }),
  );

  return NextResponse.json({ ok: true });
}
