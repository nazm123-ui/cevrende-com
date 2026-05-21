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
