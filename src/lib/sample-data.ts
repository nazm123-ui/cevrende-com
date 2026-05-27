// Tasarımdan birebir kopyalanmış örnek veri — Pendik & çevre semtleri

export const DISTRICTS = ["Tümü", "Pendik", "Kurtköy", "Kaynarca", "Tuzla", "Kartal"];

export const CATEGORIES = [
  { id: "all", label: "Tüm ilanlar", count: 248 },
  { id: "hizmet", label: "Hizmet & satış", count: 86 },
  { id: "yemek", label: "Yeme-içme", count: 54 },
  { id: "saglik", label: "Sağlık & bakım", count: 28 },
  { id: "lojistik", label: "Lojistik & kurye", count: 41 },
  { id: "ofis", label: "Ofis & idari", count: 22 },
  { id: "insaat", label: "İnşaat & saha", count: 17 },
];

export const JOB_TYPES = ["Tümü", "Tam zamanlı", "Yarı zamanlı", "Vardiyalı", "Hafta sonu"];

export interface Worker {
  id: string;
  name: string;
  headline: string;
  initials: string;
  district: string;
  neighborhood: string;
  posted: string;
  category: string;
  categoryId: string;
  type: string;
  age: number;
  phone: string;
  available: string;
  bio: string;
  skills: string[];
  rating: number;
  reviewCount: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  district: string;
  neighborhood: string;
  type: string;
  pay: string;
  payShort: string;
  posted: string;
  summary: string;
  tags: string[];
}

export const SAMPLE_JOBS: Job[] = [
  {
    id: "j1",
    title: "Garson",
    company: "Kahve Dünyası — Pendik Marina",
    district: "Pendik",
    neighborhood: "Batı",
    type: "Tam zamanlı",
    pay: "₺22.000 – ₺26.000 / ay",
    payShort: "₺22–26K",
    posted: "2 saat önce",
    summary: "Sabah ve öğle vardiyaları için deneyimli garson aranıyor.",
    tags: ["Vardiyalı", "Sigorta", "Yemek"],
  },
  {
    id: "j2",
    title: "Kasiyer",
    company: "BİM Şubesi — Kaynarca",
    district: "Pendik",
    neighborhood: "Kaynarca",
    type: "Tam zamanlı",
    pay: "Asgari ücret + prim",
    payShort: "AÜ + prim",
    posted: "5 saat önce",
    summary: "Kaynarca şubemizde kasada görev alacak ekip arkadaşı.",
    tags: ["Yeni başlayan", "Sigorta"],
  },
  {
    id: "j3",
    title: "Kurye (motor)",
    company: "Mahalle Eczanesi",
    district: "Pendik",
    neighborhood: "Çamçeşme",
    type: "Yarı zamanlı",
    pay: "Saatlik ₺140",
    payShort: "₺140/sa",
    posted: "1 gün önce",
    summary: "Akşam saatleri için motorlu kurye.",
    tags: ["Esnek saat", "Akşam"],
  },
  {
    id: "j4",
    title: "Tezgâhtar",
    company: "Furkan Fırın",
    district: "Pendik",
    neighborhood: "Yenişehir",
    type: "Tam zamanlı",
    pay: "₺19.500",
    payShort: "₺19.5K",
    posted: "1 gün önce",
    summary: "Sabah erken vardiyada görev yapacak tezgâhtar.",
    tags: ["Sabah vardiyası", "Yemek"],
  },
];

// Mevcut kullanıcı profili — işveren bakış açısı
export const ME = {
  name: "Furkan Yılmaz",
  initials: "FY",
  role: "İşveren",
  business: "Furkan Fırın",
  district: "Pendik",
  neighborhood: "Yenişehir",
  phone: "0532 *** ** 41",
  email: "furkan@furkanfirin.com",
  since: "Ocak 2025",
  active: true,
  stats: {
    activeJobs: 3,
    applicants: 18,
    responseTime: "1 saat",
  },
};

export interface Message {
  from: "me" | "them";
  time: string;
  text: string;
}

export interface Conversation {
  id: string;
  with: { id: string; name: string; initials: string; role: string };
  lastTime: string;
  unread: number;
  relatedTo: string;
  messages: Message[];
}

