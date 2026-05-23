import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type Visibility = "public" | "after_approval" | "private";

type DemoWorker = {
  fullName: string;
  email: string;
  phone: string;
  district: "Pendik" | "Tuzla" | "Kartal";
  neighborhood: string;
  professions: string[];
  bio: string;
  phoneVisibility: Visibility;
  showName: boolean;
  showDistrict: boolean;
};

// 20 demo workers
// public phone (acil iş hatları): çilingir, çekici, su tesisatı, lastikçi, vinç, anahtarcı
// after_approval (default): çoğunluk
// private (sadece mesaj): bazı tercihli kişiler
const DEMO_WORKERS: DemoWorker[] = [
  // ===== PUBLIC PHONE (6 kişi — acil hizmetler) =====
  {
    fullName: "Mehmet Çilingir",
    email: "mehmet.cilingir@demo.cevrende.com",
    phone: "05330000101",
    district: "Pendik",
    neighborhood: "Kaynarca",
    professions: ["diger", "ev-hizmetleri"],
    bio: "Çilingir · 7/24 acil kapı açma, kilit değiştirme, oto anahtarı. 12 yıl tecrübe. Pendik ve çevresi.",
    phoneVisibility: "public",
    showName: true,
    showDistrict: true,
  },
  {
    fullName: "Hasan Çekici",
    email: "hasan.cekici@demo.cevrende.com",
    phone: "05330000102",
    district: "Pendik",
    neighborhood: "Kurtköy",
    professions: ["tasima-nakliye"],
    bio: "Yol yardım ve çekici hizmeti. Akü, lastik, benzin bitmesi. 7/24 hızlı varış.",
    phoneVisibility: "public",
    showName: true,
    showDistrict: true,
  },
  {
    fullName: "Adem Su Tesisatçısı",
    email: "adem.tesisat@demo.cevrende.com",
    phone: "05330000103",
    district: "Pendik",
    neighborhood: "Çamçeşme",
    professions: ["insaat-tadilat", "ev-hizmetleri"],
    bio: "Su tesisatçısı · Tıkanıklık, sızıntı, kombi bağlantısı. Acil müdahale. Pendik genelinde.",
    phoneVisibility: "public",
    showName: true,
    showDistrict: true,
  },
  {
    fullName: "Yusuf Elektrik",
    email: "yusuf.elektrik@demo.cevrende.com",
    phone: "05330000104",
    district: "Tuzla",
    neighborhood: "Aydınlı",
    professions: ["insaat-tadilat", "ev-hizmetleri"],
    bio: "Elektrik tesisatı · Pano arıza, sigorta, anahtar-priz montajı. Lisanslı elektrikçi.",
    phoneVisibility: "public",
    showName: true,
    showDistrict: true,
  },
  {
    fullName: "İbrahim Vinç",
    email: "ibrahim.vinc@demo.cevrende.com",
    phone: "05330000105",
    district: "Pendik",
    neighborhood: "Harmandere",
    professions: ["tasima-nakliye"],
    bio: "Asansörlü ev taşıma, vinç hizmeti. Aynı gün taşıma. Pendik-Tuzla-Kartal.",
    phoneVisibility: "public",
    showName: true,
    showDistrict: true,
  },
  {
    fullName: "Selim Lastikçi",
    email: "selim.lastik@demo.cevrende.com",
    phone: "05330000106",
    district: "Pendik",
    neighborhood: "Kavakpınar",
    professions: ["diger"],
    bio: "Mobil lastik servisi · Yol kenarında lastik tamir, balans, rot ayarı. 7/24.",
    phoneVisibility: "public",
    showName: true,
    showDistrict: true,
  },

  // ===== AFTER_APPROVAL (9 kişi — onaylanınca numara açılır) =====
  {
    fullName: "Ayşe Yılmaz",
    email: "ayse.yilmaz@demo.cevrende.com",
    phone: "05330000201",
    district: "Pendik",
    neighborhood: "Yenişehir",
    professions: ["temizlik", "ev-hizmetleri"],
    bio: "Ev temizliği, ütü, yemek yardımı. Haftalık veya günlük. 8 yıl referanslı tecrübe.",
    phoneVisibility: "after_approval",
    showName: true,
    showDistrict: true,
  },
  {
    fullName: "Fatma Kaya",
    email: "fatma.kaya@demo.cevrende.com",
    phone: "05330000202",
    district: "Pendik",
    neighborhood: "Esenyalı",
    professions: ["cocuk-bakimi"],
    bio: "Çocuk bakıcısı · Okul öncesi yaş grubu deneyimli. Pedagojik formasyon. Referanslı.",
    phoneVisibility: "after_approval",
    showName: true,
    showDistrict: true,
  },
  {
    fullName: "Emre Aslan",
    email: "emre.aslan@demo.cevrende.com",
    phone: "05330000203",
    district: "Pendik",
    neighborhood: "Velibaba",
    professions: ["garson-servis", "komi"],
    bio: "Restoran ve kafe deneyimi var. Hafta sonu vardiyalarda esnek. 3 yıl Pendik'te.",
    phoneVisibility: "after_approval",
    showName: false,
    showDistrict: true,
  },
  {
    fullName: "Burak Demir",
    email: "burak.demir@demo.cevrende.com",
    phone: "05330000204",
    district: "Kartal",
    neighborhood: "Yakacık",
    professions: ["depo-paketleme", "tasima-nakliye"],
    bio: "Depo elemanı, paketleme, yük taşıma. Forklift sertifikalı. Erkenden başlayabilir.",
    phoneVisibility: "after_approval",
    showName: true,
    showDistrict: true,
  },
  {
    fullName: "Mert Kurye",
    email: "mert.kurye@demo.cevrende.com",
    phone: "05330000205",
    district: "Pendik",
    neighborhood: "Çamlık",
    professions: ["kurye-dagitim"],
    bio: "Motorlu kurye · Şehir içi paket, evrak, yemek dağıtımı. Kendi motoru var.",
    phoneVisibility: "after_approval",
    showName: false,
    showDistrict: true,
  },
  {
    fullName: "Zeynep Öztürk",
    email: "zeynep.ozturk@demo.cevrende.com",
    phone: "05330000206",
    district: "Pendik",
    neighborhood: "Fevzi Çakmak",
    professions: ["yasli-bakimi", "ev-hizmetleri"],
    bio: "Yaşlı bakımı · Hasta refakat, ilaç saati, ev hijyeni. Hemşire yardımcılığı sertifikası.",
    phoneVisibility: "after_approval",
    showName: true,
    showDistrict: true,
  },
  {
    fullName: "Ali Vatan",
    email: "ali.vatan@demo.cevrende.com",
    phone: "05330000207",
    district: "Tuzla",
    neighborhood: "İçmeler",
    professions: ["guvenlik", "etkinlik-personeli"],
    bio: "Özel güvenlik sertifikalı (silahsız). Etkinlik ve gece vardiyası deneyimi.",
    phoneVisibility: "after_approval",
    showName: true,
    showDistrict: true,
  },
  {
    fullName: "Hatice Polat",
    email: "hatice.polat@demo.cevrende.com",
    phone: "05330000208",
    district: "Pendik",
    neighborhood: "Bahçelievler",
    professions: ["mutfak-yardimcisi", "temizlik"],
    bio: "Mutfak yardımcısı, sebze hazırlık, bulaşık. Kahvaltıcı ve lokanta deneyimi.",
    phoneVisibility: "after_approval",
    showName: false,
    showDistrict: false,
  },
  {
    fullName: "Murat Şahin",
    email: "murat.sahin@demo.cevrende.com",
    phone: "05330000209",
    district: "Pendik",
    neighborhood: "Güllübağlar",
    professions: ["bahce-peyzaj", "ev-hizmetleri"],
    bio: "Bahçıvan · Çim biçme, budama, peyzaj bakımı. Apartman bahçeleri için aylık paket.",
    phoneVisibility: "after_approval",
    showName: true,
    showDistrict: true,
  },

  // ===== PRIVATE (5 kişi — sadece mesaj) =====
  {
    fullName: "Esra Avcı",
    email: "esra.avci@demo.cevrende.com",
    phone: "05330000301",
    district: "Pendik",
    neighborhood: "Şeyhli",
    professions: ["cocuk-bakimi", "ev-hizmetleri"],
    bio: "Çocuk bakıcısı ve hafif ev işleri. Önce mesajla tanışmayı tercih ederim.",
    phoneVisibility: "private",
    showName: false,
    showDistrict: true,
  },
  {
    fullName: "Sevgi Yıldız",
    email: "sevgi.yildiz@demo.cevrende.com",
    phone: "05330000302",
    district: "Tuzla",
    neighborhood: "Postane",
    professions: ["temizlik"],
    bio: "Apartman ve ofis temizliği. İletişim için mesaj atın, detayları yazışarak konuşalım.",
    phoneVisibility: "private",
    showName: false,
    showDistrict: true,
  },
  {
    fullName: "Onur Kara",
    email: "onur.kara@demo.cevrende.com",
    phone: "05330000303",
    district: "Pendik",
    neighborhood: "Ramazanoğlu",
    professions: ["magaza-personeli", "etkinlik-personeli"],
    bio: "Mağaza ve etkinlikte parttime çalışırım. Lütfen önce mesaj atın.",
    phoneVisibility: "private",
    showName: false,
    showDistrict: true,
  },
  {
    fullName: "Büşra Ak",
    email: "busra.ak@demo.cevrende.com",
    phone: "05330000304",
    district: "Pendik",
    neighborhood: "Dumlupınar",
    professions: ["yasli-bakimi"],
    bio: "Yaşlı refakat ve bakım. İletişim mesaj üzerinden, tanıştıktan sonra telefon paylaşırım.",
    phoneVisibility: "private",
    showName: true,
    showDistrict: true,
  },
  {
    fullName: "Kerem Doğan",
    email: "kerem.dogan@demo.cevrende.com",
    phone: "05330000305",
    district: "Kartal",
    neighborhood: "Soğanlık",
    professions: ["insaat-tadilat"],
    bio: "Boya, alçıpan, fayans işleri. Önce iş detayını yazışarak konuşmayı tercih ederim.",
    phoneVisibility: "private",
    showName: true,
    showDistrict: true,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 10);
  let created = 0;
  let updated = 0;

  for (const w of DEMO_WORKERS) {
    const workerSettings = {
      showName: w.showName,
      showDistrict: w.showDistrict,
      phoneVisibility: w.phoneVisibility,
    };

    const existing = await prisma.user.findUnique({ where: { email: w.email } });

    if (existing) {
      await prisma.user.update({
        where: { email: w.email },
        data: {
          fullName: w.fullName,
          phone: w.phone,
          district: w.district,
          neighborhood: w.neighborhood,
          professions: w.professions,
          bio: w.bio,
          workerSettings,
          isPhoneVerified: true,
          isEmailVerified: true,
          isActive: true,
        },
      });
      updated++;
    } else {
      await prisma.user.create({
        data: {
          fullName: w.fullName,
          email: w.email,
          phone: w.phone,
          passwordHash,
          city: "İstanbul",
          district: w.district,
          neighborhood: w.neighborhood,
          professions: w.professions,
          bio: w.bio,
          workerSettings,
          isPhoneVerified: true,
          isEmailVerified: true,
          isActive: true,
        },
      });
      created++;
    }
  }

  console.log(
    `✓ Demo işçi seed tamamlandı — ${created} oluşturuldu, ${updated} güncellendi (toplam ${DEMO_WORKERS.length}).`,
  );
  console.log(
    `   Public phone: ${DEMO_WORKERS.filter((w) => w.phoneVisibility === "public").length}`,
  );
  console.log(
    `   After approval: ${DEMO_WORKERS.filter((w) => w.phoneVisibility === "after_approval").length}`,
  );
  console.log(
    `   Private (sadece mesaj): ${DEMO_WORKERS.filter((w) => w.phoneVisibility === "private").length}`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
