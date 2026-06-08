import nodemailer from "nodemailer";
import { renderEmail } from "@/lib/email-templates";

// Gönderen kimliği — cevrende.com'dan gönderiyoruz (DKIM/SPF/DMARC ile doğrulanmış,
// spam'e düşmez). Yanıtlar yine yönetim Gmail'ine düşsün diye reply-to ayarlı.
const EMAIL_FROM = process.env.EMAIL_FROM || "Çevrende <bildirim@cevrende.com>";
const REPLY_TO = process.env.EMAIL_REPLY_TO || "infocevrende@gmail.com";
// Yönetim bildirimlerinin (geri bildirim vb.) düşeceği gerçek kutu.
const ADMIN_EMAIL = process.env.GMAIL_USER || "infocevrende@gmail.com";

const SITE = "https://cevrende.com";
const LINK_LOGIN = `${SITE}/giris`;
const LINK_PANEL = `${SITE}/panel`;
const LINK_PROFILE = `${SITE}/panel/profil`;
const LINK_MESSAGES = `${SITE}/panel/mesajlar`;

// Önce Resend (SMTP) — profesyonel teslimat. Yoksa eski Gmail SMTP'ye düşer.
const transporter = process.env.RESEND_API_KEY
  ? nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: { user: "resend", pass: process.env.RESEND_API_KEY },
    })
  : process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      })
    : null;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function nl2br(s: string): string {
  return escapeHtml(s).replace(/\n/g, "<br>");
}

export async function sendOtpEmail(to: string, code: string) {
  if (!transporter) {
    console.log(`[DEV EMAIL OTP] to=${to} code=${code}`);
    return;
  }
  await transporter.sendMail({
    from: EMAIL_FROM,
    replyTo: REPLY_TO,
    to,
    subject: "Çevrende.com – E-posta Doğrulama Kodu",
    text: `Merhaba,\n\nÇevrende.com e-posta doğrulama kodunuz: ${code}\n\nKod 10 dakika geçerlidir. Bu kodu kimseyle paylaşmayın.\n\nÇevrende.com`,
    html: renderEmail("verify", {
      isim: "",
      kod: escapeHtml(code),
      eposta: escapeHtml(to),
    }),
  });
}

type FeedbackPayload = {
  topic: string;
  fromEmail: string;
  message: string;
  fromUserId: string | null;
};

