import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = [
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
