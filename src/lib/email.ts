import nodemailer from "nodemailer";

const hasCredentials = Boolean(
  process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD,
);

const transporter = hasCredentials
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  : null;

export async function sendOtpEmail(to: string, code: string) {
  if (!transporter) {
    console.log(`[DEV EMAIL OTP] to=${to} code=${code}`);
    return;
  }
  await transporter.sendMail({
    from: `"Çevrende.com" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Çevrende.com – E-posta Doğrulama Kodu",
    text: `Merhaba,\n\nÇevrende.com e-posta doğrulama kodunuz: ${code}\n\nKod 10 dakika geçerlidir. Bu kodu kimseyle paylaşmayın.\n\nÇevrende.com`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0f172a;">Çevrende.com E-posta Doğrulama</h2>
        <p>Merhaba,</p>
        <p>E-posta doğrulama kodunuz:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; text-align: center; background: #f1f5f9; padding: 16px; border-radius: 8px;">${code}</p>
        <p style="font-size: 14px; color: #64748b;">Kod 10 dakika geçerlidir. Bu kodu kimseyle paylaşmayın.</p>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">Çevrende.com</p>
      </div>
    `,
  });
}

type FeedbackPayload = {
  topic: string;
  fromEmail: string;
  message: string;
  fromUserId: string | null;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendFeedbackEmail(payload: FeedbackPayload) {
  const adminEmail = process.env.GMAIL_USER;
  if (!transporter || !adminEmail) {
    console.info("[DEV FEEDBACK]", JSON.stringify(payload));
    return;
  }
  const safeMessage = escapeHtml(payload.message).replace(/\n/g, "<br>");
  const safeTopic = escapeHtml(payload.topic);
  const safeFrom = escapeHtml(payload.fromEmail);
  const safeUserId = payload.fromUserId ? escapeHtml(payload.fromUserId) : "—";

  await transporter.sendMail({
    from: `"Çevrende.com Geri Bildirim" <${adminEmail}>`,
    to: adminEmail,
    replyTo: payload.fromEmail,
    subject: `[Geri Bildirim - ${payload.topic}] ${payload.fromEmail}`,
    text: `Konu: ${payload.topic}\nGönderen: ${payload.fromEmail}\nUserId: ${payload.fromUserId ?? "—"}\n\n${payload.message}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0f172a; margin: 0 0 16px;">Geri Bildirim — ${safeTopic}</h2>
        <table style="font-size: 14px; color: #475569; margin-bottom: 16px;">
          <tr><td style="padding: 2px 12px 2px 0;"><strong>Gönderen:</strong></td><td>${safeFrom}</td></tr>
          <tr><td style="padding: 2px 12px 2px 0;"><strong>UserId:</strong></td><td>${safeUserId}</td></tr>
        </table>
        <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; font-size: 15px; color: #0f172a; line-height: 1.5;">
          ${safeMessage}
        </div>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">Yanıtlamak için bu e-postaya cevap verin (reply-to ayarlı).</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, code: string) {
  if (!transporter) {
    console.log(`[DEV PASSWORD RESET] to=${to} code=${code}`);
    return;
  }
  await transporter.sendMail({
    from: `"Çevrende.com" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Çevrende.com – Şifre Sıfırlama Kodu",
    text: `Merhaba,\n\nŞifre sıfırlama kodunuz: ${code}\n\nKod 10 dakika geçerlidir. Bu işlemi siz başlatmadıysanız bu e-postayı görmezden gelin.\n\nÇevrende.com`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0f172a;">Şifre Sıfırlama</h2>
        <p>Merhaba,</p>
        <p>Şifrenizi sıfırlamak için aşağıdaki kodu kullanın:</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2563eb; text-align: center; background: #f1f5f9; padding: 16px; border-radius: 8px;">${code}</p>
        <p style="font-size: 14px; color: #64748b;">Kod 10 dakika geçerlidir. Bu işlemi siz başlatmadıysanız bu e-postayı görmezden gelin — hesabınız güvende.</p>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">Çevrende.com</p>
      </div>
    `,
  });
}
