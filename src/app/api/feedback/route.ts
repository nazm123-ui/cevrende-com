import { NextResponse, after } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { sendFeedbackEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

const feedbackSchema = z.object({
  topic: z.enum(["bug", "suggestion", "other"]),
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta girin."),
  message: z
    .string()
    .trim()
    .min(10, "En az 10 karakter yaz.")
    .max(2000, "En fazla 2000 karakter."),
});

const TOPIC_LABELS: Record<z.infer<typeof feedbackSchema>["topic"], string> = {
  bug: "Hata bildirimi",
  suggestion: "Öneri",
  other: "Diğer",
};

export async function POST(req: Request) {
  const limited = await checkRateLimit(req, "auth-strict");
  if (limited) return limited;

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

  after(async () => {
    try {
      await sendFeedbackEmail({
        topic: TOPIC_LABELS[topic],
        fromEmail: email,
        message,
        fromUserId: me?.id ?? null,
      });
    } catch (err) {
      console.error("[feedback] mail send failed:", err);
    }
  });

  return NextResponse.json({ ok: true });
}