export const SAMPLE_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    with: {
      id: "w1",
      name: "Oğuzhan Haymana",
      initials: "OH",
      role: "İş arayan · Kurye",
    },
    lastTime: "12:42",
    unread: 0,
    relatedTo: "Eczane kuryesi ilanın hakkında",
    messages: [
      { from: "them", time: "10:18", text: "Merhaba, kurye ilanınız hâlâ açık mı?" },
      { from: "me", time: "10:24", text: "Merhaba Oğuzhan, evet açık. Akşam vardiyası için arıyoruz." },
      { from: "them", time: "10:25", text: "Süper. 5 yıldır Pendik'te kuryeyim, kendi motorum var." },
      { from: "me", time: "10:31", text: "Harika. Yarın 14:00'da görüşmeye gelebilir misin?" },
      { from: "them", time: "12:42", text: "Olur, eczanede buluşalım. Adresi WhatsApp'tan atar mısınız?" },
    ],
  },
  {
    id: "c2",
    with: {
      id: "w2",
      name: "Selin Aksoy",
      initials: "SA",
      role: "İş arayan · Servis",
    },
    lastTime: "Dün",
    unread: 2,
    relatedTo: "Garson ilanın hakkında",
    messages: [
      { from: "them", time: "Dün 19:04", text: "İyi akşamlar, garson ilanı hâlâ aktif mi?" },
      { from: "them", time: "Dün 19:05", text: "Üç yıldır kafelerde servisim, görüşmek isterim." },
    ],
  },
  {
    id: "c3",
    with: {
      id: "w3",
      name: "Rıdvan Çelik",
      initials: "RÇ",
      role: "İş arayan · Tesisat",
    },
    lastTime: "Pzt",
    unread: 0,
    relatedTo: "Tesisat kalfası ilanın hakkında",
    messages: [
      { from: "them", time: "Pzt 09:11", text: "Merhabalar, kalfa aradığınızı gördüm." },
      { from: "me", time: "Pzt 09:30", text: "Merhaba, evet. CV göndermek ister misiniz?" },
      { from: "them", time: "Pzt 09:32", text: "Tabii, akşam ulaştırırım. Teşekkürler." },
    ],
  },
];

export const SAMPLE_WORKERS: Worker[] = [
  {
    id: "w1",
    name: "Oğuzhan Haymana",
    headline: "5 yıldır kuryeyim",
    initials: "OH",
    district: "Pendik",
    neighborhood: "Kaynarca",
    posted: "12 saat önce",
    category: "Kurye / Dağıtım",
    categoryId: "lojistik",
    type: "Tam zamanlı",
    age: 32,
    phone: "0552 615 69 81",
    available: "Hemen başlayabilir",
    bio: "Beş yıldır Pendik ve Tuzla bölgesinde motorlu kuryelik yapıyorum.",
    skills: ["A2 ehliyet", "Kendi motoru", "Pendik semt bilgisi", "Gece vardiyası"],
    rating: 4.8,
    reviewCount: 24,
  },
  {
    id: "w2",
    name: "Selin Aksoy",
    headline: "Servis tecrübeli, ön mutfak biliyorum",
    initials: "SA",
    district: "Pendik",
    neighborhood: "Batı",
    posted: "1 gün önce",
    category: "Yeme-içme",
    categoryId: "yemek",
    type: "Vardiyalı",
    age: 26,
    phone: "0532 415 02 18",
    available: "1 hafta içinde",
    bio: "Üç yıldır kafe ve restoran zincirlerinde servis ve barista olarak çalıştım.",
    skills: ["Barista", "Servis", "Hijyen sertifikası", "İngilizce (orta)"],
    rating: 4.9,
    reviewCount: 17,
  },
  {
    id: "w3",
    name: "Rıdvan Çelik",
    headline: "Tesisat ustası — saha tecrübeli",
    initials: "RÇ",
    district: "Pendik",
    neighborhood: "Esenyalı",
    posted: "2 gün önce",
    category: "İnşaat & saha",
    categoryId: "insaat",
    type: "Tam zamanlı",
    age: 41,
    phone: "0535 902 11 47",
    available: "Pazartesi'den itibaren",
    bio: "On beş yıllık tesisat ustasıyım. Hem yeni inşaat hem tadilat işleri yapıyorum.",
    skills: ["Sıhhi tesisat", "Kombi montajı", "B ehliyet", "Saha lideri"],
    rating: 5.0,
    reviewCount: 9,
  },
  {
    id: "w4",
    name: "Elif Demir",
    headline: "Çocuk gelişimcisi — bakıcılık",
    initials: "ED",
    district: "Pendik",
    neighborhood: "Güzelyalı",
    posted: "3 gün önce",
    category: "Sağlık & bakım",
    categoryId: "saglik",
    type: "Yarı zamanlı",
    age: 29,
    phone: "0533 281 75 03",
    available: "Hafta içi",
    bio: "Çocuk gelişimi mezunuyum. İki ailede toplam dört yıl tam zamanlı bakıcılık yaptım.",
    skills: ["Çocuk gelişimi lisans", "İlk yardım", "Referanslı", "Hafta içi 09–17"],
    rating: 4.9,
    reviewCount: 11,
  },
];
