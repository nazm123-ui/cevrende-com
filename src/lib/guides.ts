// Yerel rehber içerikleri (/rehber/[slug]).
// Elle yazılmış, Pendik'e özgü, gerçekten faydalı evergreen makaleler.
// Uydurma fiyat/istatistik YOK — tavsiye odaklı, dürüst içerik.

export type GuideSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: { title?: string; body: string }[];
};

export type GuideFaq = { q: string; a: string };

export type Guide = {
  slug: string;
  /** Sayfa H1'i / makale başlığı */
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** Liste/kart için kısa özet */
  excerpt: string;
  /** ISO tarih — schema datePublished/dateModified */
  publishedAt: string;
  updatedAt: string;
  /** Giriş paragrafı */
  intro: string;
  sections: GuideSection[];
  faqs: GuideFaq[];
  /** İlgili kategori sayfaları (/pendik/[slug]) — internal linking */
  relatedCategorySlugs: string[];
};

export const GUIDES: Record<string, Guide> = {
  "pendik-boyaci-tutarken-dikkat": {
    slug: "pendik-boyaci-tutarken-dikkat",
    title: "Pendik'te Boyacı Tutarken Nelere Dikkat Etmeli?",
    metaTitle: "Pendik'te Boyacı Tutarken Nelere Dikkat Etmeli? | Rehber",
    metaDescription:
      "Pendik'te ev veya iş yeri boyatmadan önce bilmen gerekenler: fiyatı ne belirler, doğru ustayı nasıl seçersin, anlaşmadan önce neleri netleştirmelisin.",
    excerpt:
      "Boyatmadan önce işi netleştirmek, doğru fiyatı almak ve sorunsuz bir iş için bilmen gereken her şey.",
    publishedAt: "2026-06-10",
    updatedAt: "2026-06-10",
    intro:
      "Evini ya da iş yerini boyatmak ilk bakışta basit görünür; ama yanlış usta ya da belirsiz bir anlaşma, işin yarıda kalmasına veya beklenenden çok daha pahalıya patlamasına yol açabilir. Pendik'te boyacı tutmadan önce işi doğru tanımlar ve birkaç soruyu baştan netleştirirsen hem daha gerçekçi fiyat alır hem de sürprizlerden kaçınırsın. İşte adım adım dikkat etmen gerekenler.",
    sections: [
      {
        heading: "1. İşi baştan netleştir",
        paragraphs: [
          "Bir ustadan doğru fiyat alabilmen için ne istediğini net anlatman gerekir. Tahmini bir 'şu kadar oda' demek yerine ölçülebilir bilgiler ver:",
        ],
        bullets: [
          { title: "Alan", body: "Kaç metrekare ya da kaç oda boyanacak? Salon, koridor ve tavanlar dahil mi?" },
          { title: "Yer", body: "İç cephe mi, dış cephe mi? Dış cephe iskele ve hava koşulu gerektirdiği için ayrı değerlendirilir." },
          { title: "Mevcut durum", body: "Duvarlarda dökülme, rutubet, çatlak ya da eski koyu renk var mı? Bunlar astar ve alçı gerektirebilir." },
        ],
      },
      {
        heading: "2. Fiyatı neler belirler?",
        paragraphs: [
          "Boya işinde tek bir 'standart fiyat' yoktur; toplam tutarı birkaç etken birlikte belirler. Bir ustadan fiyat alırken bunların hangisinin dahil olduğunu sor:",
        ],
        bullets: [
          { title: "Yüzey hazırlığı", body: "Eski boyanın kazınması, çatlak ve deliklerin doldurulması, alçı ve astar işçiliği fiyata büyük etki eder." },
          { title: "Boya kalitesi", body: "Silinebilir, mat, saten ya da dış cephe boyası... Kalite arttıkça malzeme maliyeti de değişir." },
          { title: "Malzeme dahil mi?", body: "İşçilik ve malzeme ayrı mı, yoksa toplam fiyat boyayı da içeriyor mu? Bunu baştan netleştir." },
        ],
      },
      {
        heading: "3. Doğru ustayı nasıl seçersin?",
        paragraphs: [
          "Fiyat tek kriter değildir. Sana yakın, deneyimini gösterebilen bir usta uzun vadede daha iyi sonuç verir.",
        ],
        bullets: [
          { title: "Önceki işleri", body: "Daha önce yaptığı boya işlerinden fotoğraf veya referans iste. Cevrende profilindeki iş geçmişi sana fikir verir." },
          { title: "Mahalle yakınlığı", body: "Sana yakın mahallede çalışan bir usta hem daha hızlı gelir hem ulaşım ek maliyeti çıkmaz." },
          { title: "İletişim", body: "Sorularına net ve sabırlı cevap veren bir usta, işte de aynı özeni gösterir." },
        ],
      },
      {
        heading: "4. Anlaşmadan önce netleştir",
        bullets: [
          { title: "Süre", body: "İş kaç günde biter? Bu süre boyunca evde yaşanabilir mi?" },
          { title: "Koruma ve temizlik", body: "Mobilya ve zeminin korunması, iş bitiminde temizlik dahil mi?" },
          { title: "Ödeme", body: "Ödeme ne zaman ve nasıl yapılacak? Tamamını peşin değil, işin aşamasına göre planlamak daha güvenlidir." },
        ],
      },
      {
        heading: "5. Bu işaretlere dikkat",
        paragraphs: [
          "Bazı durumlar baştan uyarı niteliğindedir. Piyasanın çok altında bir fiyat genelde düşük kalite malzeme ya da eksik yüzey hazırlığı anlamına gelir. İşin tamamı için peşin ödeme ısrarı, yazılı/mesajla teyit edilmemiş belirsiz anlaşmalar ve 'gelince bakarız' diyip net bilgi vermeyen yaklaşımlar konusunda temkinli ol. İlk iletişimi Cevrende üzerinden yapman, konuştuğun her şeyin kayıtlı kalmasını sağlar.",
        ],
      },
    ],
    faqs: [
      {
        q: "Pendik'te boya işi ne kadar sürer?",
        a: "Süre alana ve yüzey durumuna göre değişir. Tek bir odanın boyanması genelde bir günde biterken, bütün bir evin yüzey hazırlığıyla birlikte boyanması birkaç gün sürebilir. Ustaya işin kapsamını anlatıp net süre sorman en doğrusu.",
      },
      {
        q: "Boya ve malzemeyi ben mi almalıyım, usta mı?",
        a: "İkisi de mümkün. Bazı ustalar malzemeyi dahil eder, bazıları sadece işçilik verir. Önemli olan bunu baştan konuşmak; malzeme kimde olacak, hangi marka/kalite kullanılacak netleştir.",
      },
      {
        q: "Boyacıya nasıl ulaşırım?",
        a: "Cevrende'de Pendik boyacılarını listeden inceleyip doğrudan mesaj atabilirsin. Aracı yoktur, komisyon alınmaz; iletişim baştan platform üzerinden ilerler.",
      },
    ],
    relatedCategorySlugs: ["boyaci"],
  },

  "pendik-elektrikci-secimi": {
    slug: "pendik-elektrikci-secimi",
    title: "Pendik'te Elektrikçi Nasıl Seçilir? Güvenli Usta Bulma Rehberi",
    metaTitle: "Pendik'te Elektrikçi Nasıl Seçilir? Güvenli Usta Rehberi",
    metaDescription:
      "Pendik'te elektrik arızası, tesisat veya pano işi için doğru ve güvenli elektrikçiyi nasıl seçersin? Dikkat edilmesi gerekenler ve sorulacak sorular.",
    excerpt:
      "Elektrik işi güvenlik işidir. Doğru ustayı seçmek, riski azaltmak ve sorulması gereken soruların tam listesi.",
    publishedAt: "2026-06-10",
    updatedAt: "2026-06-10",
    intro:
      "Elektrik işi, diğer ev işlerinden farklı olarak doğrudan güvenliği ilgilendirir. Yanlış yapılmış bir tesisat ya da topraklaması olmayan bir hat, ileride yangın veya çarpılma riski taşır. Bu yüzden Pendik'te elektrikçi seçerken sadece fiyata değil, ustanın deneyimine ve işi standartlara uygun yapıp yapmadığına bakmak gerekir. İşte güvenli bir seçim için bilmen gerekenler.",
    sections: [
      {
        heading: "1. Hangi işler için elektrikçi gerekir?",
        paragraphs: [
          "Elektrikçiler geniş bir yelpazede çalışır. İhtiyacını doğru tanımlamak, sana uygun deneyime sahip ustayı bulmanı kolaylaştırır.",
        ],
        bullets: [
          { title: "Arıza", body: "Sigorta atması, prizin çalışmaması, kısmi veya tam elektrik kesintisi." },
          { title: "Tesisat", body: "Yeni hat çekilmesi, priz/anahtar montajı, aydınlatma kurulumu." },
          { title: "Pano ve güvenlik", body: "Sigorta panosu yenileme, kaçak akım rölesi takılması, topraklama." },
        ],
      },
      {
        heading: "2. Güvenlik neden en önemli kriter?",
        paragraphs: [
          "İyi bir elektrikçi sadece 'çalışır hale getiren' değil, 'güvenli hale getiren' kişidir. Bir ustayla konuşurken güvenlik konularına nasıl yaklaştığına dikkat et:",
        ],
        bullets: [
          { title: "Topraklama", body: "Özellikle eski binalarda topraklama hattının olup olmadığını kontrol eden bir usta tercih edilir." },
          { title: "Kaçak akım rölesi", body: "Çarpılma riskine karşı koruma sağlayan bu cihaz hakkında bilgi veren ustalar işini ciddiye alıyor demektir." },
          { title: "Malzeme kalitesi", body: "Standart dışı kablo ve malzeme uzun vadede risk yaratır; ustanın ne kullandığını sor." },
        ],
      },
      {
        heading: "3. Acil arıza mı, planlı iş mi?",
        paragraphs: [
          "İhtiyacın aciliyetine göre yaklaşımın değişir. Tamamen elektriksiz kaldıysan, Cevrende'de müsait ve çevrimiçi görünen ustalara öncelik ver; profili açıp durumu anlatarak ne zaman gelebileceğini sor. Planlı bir tesisat işiyse acele etmeden birkaç usta ile konuşup deneyimlerini karşılaştırman daha sağlıklı olur.",
        ],
      },
      {
        heading: "4. Anlaşmadan önce sorulacaklar",
        bullets: [
          { title: "Deneyim alanı", body: "Konut, iş yeri, pano... Senin ihtiyacına benzer işler yapmış mı? Profildeki iş geçmişine bak." },
          { title: "İşin kapsamı", body: "Sadece arızayı mı giderecek, yoksa kalıcı bir çözüm mü sunacak? İkisi arasındaki farkı sor." },
          { title: "Yakınlık", body: "Acil bir arızada sana en yakın mahalledeki ustanın gelmesi en hızlı çözümdür." },
        ],
      },
    ],
    faqs: [
      {
        q: "Acil elektrik arızasında nasıl hızlı usta bulurum?",
        a: "Cevrende'de listede müsait ve çevrimiçi görünen elektrikçiler önde çıkar. Profili açıp hemen mesaj atarak arızayı anlat ve ne zaman gelebileceğini sor. Sana yakın mahalledeki ustalar daha hızlı ulaşır.",
      },
      {
        q: "Elektrikçiden önce fiyat öğrenebilir miyim?",
        a: "Evet. Arızayı veya yapılacak işi mesajda olabildiğince net tarif edersen usta sana bir fiyat aralığı söyleyebilir. Yine de kesin tutar, yerinde görüldükten sonra netleşebilir.",
      },
      {
        q: "İyi bir elektrikçiyi nasıl anlarım?",
        a: "Güvenliğe verdiği önemden: topraklama, kaçak akım koruması ve düzgün malzeme kullanımı hakkında bilgi veren, sorularına sabırla cevap veren ustalar genelde işini ciddiye alır. Profildeki iş geçmişi de fikir verir.",
      },
    ],
    relatedCategorySlugs: ["elektrikci"],
  },

  "mahalleden-usta-bulmanin-avantajlari": {
    slug: "mahalleden-usta-bulmanin-avantajlari",
    title: "Mahallenden Usta Bulmanın 5 Avantajı",
    metaTitle: "Mahallenden Usta Bulmanın 5 Avantajı (Pendik) | Rehber",
    metaDescription:
      "Pendik'te uzaktaki aracılar yerine mahallenden usta bulmak neden daha mantıklı? Hız, güven, komisyonsuz iletişim ve daha fazlası.",
    excerpt:
      "Uzaktaki aracılar yerine çevrendeki ustayı tercih etmenin somut faydaları.",
    publishedAt: "2026-06-10",
    updatedAt: "2026-06-10",
    intro:
      "Bir usta ararken çoğu kişi ilk olarak büyük arama motorlarına ya da aracı platformlara yönelir; ama çoğu zaman ihtiyacın olan kişi zaten birkaç sokak ötende çalışıyordur. Mahallenden, yani çevrendeki bir ustayla çalışmanın hem pratik hem de güven açısından somut avantajları var. İşte en önemli beşi.",
    sections: [
      {
        heading: "1. Daha hızlı ulaşım",
        paragraphs: [
          "Sana yakın mahallede çalışan bir usta, acil bir arıza ya da hızlı bir iş söz konusu olduğunda çok daha kısa sürede kapına gelir. Şehrin öbür ucundan gelen birini beklemek yerine, çevrendeki kişiyle aynı gün buluşabilirsin.",
        ],
      },
      {
        heading: "2. Komşuluk güveni",
        paragraphs: [
          "Aynı mahallede ya da çevrede yaşayan bir ustayla iş yapmak, iki taraf için de daha şeffaftır. Usta, çevresindeki itibarına önem verir; sen de ona kolayca ulaşabilir, gerekirse sonradan tekrar çağırabilirsin.",
        ],
      },
      {
        heading: "3. Aracısız ve komisyonsuz iletişim",
        paragraphs: [
          "Cevrende'de usta ile doğrudan iletişime geçersin; arada komisyon alan bir aracı yoktur. Bu hem senin için maliyeti düşürür hem de ustanın eline geçen tutarı artırır. İletişim baştan platform üzerinden ilerler, istersen sonradan telefonla devam edersin.",
        ],
      },
      {
        heading: "4. Yerel fiyat anlayışı",
        paragraphs: [
          "Çevrendeki bir usta, mahallenin koşullarını ve gerçekçi fiyat aralığını bilir. Ulaşım için ekstra ücret çıkmaz, iş de yerel beklentilere uygun planlanır.",
        ],
      },
      {
        heading: "5. Kolay ve sürdürülebilir iletişim",
        paragraphs: [
          "İyi bir iş çıkaran bir ustayla bağlantını koruman, bir sonraki ihtiyacında işini çok kolaylaştırır. Çevrendeki bir kişiyle bu bağı kurmak, uzaktaki bir hizmetle kurmaktan çok daha doğal ve kalıcıdır.",
        ],
      },
    ],
    faqs: [
      {
        q: "Cevrende nasıl çalışır?",
        a: "Pendik'te hizmet veren kişiler ücretsiz profil oluşturur; sen de meslek ve mahalleye göre arayıp doğrudan mesaj atarsın. Aracı ve komisyon yoktur, iletişim baştan platform üzerinden ilerler.",
      },
      {
        q: "Mahallenden usta bulmak ücretli mi?",
        a: "Hayır. Hem profil oluşturmak hem de bir ustayla iletişime geçmek tamamen ücretsizdir; komisyon alınmaz.",
      },
      {
        q: "Çevremde hangi meslekleri bulabilirim?",
        a: "Boyacı, elektrikçi, tesisatçı, tadilat ustası, nakliye, garson ve daha pek çok meslek. Çevrendekiler sayfasından meslek ve mahalleye göre filtreleyebilirsin.",
      },
    ],
    relatedCategorySlugs: ["boyaci", "elektrikci"],
  },
};

export const GUIDE_SLUGS = Object.keys(GUIDES);

export function getGuide(slug: string): Guide | null {
  return GUIDES[slug] ?? null;
}

/** Index/listeleme için en yeni önce sıralı liste */
export function getAllGuides(): Guide[] {
  return GUIDE_SLUGS.map((s) => GUIDES[s]).sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
  );
}

/** Belirli bir kategori sayfasıyla (/pendik/[slug]) ilgili rehberler */
export function getGuidesForCategory(categorySlug: string): Guide[] {
  return getAllGuides().filter((g) =>
    g.relatedCategorySlugs.includes(categorySlug),
  );
}

export function formatGuideDate(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
