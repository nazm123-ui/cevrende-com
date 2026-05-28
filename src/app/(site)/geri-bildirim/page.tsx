import { getCurrentUser } from "@/lib/auth";
import FeedbackForm from "@/components/FeedbackForm";

export const metadata = {
  title: "Geri Bildirim — Cevrende.com",
  description:
    "Hata bildir, öneride bulun veya görüşlerini paylaş. Ekibimiz her geri bildirimi okur.",
};

export default async function GeriBildirimPage() {
  const user = await getCurrentUser();

  return (
    <div className="page">
      <section style={{ padding: "56px 0 24px" }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Geri Bildirim
          </div>
          <h2 style={{ marginBottom: 12 }}>Bize yaz</h2>
          <p style={{ color: "var(--color-ink-500)", fontSize: 16 }}>
            Hata bildirimleri, öneriler ve görüşler için aşağıdaki formu doldur.
            Genellikle birkaç gün içinde dönüş yapıyoruz.
          </p>
        </div>
      </section>

      <section style={{ padding: "16px 0 96px" }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <FeedbackForm defaultEmail={user?.email ?? ""} />
        </div>
      </section>
    </div>
  );
}
