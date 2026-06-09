// Elle hazırlanmış kategori landing sayfaları (/pendik/[meslek]).
// NOT: Bu programatik SEO DEĞİLDİR — yalnızca gerçekten yeterli arz olan,
// elle yazılmış özgün içeriğe sahip birkaç kategori. Arz büyüdükçe yenisi eklenir.

export type CategoryFaq = { q: string; a: string };

export type CategoryGuidePoint = { title: string; body: string };

export type CategoryPage = {
  /** URL ve DB kategori slug'ı (örn. "boyaci") */
  slug: string;
  /** İşçi filtrelemesi için DB jobCategory.slug — genelde slug ile aynı */
  categorySlug: string;
  /** Kısa meslek adı, örn. "Boyacı" */
  name: string;
  /** Sayfa H1'i, örn. "Pendik Boyacı" */
  h1: string;
  metaTitle: string;
  metaDescription: string;
  /** Giriş paragrafı */
  intro: string;
  /** "Nelere dikkat etmeli" rehberi */
  guideTitle: string;
  guidePoints: CategoryGuidePoint[];
  /** İşçi listesi boşken gösterilecek kısa metin */
  emptyState: string;
  faqs: CategoryFaq[];
};

export const CATEGORY_PAGES: Record<string, CategoryPage> = {
  boyaci: {
    slug: "boyaci",
    categorySlug: "boyaci",
    name: "Boyacı",
    h1: "Pendik Boyacı",
    metaTitle: "Pendik Boyacı — Mahallenden Boya Ustası Bul",
    metaDescription:
      "Pendik'te iç cephe, dış cephe ve dekoratif boya işleri için mahallenden boyacı bul. Profilleri incele, doğrudan mesajla. Aracısız, komisyonsuz.",
    intro:
      "Evini ya da iş yerini boyatmak istiyor ama nereden başlayacağını bilmiyor musun? Pendik'te iç cephe, dış cephe, alçı ve dekoratif boya işleri yapan ustaları burada bir arada bulursun. Her profilde kişinin deneyimini ve çalıştığı mahalleyi görür, aracı olmadan doğrudan mesaj atarsın. Komisyon yok, üyelik ücreti yok.",
    guideTitle: "Pendik'te boyacı seçerken nelere dikkat etmeli?",
    guidePoints: [
      {
        title: "İşi netleştir",
        body: "Kaç metrekare, kaç oda, iç cephe mi dış cephe mi? Ustaya ne kadar net anlatırsan o kadar doğru fiyat alırsın.",
      },
      {
        title: "Önceki işlerini sor",
        body: "Daha önce yaptığı boya işlerinden fotoğraf veya referans iste. Profildeki iş geçmişi sana fikir verir.",
      },
      {
        title: "Malzeme dahil mi?",
        body: "Fiyatın boya ve malzemeyi içerip içermediğini baştan konuş. İşçilik ile malzeme ayrı mı, birlikte mi netleştir.",
      },
      {
        title: "Mahalleyi değerlendir",
        body: "Sana yakın mahallede çalışan bir usta hem daha hızlı gelir hem ulaşım derdi olmaz.",
      },
      {
        title: "İlk iletişimi platformda tut",
        body: "İlk yazışmayı Cevrende üzerinden yap; anlaştıktan sonra dilersen telefonla devam edersin.",
      },
    ],
    emptyState:
      "Şu anda Pendik'te müsait boyacı görünmüyor. Boya işi yapıyorsan ücretsiz profil oluştur, bu sayfada ilk sen görün.",
    faqs: [
      {
        q: "Pendik'te boyacılar hangi işleri yapar?",
        a: "İç cephe ve dış cephe boyası, alçı ve saten uygulaması, dekoratif boya, eski boyanın sökülmesi ve yüzey hazırlığı gibi işler yapılır. Her ustanın uzmanlığı profilindeki tanıtımda ve iş geçmişinde yazar.",
      },
      {
        q: "Boyacıya nasıl ulaşırım?",
        a: "Listeden bir profili açıp doğrudan mesaj atarsın. Arada aracı yoktur; iletişim baştan platform üzerinden, sen istersen sonradan telefonla devam eder.",
      },
      {
        q: "Boyacıdan fiyat alabilir miyim?",
        a: "Evet. Mesaj atarken metrekare, oda sayısı ve iç/dış cephe bilgisini verirsen usta sana daha net bir fiyat söyleyebilir.",
      },
      {
        q: "Cevrende komisyon veya üyelik ücreti alıyor mu?",
        a: "Hayır. Profil oluşturmak ve hizmet veren biriyle iletişime geçmek tamamen ücretsizdir, komisyon alınmaz.",
      },
      {
        q: "Hafta sonu veya acil boyacı bulabilir miyim?",
        a: "Müsait ustalar listede önde görünür. Çoğu kişi çalışma saatlerini ve hafta sonu durumunu tanıtımında belirtir; mesaj atarak teyit edebilirsin.",
      },
    ],
  },
  elektrikci: {
    slug: "elektrikci",
    categorySlug: "elektrikci",
    name: "Elektrikçi",
    h1: "Pendik Elektrikçi",
    metaTitle: "Pendik Elektrikçi — Mahallenden Elektrik Ustası",
    metaDescription:
      "Pendik'te arıza, tesisat, aydınlatma ve pano işleri için mahallenden elektrikçi bul. Profilleri incele, doğrudan iletişime geç. Aracısız, ücretsiz.",
    intro:
      "Pendik'te elektrik arızası, yeni tesisat, aydınlatma ya da pano işi için usta mı arıyorsun? Mahallendeki elektrikçileri burada bir arada görür, deneyimlerini inceler ve aracı olmadan doğrudan iletişime geçersin. Elektrik işi güvenlik işidir; deneyimli ve sana yakın bir usta seçmek hem zaman kazandırır hem riski azaltır.",
    guideTitle: "Pendik'te elektrikçi seçerken nelere dikkat etmeli?",
    guidePoints: [
      {
        title: "Arızayı tarif et",
        body: "Sigorta mı atıyor, priz mi çalışmıyor, tamamen mi elektrik yok? Belirtiyi net anlat ki usta doğru ekipmanla gelsin.",
      },
      {
        title: "Deneyimini sor",
        body: "Konut, iş yeri, pano, akıllı ev... Hangi işlerde çalıştığını profildeki iş geçmişinden görebilirsin.",
      },
      {
        title: "Güvenliğe dikkat",
        body: "Topraklama ve kaçak akım rölesi gibi konularda bilgi veren, işini standartlara uygun yapan ustaları tercih et.",
      },
      {
        title: "Yakın mahalleyi seç",
        body: "Acil arızada sana en yakın ustanın gelmesi en hızlı çözümdür.",
      },
      {
        title: "İlk iletişimi platformda yap",
        body: "İlk yazışmayı Cevrende üzerinden başlat; güvenle anlaştıktan sonra telefonla devam edebilirsin.",
      },
    ],
    emptyState:
      "Şu anda Pendik'te müsait elektrikçi görünmüyor. Elektrik işi yapıyorsan ücretsiz profil oluştur, bu sayfada ilk sen görün.",
    faqs: [
      {
        q: "Pendik'te elektrikçiler hangi işleri yapar?",
        a: "Elektrik arızası giderme, yeni tesisat çekme, priz ve anahtar montajı, aydınlatma, sigorta panosu ve kaçak akım rölesi işleri yapılır. Her ustanın uzmanlığı profilindeki tanıtımda yazar.",
      },
      {
        q: "Acil elektrik arızasında nasıl usta bulurum?",
        a: "Listede müsait ve çevrimiçi olan ustalar önde görünür. Profili açıp hemen mesaj atarak durumu anlatabilir, ne zaman gelebileceğini sorabilirsin.",
      },
      {
        q: "Elektrikçiden fiyat sorabilir miyim?",
        a: "Evet. Arızayı veya yapılacak işi mesajda tarif edersen usta sana daha doğru bir fiyat aralığı söyleyebilir.",
      },
      {
        q: "Cevrende ücretli mi?",
        a: "Hayır. Profil oluşturmak ve elektrikçiyle iletişime geçmek ücretsizdir, komisyon alınmaz.",
      },
      {
        q: "Elektrik işinde nelere dikkat etmeliyim?",
        a: "Ustanın deneyimine ve güvenlik yaklaşımına bak: topraklama, kaçak akım koruması ve düzgün malzeme kullanımı önemlidir. Profildeki iş geçmişi ve tanıtım sana fikir verir.",
      },
    ],
  },
};

export const CATEGORY_PAGE_SLUGS = Object.keys(CATEGORY_PAGES);

export function getCategoryPage(slug: string): CategoryPage | null {
  return CATEGORY_PAGES[slug] ?? null;
}

// Türkçe ünlü uyumuna göre "mısın / misin / musun / müsün" soru ekini döndürür.
// Örn: "Boyacı" → "mısın", "Elektrikçi" → "misin", "Şoför" → "müsün".
export function soruEki(word: string): string {
  const vowels = word.toLocaleLowerCase("tr").match(/[aeıioöuü]/g);
  const last = vowels ? vowels[vowels.length - 1] : "i";
  if (last === "a" || last === "ı") return "mısın";
  if (last === "o" || last === "u") return "musun";
  if (last === "ö" || last === "ü") return "müsün";
  return "misin"; // e, i
}
