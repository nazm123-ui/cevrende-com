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

const EMPLOYERS = [
  {
    email: "ahmet.kafe@example.com",
    phone: "05300000001",
    fullName: "Ahmet Yılmaz",
    neighborhood: "Kaynarca",
  },
  {
    email: "ayse.market@example.com",
    phone: "05300000002",
    fullName: "Ayşe Demir",
    neighborhood: "Yenişehir",
  },
  {
    email: "mehmet.etkinlik@example.com",
    phone: "05300000003",
    fullName: "Mehmet Akpınar",
    neighborhood: "Kurtköy",
  },
];

const today = new Date();
const inDays = (n: number) => new Date(today.getTime() + n * 86_400_000);

async function main() {
  // Kategorileri upsert et
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    await prisma.jobCategory.upsert({
      where: { slug: c.slug },
      update: { name: c.name, order: i, isActive: true },
      create: { slug: c.slug, name: c.name, order: i, isActive: true },
    });
  }

  // Demo işverenleri oluştur (doğrulanmış)
  const passwordHash = await bcrypt.hash("demo1234", 10);

  // Admin kullanıcısı oluştur
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      role: "admin",
      fullName: "Admin User",
      email: "admin@example.com",
      phone: "05300000000",
      passwordHash,
      isPhoneVerified: true,
      isEmailVerified: true,
    },
  });

  const employers: { id: string; slug: string }[] = [];
  for (const e of EMPLOYERS) {
    const u = await prisma.user.upsert({
      where: { email: e.email },
      update: {},
      create: {
        role: "employer",
        fullName: e.fullName,
        email: e.email,
        phone: e.phone,
        passwordHash,
        neighborhood: e.neighborhood,
        isPhoneVerified: true,
      isEmailVerified: true,
      },
      select: { id: true },
    });
    employers.push({ id: u.id, slug: e.email });
  }

  const cats = await prisma.jobCategory.findMany();
  const bySlug = new Map(cats.map((c) => [c.slug, c.id]));

  const POSTS = [
    {
      employerIdx: 0,
      title: "Akşam Servisi İçin Garson Aranıyor",
      description:
        "Pendik Kaynarca'daki kafemizde akşam servisinde çalışacak deneyimli veya öğrenmeye açık garson aranıyor. 17:00 - 23:00 saatleri arası, hafta içi ve hafta sonu vardiyalar mevcut.",
      categorySlug: "garson-servis",
      jobType: "shift",
      neighborhood: "Kaynarca",
      salaryAmount: 1000,
      salaryType: "daily",
      neededPeopleCount: 2,
      startTime: "17:00",
      endTime: "23:00",
      benefits: "meal",
    },
    {
      employerIdx: 1,
      title: "Mahalle Marketimize Mağaza Personeli",
      description:
        "Yenişehir'de bulunan marketimizde reyon düzeni, kasiyerlik ve müşteri ilişkilerinden sorumlu, dürüst ve düzenli bir arkadaşımıza ihtiyacımız var. Aylık net maaş + SGK.",
      categorySlug: "magaza-personeli",
      jobType: "full_time",
      neighborhood: "Yenişehir",
      salaryAmount: 22000,
      salaryType: "monthly",
      neededPeopleCount: 1,
      benefits: "meal,transport",
    },
    {
      employerIdx: 2,
      title: "Hafta Sonu Etkinliği İçin Servis Personeli",
      description:
        "Cumartesi günü Kurtköy'de yapılacak özel etkinlikte 3 servis personeli arıyoruz. Daha önce servis deneyimi olan adaylar önceliklidir. Yemek ve servis dahildir.",
      categorySlug: "etkinlik-personeli",
      jobType: "event",
      neighborhood: "Kurtköy",
      salaryAmount: 1200,
      salaryType: "daily",
      neededPeopleCount: 3,
      workDate: inDays(5),
      startTime: "15:00",
      endTime: "23:00",
      benefits: "meal,transport",
    },
    {
      employerIdx: 1,
      title: "Acil — Depo Paketleme Elemanı",
      description:
        "Yenişehir'deki depomuzda paketleme ve etiketleme işlerinde yardımcı olacak personel arıyoruz. Hafta içi 5 gün, günlük 8 saat. Hemen başlayabilecek adaylar tercih edilir.",
      categorySlug: "depo-paketleme",
      jobType: "urgent",
      neighborhood: "Yenişehir",
      salaryAmount: 700,
      salaryType: "daily",
      neededPeopleCount: 4,
      benefits: "meal",
    },
    {
      employerIdx: 0,
      title: "Mutfak Yardımcısı (Yarı Zamanlı)",
      description:
        "Kafemizin mutfak ekibine destek olacak, temiz ve hızlı çalışan bir mutfak yardımcısı arıyoruz. Hafta sonları yoğun, yarı zamanlı çalışma.",
      categorySlug: "mutfak-yardimcisi",
      jobType: "part_time",
      neighborhood: "Kaynarca",
      salaryAmount: 18000,
      salaryType: "monthly",
      neededPeopleCount: 1,
      benefits: "meal",
    },
    {
      employerIdx: 2,
      title: "Tek Seferlik Ev Temizliği",
      description:
        "Kurtköy'deki 3+1 dairemizde detaylı bir bahar temizliği yaptırmak istiyoruz. Yaklaşık 6-7 saat sürecek. Tek günlük iş.",
      categorySlug: "temizlik",
      jobType: "one_time",
      neighborhood: "Kurtköy",
      salaryAmount: 1500,
      salaryType: "per_job",
      neededPeopleCount: 2,
      workDate: inDays(3),
      benefits: "",
    },
    {
      employerIdx: 1,
      title: "Motorlu Kurye Aranıyor",
      description:
        "Pendik içi siparişlerimiz için motorlu kurye arıyoruz. Kendi motoru olan adaylar önceliklidir. Vardiyalı çalışma, akşam saatleri yoğun.",
      categorySlug: "kurye-dagitim",
      jobType: "shift",
      neighborhood: "Esenyalı",
      salaryAmount: 28000,
      salaryType: "monthly",
      neededPeopleCount: 2,
      benefits: "meal",
    },
    {
      employerIdx: 0,
      title: "Bahçe Düzenleme Yardımı",
      description:
        "Kaynarca'daki bahçemizin bakım ve çim biçme işleri için bir günlüğüne yardımcı arıyoruz. Aletler bizde mevcut, sadece gelip çalışmanız yeterli.",
      categorySlug: "bahce-peyzaj",
      jobType: "daily",
      neighborhood: "Kaynarca",
      salaryAmount: 800,
      salaryType: "daily",
      neededPeopleCount: 1,
      workDate: inDays(2),
      benefits: "meal",
    },
  ];

  for (const p of POSTS) {
    const employer = employers[p.employerIdx];
    const categoryId = bySlug.get(p.categorySlug);
    if (!categoryId) continue;

    // Aynı başlık + işveren varsa atla (idempotent)
    const existing = await prisma.jobPost.findFirst({
      where: { title: p.title, employerId: employer.id },
      select: { id: true },
    });
    if (existing) continue;

    await prisma.jobPost.create({
      data: {
        employerId: employer.id,
        title: p.title,
        description: p.description,
        categoryId,
        jobType: p.jobType,
        neighborhood: p.neighborhood,
        salaryAmount: p.salaryAmount ?? null,
        salaryType: p.salaryType,
        neededPeopleCount: p.neededPeopleCount,
        workDate: p.workDate ?? null,
        startTime: p.startTime ?? null,
        endTime: p.endTime ?? null,
        benefits: p.benefits ?? "",
        status: "active",
        expiresAt: inDays(30),
      },
    });
  }

  // Test için pending job ekle
  const testCat = bySlug.get("garson-servis");
  if (testCat) {
    const testJobExists = await prisma.jobPost.findFirst({
      where: { title: "TEST: Admin İncelemesi İçin Pending İlan" },
    });
    if (!testJobExists) {
      await prisma.jobPost.create({
        data: {
          employerId: employers[0].id,
          title: "TEST: Admin İncelemesi İçin Pending İlan",
          description:
            "Bu ilan admin paneli test için oluşturulmuştur. İncelemede durumunda olmalıdır.",
          categoryId: testCat,
          jobType: "shift",
          neighborhood: "Kaynarca",
          salaryAmount: 1000,
          salaryType: "daily",
          neededPeopleCount: 1,
          status: "pending",
          expiresAt: inDays(30),
        },
      });
    }
  }

  const counts = {
    categories: await prisma.jobCategory.count(),
    employers: await prisma.user.count({ where: { role: "employer" } }),
    posts: await prisma.jobPost.count(),
  };
  console.log("Seed tamamlandı:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
