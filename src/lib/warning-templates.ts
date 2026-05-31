// Sohbet ihlal kategorileri ve hem sistem-mesajı hem e-posta şablonları.
// Admin /admin/raporlar sayfasından bir rapor için kategori seçer, sistem
// kullanıcıya iki kanaldan (in-app mesaj + email) uyarı gönderir.

export type WarningCategory =
  | "hakaret"
  | "cinsel"
  | "dolandiricilik"
  | "spam"
  | "tehdit"
  | "diger";

export type WarningTemplate = {
  slug: WarningCategory;
  label: string;
  subject: string; // email konusu
  systemMessage: string; // sohbete düşecek metin
  emailBody: string; // email gövdesi (plain text)
};

const RULES_LINK = "https://cevrende-com.vercel.app/kullanim-kosullari";

export const WARNING_TEMPLATES: Record<WarningCategory, WarningTemplate> = {
  hakaret: {
    slug: "hakaret",
    label: "Hakaret / Küfür",
    subject: "Çevrende.com — Hakaret içerikli mesaj uyarısı",
    systemMessage:
      "Yöneticilerimiz, mesajlaşmanda hakaret ya da küfür içerikli ifadeler tespit etti. Çevrende.com'da diğer kullanıcılara saygılı dil kullanman zorunludur. Tekrarı halinde hesabın askıya alınabilir veya tamamen kapatılabilir.",
    emailBody:
      "Merhaba,\n\nÇevrende.com hesabınızda yapılan bir bildirim incelenmiş ve mesajlarınızda hakaret/küfür içerikli ifadeler tespit edilmiştir.\n\nPlatformumuzda kullanıcılar arasında saygılı bir iletişim ortamı korunması zorunludur. Tekrarı halinde hesabınız uyarısız olarak askıya alınabilir veya kalıcı olarak kapatılabilir.\n\nSohbet kurallarımız: " +
      RULES_LINK +
      "\n\nÇevrende.com Yönetim Ekibi",
  },
  cinsel: {
    slug: "cinsel",
    label: "Cinsel içerik / Taciz",
    subject: "Çevrende.com — Cinsel içerik / taciz uyarısı",
    systemMessage:
      "Mesajlarında cinsel içerik veya taciz niteliğinde ifadeler tespit edildi. Bu davranış Çevrende.com kullanım koşullarının ağır ihlalidir. Bu son uyarındır; tekrarı halinde hesabın silinecek ve yetkililere bildirim yapılabilir.",
    emailBody:
      "Merhaba,\n\nÇevrende.com hesabınızda yapılan bir bildirim incelenmiş ve mesajlarınızda cinsel içerik veya taciz niteliğinde ifadeler tespit edilmiştir.\n\nBu davranış platform kullanım koşullarının ağır ihlalidir. Bu uyarı son uyarınızdır. Tekrarı halinde hesabınız kalıcı olarak silinecek ve gerekli görüldüğü takdirde yetkili mercilere bildirim yapılacaktır.\n\nSohbet kurallarımız: " +
      RULES_LINK +
      "\n\nÇevrende.com Yönetim Ekibi",
  },
  dolandiricilik: {
    slug: "dolandiricilik",
    label: "Dolandırıcılık girişimi",
    subject: "Çevrende.com — Dolandırıcılık şüphesi uyarısı",
    systemMessage:
      "Mesajlaşmanda dolandırıcılık şüphesi taşıyan davranışlar (para isteme, sahte iş teklifi, ödeme yönlendirmesi vb.) tespit edildi. Hesabın inceleme altına alındı. Açıklamak istediğin bir durum varsa info@cevrende.com adresine yazabilirsin.",
    emailBody:
      "Merhaba,\n\nÇevrende.com hesabınızda yapılan bir bildirim incelenmiş ve mesajlarınızda dolandırıcılık şüphesi taşıyan davranışlar (para talebi, sahte iş teklifi, harici ödeme yönlendirmesi vb.) tespit edilmiştir.\n\nHesabınız inceleme altına alınmıştır. Bir yanlış anlaşılma olduğunu düşünüyorsanız info@cevrende.com adresine yazıp açıklama gönderebilirsiniz.\n\nSohbet kurallarımız: " +
      RULES_LINK +
      "\n\nÇevrende.com Yönetim Ekibi",
  },
  spam: {
    slug: "spam",
    label: "Spam / Reklam",
    subject: "Çevrende.com — Spam içerik uyarısı",
    systemMessage:
      "Mesajlarında alakasız reklam, dış link veya tekrarlayan spam içerik tespit edildi. Çevrende.com sadece Pendik'teki gerçek iş eşleştirmeleri için kullanılmalıdır. Tekrarı halinde hesabın askıya alınır.",
    emailBody:
      "Merhaba,\n\nÇevrende.com hesabınızda yapılan bir bildirim incelenmiş ve mesajlarınızda alakasız reklam, dış link veya tekrarlayan spam içerik tespit edilmiştir.\n\nPlatformumuz yalnızca Pendik bölgesindeki gerçek iş eşleştirmeleri için kullanılmalıdır. Tekrarı halinde hesabınız askıya alınacaktır.\n\nSohbet kurallarımız: " +
      RULES_LINK +
      "\n\nÇevrende.com Yönetim Ekibi",
  },
  tehdit: {
    slug: "tehdit",
    label: "Tehdit / Şiddet",
    subject: "Çevrende.com — Tehdit içerikli mesaj uyarısı",
    systemMessage:
      "Mesajlarında tehdit veya şiddet içeren ifadeler tespit edildi. Bu içerik Türkiye Cumhuriyeti yasaları kapsamında suç teşkil edebilir. Hesabın askıya alındı; içerik gerekli görülürse yetkili mercilere iletilebilir.",
    emailBody:
      "Merhaba,\n\nÇevrende.com hesabınızda yapılan bir bildirim incelenmiş ve mesajlarınızda tehdit veya şiddet içeren ifadeler tespit edilmiştir.\n\nBu tür içerikler Türkiye Cumhuriyeti yasaları kapsamında suç teşkil edebilir. Hesabınız askıya alınmıştır ve içerik gerekli görüldüğü takdirde yetkili mercilere iletilecektir.\n\nSohbet kurallarımız: " +
      RULES_LINK +
      "\n\nÇevrende.com Yönetim Ekibi",
  },
  diger: {
    slug: "diger",
    label: "Diğer kural ihlali",
    subject: "Çevrende.com — Kural ihlali uyarısı",
    systemMessage:
      "Çevrende.com kullanım koşullarına aykırı bir davranış tespit edildi. Lütfen sohbet kurallarımızı bir kez daha gözden geçir. Tekrarı halinde hesabın askıya alınabilir.",
    emailBody:
      "Merhaba,\n\nÇevrende.com hesabınızda yapılan bir bildirim incelenmiş ve kullanım koşullarına aykırı bir davranış tespit edilmiştir.\n\nSohbet kurallarımızı bir kez daha gözden geçirmenizi rica ederiz. Tekrarı halinde hesabınız askıya alınabilir.\n\nSohbet kurallarımız: " +
      RULES_LINK +
      "\n\nÇevrende.com Yönetim Ekibi",
  },
};

export const WARNING_CATEGORIES: Array<{
  slug: WarningCategory;
  label: string;
}> = Object.values(WARNING_TEMPLATES).map(({ slug, label }) => ({
  slug,
  label,
}));
