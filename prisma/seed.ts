import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Pendik mahalle bazlı usta + hizmet kategorileri. Sıralama mantıksal:
// önce mevcut gündelik iş kategorileri, sonra yapı/tamir ustaları, sonra
// kişisel bakım vb. "Diğer" her zaman en sonda.
const CATEGORIES = [
  // Gündelik iş kategorileri
  { slug: "garson-servis", name: "Garson / Servis" },
  { slug: "komi", name: "Komi" },
  { slug: "mutfak-yardimcisi", name: "Mutfak Yardımcısı" },
  { slug: "temizlik", name: "Temizlik" },
  { slug: "magaza-personeli", name: "Mağaza Personeli" },
  { slug: "depo-paketleme", name: "Depo / Paketleme" },
  { slug: "tasima-nakliye", name: "Taşıma / Nakliye Yardımı" },
  { slug: "kurye-dagitim", name: "Kurye / Dağıtım" },
  { slug: "etkinlik-personeli", name: "Etkinlik Personeli" },
  { slug: "guvenlik", name: "Güvenlik" },
  { slug: "insaat-tadilat", name: "İnşaat / Tadilat Yardımı" },
  { slug: "bahce-peyzaj", name: "Bahçe / Peyzaj" },
  { slug: "cocuk-bakimi", name: "Çocuk Bakımı" },
  { slug: "yasli-bakimi", name: "Yaşlı Bakımı" },
  { slug: "ev-hizmetleri", name: "Ev Hizmetleri" },
  // Ev tadilat / yapı ustaları
  { slug: "elektrikci", name: "Elektrikçi" },
  { slug: "tesisatci", name: "Tesisatçı / Su Tesisatçısı" },
  { slug: "boyaci", name: "Boyacı" },
  { slug: "marangoz", name: "Marangoz / Mobilya Ustası" },
  { slug: "fayans-mermer", name: "Fayans / Mermer Ustası" },
  { slug: "siva-alcipan", name: "Sıva / Alçıpan Ustası" },
  { slug: "pvc-dograma", name: "PVC / Doğrama / Cam Balkon" },
  { slug: "cati-izolasyon", name: "Çatı / İzolasyon" },
  // Tamir / bakım
  { slug: "cilingir", name: "Çilingir" },
  { slug: "klima-tamiri", name: "Klima Tamiri / Kurulumu" },
  { slug: "kombi-tamiri", name: "Kombi Tamiri / Bakımı" },
  { slug: "beyaz-esya-tamiri", name: "Beyaz Eşya Tamiri" },
  { slug: "bilgisayar-telefon-tamiri", name: "Bilgisayar / Telefon Tamiri" },
  // Temizlik alt grupları
  { slug: "hali-yikama", name: "Halı Yıkama" },
  { slug: "cam-silme", name: "Cam Silme / Yüksekten Temizlik" },
  { slug: "koltuk-yikama", name: "Koltuk / Mobilya Yıkama" },
  { slug: "dezenfeksiyon", name: "Dezenfeksiyon / Haşere İlaçlama" },
  // Kişisel bakım (eve gelen)
  { slug: "kuafor-berber", name: "Kuaför / Berber (Eve Gelen)" },
  { slug: "manikur-pedikur", name: "Manikür / Pedikür" },
  { slug: "estetisyen", name: "Estetisyen / Cilt Bakımı" },
  { slug: "masaj", name: "Masöz / Masör" },
  // Bakım hizmetleri
  { slug: "hasta-refakatci", name: "Hasta Refakatçi" },
  { slug: "pet-sitter", name: "Pet Sitter / Köpek Gezdirme" },
  { slug: "evde-saglik", name: "Hemşire / Evde Sağlık" },
  // Mutfak / yemek
  { slug: "asci-catering", name: "Eve Gelen Aşçı / Catering" },
  // Eğitim
  { slug: "ozel-ders", name: "Özel Ders" },
  // Ulaşım / taşıma
  { slug: "evden-eve-nakliyat", name: "Evden Eve Nakliyat" },
  // Diğer hizmetler
  { slug: "terzi", name: "Terzi / Dikiş Tadilat" },
  { slug: "fotografci", name: "Fotoğrafçı" },
  // Yaratıcı / dijital işler
  { slug: "grafik-tasarim", name: "Grafik Tasarımcı" },
  { slug: "web-yazilim", name: "Web Tasarım / Yazılım Geliştirici" },
  { slug: "sosyal-medya", name: "Sosyal Medya / Dijital Pazarlama" },
  { slug: "video-icerik", name: "Video Editörü / İçerik Üretimi" },
  { slug: "muzisyen-dj", name: "Müzisyen / DJ" },
  // Profesyonel hizmetler
  { slug: "tercuman", name: "Tercüman / Çevirmen" },
  { slug: "muhasebe", name: "Muhasebe / Mali Müşavir Asistanı" },
  { slug: "emlak-danismani", name: "Emlak Danışmanı" },
  { slug: "sigorta-danismani", name: "Sigorta Acentesi / Danışmanlığı" },
  { slug: "etkinlik-organizasyon", name: "Düğün / Etkinlik Organizasyon" },
  // Eğitim genişletme
  { slug: "dil-egitmeni", name: "Yabancı Dil Eğitmeni" },
  { slug: "muzik-ogretmeni", name: "Müzik Öğretmeni" },
  { slug: "spor-egitmeni", name: "Spor / Yüzme Eğitmeni" },
  { slug: "kisisel-antrenor", name: "Kişisel Antrenör (PT)" },
  { slug: "yoga-pilates", name: "Yoga / Pilates Eğitmeni" },
  // Sağlık genişletme
  { slug: "fizyoterapist", name: "Fizyoterapist (Evde)" },
  { slug: "diyetisyen", name: "Diyetisyen" },
  { slug: "cocuk-gelisimi", name: "Çocuk Gelişimi Uzmanı" },
  // Etkinlik hizmetleri
  { slug: "pasta-hamur", name: "Pasta / Hamur İşi Ustası" },
  { slug: "animator", name: "Animatör / Çocuk Eğlencesi" },
  { slug: "balon-susleme", name: "Balon / Süsleme" },
  // Diğer (gündelik)
  { slug: "sofor-ozel", name: "Şoför (Özel)" },
  { slug: "pet-bakim", name: "Veteriner Asistanı / Pet Bakım" },
  { slug: "saat-mucevher-tamiri", name: "Saat / Mücevher Tamiri" },
  // Oto / araç hizmetleri
  { slug: "oto-tamir", name: "Oto Tamir / Bakım" },
  { slug: "oto-yikama", name: "Oto Yıkama / Detaylı Temizlik" },
  { slug: "oto-kaporta", name: "Oto Kaporta / Boya" },
  { slug: "oto-elektrik", name: "Oto Elektrik / Akü" },
  { slug: "motosiklet-tamiri", name: "Motosiklet Tamiri" },
  { slug: "lastik-balans", name: "Lastik / Balans / Rot Ayarı" },
  // Elektronik kurulum
  { slug: "uydu-tv-kurulum", name: "Uydu / TV / Anten Kurulumu" },
  { slug: "guvenlik-kamera-kurulum", name: "Güvenlik Kamera / Alarm Kurulumu" },
  { slug: "akilli-ev-network", name: "Akıllı Ev / Network / Kablo Döşeme" },
  // Yapı uzmanlaşma
  { slug: "asansor-tamir", name: "Asansör Tamiri / Bakımı" },
  { slug: "dolap-mobilya-yapim", name: "Mutfak / Banyo Dolap Komple" },
  { slug: "perde-mobilya-montaj", name: "Perde / Stor / Mobilya Montajı" },
  { slug: "kalorifer-radyator", name: "Kalorifer / Radyatör / Tesisat" },
  // Pet + apartman
  { slug: "pet-egitmen-kuafor", name: "Köpek Eğitmeni / Pet Kuaför" },
  { slug: "apartman-gorevlisi", name: "Apartman Görevlisi / Kapıcı" },
  // Hukuk / finans
  { slug: "avukat-hukuk", name: "Avukat / Hukuk Danışmanı" },
  { slug: "noter-danismani", name: "Noter İşleri Danışmanı" },
  // Yapı uzmanlaşma (ek)
  { slug: "demirci-kaynakci", name: "Demirci / Kaynakçı / Korkuluk" },
  { slug: "celik-kapi-montaj", name: "Çelik Kapı / Garaj Kapısı Montajı" },
  // Düğün / kişisel bakım (özel)
  { slug: "gelin-makyaji", name: "Gelin Makyajı / Düğün Saçı" },
  { slug: "kalici-makyaj", name: "Kalıcı Makyaj / Microblading" },
  { slug: "lazer-epilasyon", name: "Lazer Epilasyon" },
  // Bebek / çocuk (ek)
  { slug: "lohusa-bebek-bakim", name: "Lohusa / Bebek Bakım Hemşiresi" },
  { slug: "sinav-kocu", name: "Sınav Koçu (LGS / YKS / KPSS)" },
  // Yemek (ek)
  { slug: "ev-yemekleri", name: "Ev Yemekleri / Eve Yemek" },
  // Yaşam koçluğu
  { slug: "yasam-kocu", name: "Yaşam Koçu / Kişisel Gelişim" },
  // Tente
  { slug: "tente-cadir", name: "Tente / Çadır / Pergola Kurulumu" },
  // En sonda
  { slug: "diger", name: "Diğer" },
];

async function main() {
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    await prisma.jobCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, order: i, isActive: true },
      create: { slug: c.slug, name: c.name, order: i, isActive: true },
    });
  }

  const passwordHash = await bcrypt.hash("demo1234", 10);
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      fullName: "Admin User",
      email: "admin@example.com",
      phone: "05300000000",
      passwordHash,
      isPhoneVerified: true,
      isEmailVerified: true,
    },
  });

  console.log(`Seeded ${CATEGORIES.length} categories + admin user.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