export async function sendFeedbackEmail(payload: FeedbackPayload) {
  const adminEmail = ADMIN_EMAIL;
  if (!transporter || !adminEmail) {
    console.info("[DEV FEEDBACK]", JSON.stringify(payload));
    return;
  }
  const safeMessage = nl2br(payload.message);
  const safeTopic = escapeHtml(payload.topic);
  const safeFrom = escapeHtml(payload.fromEmail);
  const safeUserId = payload.fromUserId ? escapeHtml(payload.fromUserId) : "—";

  // Geri bildirim yalnızca yönetime gider — sade iç şablon yeterli.
  await transporter.sendMail({
    from: EMAIL_FROM,
    to: adminEmail,
    replyTo: payload.fromEmail,
    subject: `[Geri Bildirim - ${payload.topic}] ${payload.fromEmail}`,
    text: `Konu: ${payload.topic}\nGönderen: ${payload.fromEmail}\nUserId: ${payload.fromUserId ?? "—"}\n\n${payload.message}`,
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color:#0F1110;">
        <h2 style="color:#0F1110; margin:0 0 16px;">Geri Bildirim — ${safeTopic}</h2>
        <table style="font-size:14px; color:#3a3a36; margin-bottom:16px;">
          <tr><td style="padding:2px 12px 2px 0;"><strong>Gönderen:</strong></td><td>${safeFrom}</td></tr>
          <tr><td style="padding:2px 12px 2px 0;"><strong>UserId:</strong></td><td>${safeUserId}</td></tr>
        </table>
        <div style="background:#F4F2EB; padding:16px; border:1px solid #E7E3D8; border-radius:8px; font-size:15px; color:#0F1110; line-height:1.5;">
          ${safeMessage}
        </div>
        <p style="font-size:12px; color:#8A8A82; margin-top:32px;">Yanıtlamak için bu e-postaya doğrudan cevap verin (reply-to ayarlı).</p>
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
  const adminEmail = ADMIN_EMAIL;
  if (!transporter || !adminEmail) {
    console.info("[DEV USER WARNING]", JSON.stringify(payload));
    return;
  }
  await transporter.sendMail({
    from: EMAIL_FROM,
    replyTo: REPLY_TO,
    to: payload.to,
    subject: "Çevrende.com — Hesap uyarısı",
    text: `Merhaba ${payload.name},\n\nHesabınızla ilgili bir uyarı aldınız:\n\n${payload.note}\n\nKurallarımızı tekrar gözden geçirmenizi rica ederiz. Aynı durumun tekrarlanması halinde hesabınız pasifleştirilebilir.\n\nÇevrende.com`,
    html: renderEmail("warn", {
      isim: escapeHtml(payload.name),
      uyari_metni: nl2br(payload.note),
      giris_linki: LINK_PANEL,
      eposta: escapeHtml(payload.to),
    }),
  });
}

export async function sendPasswordResetEmail(to: string, code: string) {
  if (!transporter) {
    console.log(`[DEV PASSWORD RESET] to=${to} code=${code}`);
    return;
  }
  await transporter.sendMail({
    from: EMAIL_FROM,
    replyTo: REPLY_TO,
    to,
    subject: "Çevrende.com – Şifre Sıfırlama Kodu",
    text: `Merhaba,\n\nŞifre sıfırlama kodunuz: ${code}\n\nKod 10 dakika geçerlidir. Bu işlemi siz başlatmadıysanız bu e-postayı görmezden gelin.\n\nÇevrende.com`,
    html: renderEmail("reset", {
      isim: "",
      kod: escapeHtml(code),
      eposta: escapeHtml(to),
    }),
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
  const adminEmail = ADMIN_EMAIL;
  if (!transporter || !adminEmail) {
    console.info("[DEV CATEGORIZED WARNING]", JSON.stringify(payload));
    return;
  }
  await transporter.sendMail({
    from: EMAIL_FROM,
    replyTo: REPLY_TO,
    to: payload.to,
    subject: payload.subject,
    text: payload.body,
    html: renderEmail("warn", {
      isim: escapeHtml(payload.name),
      uyari_metni: `<strong>${escapeHtml(payload.categoryLabel)}</strong><br>${nl2br(payload.body)}`,
      giris_linki: LINK_PANEL,
      eposta: escapeHtml(payload.to),
    }),
  });
}

export async function sendWelcomeEmail(payload: {
  to: string;
  name: string;
  password: string;
  loginUrl: string;
}) {
  if (!transporter) {
    console.log(
      `[DEV WELCOME] to=${payload.to} pass=${payload.password} login=${payload.loginUrl}`,
    );
    return;
  }
  await transporter.sendMail({
    from: EMAIL_FROM,
    replyTo: REPLY_TO,
    to: payload.to,
    subject: "Çevrende.com — Hesabın oluşturuldu",
    text: `Merhaba ${payload.name},\n\nÇevrende.com'da senin için bir hesap oluşturuldu.\n\nGiriş bilgilerin:\nE-posta: ${payload.to}\nGeçici şifre: ${payload.password}\n\nGiriş yap: ${payload.loginUrl}\n\nGüvenliğin için ilk girişten sonra şifreni değiştirmeni öneririz.\n\nÇevrende.com — Çevrendekiler seni bulsun.`,
    html: renderEmail("welcome", {
      isim: escapeHtml(payload.name),
      eposta: escapeHtml(payload.to),
      gecici_sifre: escapeHtml(payload.password),
      giris_linki: payload.loginUrl || LINK_LOGIN,
    }),
  });
}

export async function sendAdminMessageEmail(payload: {
  to: string;
  name: string;
  content: string;
}) {
  const adminEmail = ADMIN_EMAIL;
  if (!transporter || !adminEmail) {
    console.info("[DEV ADMIN MESSAGE]", JSON.stringify(payload));
    return;
  }
  await transporter.sendMail({
    from: EMAIL_FROM,
    replyTo: REPLY_TO,
    to: payload.to,
    subject: "Çevrende.com — Yönetimden mesajın var",
    text: `Merhaba ${payload.name},\n\n${payload.content}\n\nBu mesaja Çevrende.com hesabından platform içi mesajlardan da ulaşabilirsin.\n\nÇevrende.com`,
    html: renderEmail("msg", {
      isim: escapeHtml(payload.name),
      mesaj: nl2br(payload.content),
      giris_linki: LINK_MESSAGES,
      eposta: escapeHtml(payload.to),
    }),
  });
}

export async function sendCategoryApprovedEmail(payload: {
  to: string;
  name: string;
  categoryName: string;
  addedToProfile: boolean;
}) {
  const adminEmail = ADMIN_EMAIL;
  if (!transporter || !adminEmail) {
    console.info("[DEV CATEGORY APPROVED]", JSON.stringify(payload));
    return;
  }
  await transporter.sendMail({
    from: EMAIL_FROM,
    replyTo: REPLY_TO,
    to: payload.to,
    subject: `Önerdiğin meslek eklendi: ${payload.categoryName}`,
    text: `Merhaba ${payload.name},\n\nÖnerdiğin "${payload.categoryName}" mesleğini Çevrende.com'a ekledik. Teşekkürler!\n\nÇevrende.com`,
    html: renderEmail("job", {
      isim: escapeHtml(payload.name),
      meslek_adi: escapeHtml(payload.categoryName),
      giris_linki: LINK_PROFILE,
      eposta: escapeHtml(payload.to),
    }),
  });
}
