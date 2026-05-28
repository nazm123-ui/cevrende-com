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
