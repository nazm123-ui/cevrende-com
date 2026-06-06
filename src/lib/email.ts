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

type WarningPayload = {
  to: string;
  name: string;
  note: string;
};

export async function sendUserWarningEmail(payload: WarningPayload) {
  const adminEmail = process.env.GMAIL_USER;
  if (!transporter || !adminEmail) {
    console.info("[DEV USER WARNING]", JSON.stringify(payload));
    return;
  }
  const safeName = escapeHtml(payload.name);
  const safeNote = escapeHtml(payload.note).replace(/\n/g, "<br>");

  await transporter.sendMail({
    from: `"Çevrende.com" <${adminEmail}>`,
    to: payload.to,
    subject: "Çevrende.com — Hesap uyarısı",
    text: `Merhaba ${payload.name},\n\nHesabınızla ilgili bir uyarı aldınız:\n\n${payload.note}\n\nKurallarımızı tekrar gözden geçirmenizi rica ederiz. Aynı durumun tekrarlanması halinde hesabınız pasifleştirilebilir.\n\nÇevrende.com`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0f172a; margin: 0 0 16px;">Hesap Uyarısı</h2>
        <p>Merhaba ${safeName},</p>
        <p>Çevrende.com ekibi, hesabınızla ilgili bir konuda sizi uyarmak istiyor:</p>
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 14px 16px; border-radius: 6px; font-size: 14px; color: #78350f; line-height: 1.6; margin: 16px 0;">
          ${safeNote}
        </div>
        <p style="font-size: 14px; color: #475569;">Kurallarımızı tekrar gözden geçirmenizi rica ederiz. Aynı durumun tekrarlanması halinde hesabınız pasifleştirilebilir.</p>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">Çevrende.com Yöneticileri</p>
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

// Kategorize uyarı emaili — admin /admin/raporlar'dan bir kategori seçtiğinde
// kullanılır. Subject + plain text body parametre olarak gelir.
export async function sendCategorizedWarningEmail(payload: {
  to: string;
  name: string;
  subject: string;
  body: string;
  categoryLabel: string;
}) {
  const adminEmail = process.env.GMAIL_USER;
  if (!transporter || !adminEmail) {
    console.info("[DEV CATEGORIZED WARNING]", JSON.stringify(payload));
    return;
  }
  const safeBody = escapeHtml(payload.body).replace(/\n/g, "<br>");
  const safeCat = escapeHtml(payload.categoryLabel);
  await transporter.sendMail({
    from: `"Çevrende.com Yönetim" <${adminEmail}>`,
    to: payload.to,
    subject: payload.subject,
    text: payload.body,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #0f172a;">
        <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 10px 14px; border-radius: 6px; margin-bottom: 16px;">
          <strong style="color: #991b1b; font-size: 13px;">İHLAL KATEGORİSİ: ${safeCat}</strong>
        </div>
        <div style="font-size: 14px; line-height: 1.65;">${safeBody}</div>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">Çevrende.com — Bu mesaj otomatik bir yönetim uyarısıdır.</p>
      </div>
    `,
  });
}

export async function sendCategoryApprovedEmail(payload: {
  to: string;
  name: string;
  categoryName: string;
  addedToProfile: boolean;
}) {
  const adminEmail = process.env.GMAIL_USER;
  if (!transporter || !adminEmail) {
    console.info("[DEV CATEGORY APPROVED]", JSON.stringify(payload));
    return;
  }
  const safeName = escapeHtml(payload.name);
  const safeCat = escapeHtml(payload.categoryName);
  const profileLine = payload.addedToProfile
    ? `<strong>${safeCat}</strong> mesleğini profiline ekledik — dilersen panelden kontrol edip güncelleyebilirsin.`
    : `Artık profil ayarlarından <strong>${safeCat}</strong> mesleğini seçebilirsin.`;
  await transporter.sendMail({
    from: `"Çevrende.com" <${adminEmail}>`,
    to: payload.to,
    subject: `Önerdiğin meslek eklendi: ${payload.categoryName}`,
    text: `Merhaba ${payload.name},\n\nÖnerdiğin "${payload.categoryName}" mesleğini Çevrende.com'a ekledik. Teşekkürler!\n\nÇevrende.com`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #0f172a;">
        <div style="background: #dcfce7; border-left: 4px solid #16a34a; padding: 10px 14px; border-radius: 6px; margin-bottom: 16px;">
          <strong style="color: #166534; font-size: 13px;">Önerin onaylandı 🎉</strong>
        </div>
        <p style="font-size: 14px; line-height: 1.65;">Merhaba ${safeName},</p>
        <p style="font-size: 14px; line-height: 1.65;">
          Önerdiğin <strong>${safeCat}</strong> mesleğini Çevrende.com kategorilerine ekledik. Katkın için teşekkürler! ${profileLine}
        </p>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">Çevrende.com — Mahallendeki usta, tek aramada.</p>
      </div>
    `,
  });
}
