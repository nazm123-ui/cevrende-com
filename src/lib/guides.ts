// Yerel rehber içerikleri (/rehber/[slug]).
// Elle yazılmış, Pendik'e özgü, gerçekten faydalı evergreen makaleler.
// Uydurma fiyat/istatistik YOK — tavsiye odaklı, dürüst içerik.

export type GuideIcon = "camera" | "wave" | "thermometer" | "shield" | "wrench";

export type GuideBullet = { title?: string; body: string; icon?: GuideIcon };

export type GuideSection = {
  heading: string;
  /**
   * Bölüm görsel düzeni:
   * - "prose" (varsayılan): paragraf + kart maddeler
   * - "steps": numaralı adımlar
   * - "checklist": yeşil tikli kontrol listesi (açık kutu)
   * - "features": ikonlu özellik kartları
   */
  layout?: "prose" | "steps" | "checklist" | "features";
  paragraphs?: string[];
  bullets?: GuideBullet[];
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
  /** Sol menü gruplaması — TOPICS anahtarı */
  topic: GuideTopicSlug;
  /** Kapak görseli (R2 URL). Yoksa konuya göre degrade placeholder gösterilir. */
  coverImage?: string | null;
};

// Rehber konuları — liste sayfasındaki sol menü ve kart rozetleri için.
// Görsel yüklenene kadar her konu için sade bir degrade placeholder kullanılır.
export type GuideTopicSlug =
  | "tadilat-insaat"
  | "tesisat-onarim"
  | "guvenlik-kilit"
  | "boya-badana"
  | "elektrik"
  | "genel";

export type GuideTopic = {
  slug: GuideTopicSlug;
  label: string;
  /** Placeholder degrade renkleri (hex) */
  from: string;
  to: string;
};

export const GUIDE_TOPICS: Record<GuideTopicSlug, GuideTopic> = {
  "tadilat-insaat": { slug: "tadilat-insaat", label: "Tadilat & İnşaat", from: "#9a8866", to: "#6f5f44" },
  "tesisat-onarim": { slug: "tesisat-onarim", label: "Tesisat & Onarım", from: "#6b8aa6", to: "#3f5d77" },
  "guvenlik-kilit": { slug: "guvenlik-kilit", label: "Güvenlik & Kilit", from: "#6e7378", to: "#41464b" },
  "boya-badana": { slug: "boya-badana", label: "Boya & Badana", from: "#7fa07f", to: "#4f6f4f" },
  elektrik: { slug: "elektrik", label: "Elektrik", from: "#b8a05a", to: "#8a7330" },
  genel: { slug: "genel", label: "Genel", from: "#8f9aa0", to: "#5d6870" },
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
    topic: "boya-badana",
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
    topic: "elektrik",
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
    topic: "genel",
  },

  "pendik-su-kacagi-tikaniklik": {
    slug: "pendik-su-kacagi-tikaniklik",
    title: "Su Kaçağı veya Tıkanıklıkta Ne Yapmalı? (Pendik)",
    metaTitle: "Su Kaçağı / Tıkanıklıkta Ne Yapmalı? — Pendik Rehberi",
    metaDescription:
      "Pendik'te su kaçağı veya gider tıkanıklığında ilk anda ne yapmalı, ne zaman tesisatçı çağırmalı? Hasarı azaltmanın pratik yolları.",
    excerpt:
      "Su kaçağı veya tıkanıklıkta panik yapmadan hasarı azaltmanın ve doğru tesisatçıyı bulmanın yolu.",
    publishedAt: "2026-06-13",
    updatedAt: "2026-06-13",
    intro:
      "Su kaçağı ve tıkanıklık, ev sahiplerinin en sık karşılaştığı acil durumlardandır ve hızlı davranmak hasarı ciddi şekilde azaltır. İlk birkaç dakikada doğru adımları atmak, hem evini hem de cebini korur. İşte Pendik'te bu durumlarda yapman gerekenler.",
    sections: [
      {
        heading: "Su kaçağında ilk müdahale adımları",
        layout: "steps",
        paragraphs: [
          "Su kaçağında ilk dakikalar hasarın boyutunu belirler. Panik yapmadan şu adımları sırayla uygula:",
        ],
        bullets: [
          { title: "Ana vanayı kapat", body: "Evdeki su akışını durdurmak hasarı anında azaltır. Ana vananın yerini önceden öğrenmek, o an için zaman kazandırır." },
          { title: "Elektrik bağlantısını kes", body: "Su; priz, kablo veya elektrikli cihaza ulaşıyorsa o bölgenin sigortasını indir." },
          { title: "Suyu topla ve not al", body: "Havlu veya kovayla yayılmayı engelle, alt komşuya sızmasını önle; mümkünse kaçağın yerini fotoğrafla." },
        ],
      },
      {
        heading: "Gizli su kaçağının belirtileri",
        layout: "checklist",
        paragraphs: [
          "Bazı kaçaklar hemen kendini belli etmez. Aşağıdakilerden birini yaşıyorsan bir tesisatçıya danışmakta fayda var:",
        ],
        bullets: [
          { body: "Su faturasında beklenmedik artış" },
          { body: "Duvarda küf, kabarma veya rutubet kokusu" },
          { body: "Parke veya zeminde kabarma, nemlenme" },
          { body: "Tüm musluklar kapalıyken dönmeye devam eden sayaç" },
        ],
      },
      {
        heading: "Tıkanıklıkta ne yapmalı?",
        paragraphs: [
          "Lavabo veya giderdeki basit tıkanıklıklar bazen pompayla (lastik pompa) açılır. Ancak kimyasal açıcıları aşırı kullanmak boruya zarar verebilir. Tekrar eden, birden fazla gideri etkileyen ya da ana hatta inen tıkanıklıklarda makineyle açım gerekir; bu noktada tesisatçı çağırmak en doğrusu.",
        ],
      },
      {
        heading: "Kırmadan kaçak tespiti: modern yöntemler",
        layout: "features",
        paragraphs: [
          "Görünmeyen kaçaklarda artık duvarı baştan sona kırmaya gerek yok. Deneyimli tesisatçılar noktasal tespit için şu yöntemleri kullanır:",
        ],
        bullets: [
          { icon: "camera", title: "Kameralı görüntüleme", body: "Gider ve tesisat hattına sokulan robotik kamerayla tıkanıklık veya çatlağın yeri görüntülenir." },
          { icon: "wave", title: "Akustik dinleme", body: "Duvar arkasındaki kaçağın sesi hassas dinleme cihazıyla tespit edilir." },
          { icon: "thermometer", title: "Termal kamera", body: "Sıcak su hattındaki kaçaklar ısı farkından termal kamerayla bulunur." },
        ],
      },
      {
        heading: "Doğru tesisatçıyı seçmek",
        paragraphs: [
          "Tesisat acil olduğunda sana en yakın, müsait ustayı seçmek en hızlı çözümdür. Sorunu net tarif et (nerede, ne zamandır, ne sıklıkta), değişecek parçanın fiyata dahil olup olmadığını ve yapılan işe garanti verilip verilmediğini baştan sor.",
        ],
      },
    ],
    faqs: [
      {
        q: "Su kaçağında ilk önce ne yapmalıyım?",
        a: "Ana su vanasını kapat. Bu, usta gelene kadar hasarın büyümesini önleyen en etkili adımdır. Su elektriğe ulaşıyorsa ilgili sigortayı da indir.",
      },
      {
        q: "Tıkanıklığı kendim açabilir miyim?",
        a: "Basit lavabo tıkanıklıkları pompayla açılabilir. Ama tekrar eden, çoklu veya ana hatta inen tıkanıklıklarda kimyasalla uğraşmak yerine makineyle açım yapan bir tesisatçı çağır.",
      },
      {
        q: "Kaçak nereden geldiğini bulamıyorum, ne yapmalıyım?",
        a: "Görünmeyen kaçaklarda 'kırmadan kaçak tespiti' yapabilen bir tesisatçı, gereksiz kırım masrafından kurtarır. Profilde bu deneyimi sorabilirsin.",
      },
    ],
    relatedCategorySlugs: ["tesisatci"],
    topic: "tesisat-onarim",
  },

  "pendik-tadilat-dikkat": {
    slug: "pendik-tadilat-dikkat",
    title: "Pendik'te Tadilat Yaptırırken Dikkat Edilmesi Gerekenler",
    metaTitle: "Pendik'te Tadilat Yaptırırken Dikkat Edilecekler",
    metaDescription:
      "Pendik'te ev tadilatına başlamadan önce: kapsamı belirleme, malzeme, süre, ödeme planı ve sık yapılan hatalar. Sorunsuz tadilat rehberi.",
    excerpt:
      "Tadilata başlamadan kapsamı, bütçeyi ve ödeme planını netleştirmenin yolu — sürprizleri önle.",
    publishedAt: "2026-06-13",
    updatedAt: "2026-06-13",
    intro:
      "Tadilat, birden çok işin (kırım, alçı, fayans, boya, elektrik-su) bir araya geldiği ve kolayca bütçe aşımına yol açabilen bir süreçtir. İyi planlanmış bir tadilat ise hem zamanında biter hem de beklenenden pahalıya patlamaz. Pendik'te tadilata başlamadan önce şunlara dikkat et.",
    sections: [
      {
        heading: "1. Önce kapsamı netleştir",
        paragraphs: [
          "En sık yapılan hata, işi belirsiz bırakmaktır. 'Banyoyu yenileyelim' yerine; hangi işlerin yapılacağını (fayans sökümü, su tesisatı, alçı, boya, dolap) tek tek listele. Ne kadar net olursan, ustadan o kadar gerçekçi fiyat ve süre alırsın.",
        ],
      },
      {
        heading: "2. Maliyeti belirleyen kalemler",
        bullets: [
          { title: "Malzeme kimde?", body: "Fayans, boya ve malzemeyi sen mi alacaksın yoksa usta mı? Bu, toplam maliyeti en çok etkileyen konudur." },
          { title: "Kırım ve hafriyat", body: "Eski yapının sökümü ve molozun taşınması ayrı bir kalemdir; fiyata dahil mi sor." },
          { title: "Gizli işler", body: "Su/elektrik hatları, su yalıtımı gibi görünmeyen ama kritik işleri atlama; sonradan açmak çok daha pahalıdır." },
        ],
      },
      {
        heading: "3. Süre ve yaşam düzeni",
        paragraphs: [
          "Tadilat sırasında evde yaşanıp yaşanamayacağını baştan konuş. Toz, gürültü ve susuz/elektriksiz kalınacak günler olabilir. Ustadan aşamalı bir takvim istemek, sürecin kontrolünü sende tutar.",
        ],
      },
      {
        heading: "4. Ödemeyi aşamalara böl",
        paragraphs: [
          "Tadilat uzun sürdüğü için ödemenin tamamını peşin vermek risklidir. İşi aşamalara bölüp (ör. kırım sonrası, kaba iş sonrası, teslimde) ödeme yapmak iki taraf için de güvenlidir. Konuşulanları mesajla yazılı tutmak ileride anlaşmazlığı önler.",
        ],
      },
    ],
    faqs: [
      {
        q: "Tadilatta en sık yapılan hata nedir?",
        a: "İşin kapsamını belirsiz bırakmak. Hangi işlerin yapılacağını net listelemezsen hem fiyat tahmini yanlış olur hem de süreçte sürekli ek maliyet çıkar.",
      },
      {
        q: "Malzemeyi ben mi almalıyım usta mı?",
        a: "İkisi de olur. Önemli olan baştan netleştirmek: malzeme kimde olacak, hangi kalite kullanılacak ve bu fiyata dahil mi? Bu konu toplam maliyeti en çok etkileyen kalemdir.",
      },
      {
        q: "Ödemeyi nasıl planlamalıyım?",
        a: "Tamamını peşin vermek yerine işi aşamalara bölüp her aşama sonunda ödemek daha güvenlidir. Anlaşmayı mesajla yazılı tutmanı öneririz.",
      },
    ],
    relatedCategorySlugs: ["tadilat"],
    topic: "tadilat-insaat",
  },

  "kapida-kalinca-cilingir": {
    slug: "kapida-kalinca-cilingir",
    title: "Kapıda mı Kaldınız? Çilingir Çağırmadan Önce Bilinmesi Gerekenler",
    metaTitle: "Kapıda Kalınca Ne Yapmalı? — Pendik Çilingir Rehberi",
    metaDescription:
      "Pendik'te kapıda kaldığında ya da anahtarını kaybettiğinde ne yapmalı? Hasarsız kapı açma, güvenlik ve doğru çilingir seçimi.",
    excerpt:
      "Kapıda kaldığında panik yapmadan, hasarsız ve güvenli şekilde çözmenin yolu.",
    publishedAt: "2026-06-13",
    updatedAt: "2026-06-13",
    intro:
      "Kapıda kalmak ya da anahtarını kaybetmek can sıkıcıdır, ama doğru adımlarla hızlı ve hasarsız çözülebilir. Önemli olan paniğe kapılıp kapıyı zorlamamak ve güvenilir bir çilingire ulaşmak. İşte Pendik'te kapıda kaldığında bilmen gerekenler.",
    sections: [
      {
        heading: "Önce sakin ol, kapıyı zorlama",
        paragraphs: [
          "Kapıyı tekmelemek veya tornavidayla zorlamak çoğu zaman kilidi ve kasayı kalıcı olarak bozar; sonuçta hem açtırma hem de tamir masrafı çıkar. Deneyimli bir çilingir, çoğu kapıyı çok daha kısa sürede ve hasarsız açar.",
        ],
      },
      {
        heading: "Çilingire ne söylemelisin?",
        bullets: [
          { title: "Kapı tipi", body: "Çelik kapı mı, ahşap mı? Çelik kapılar farklı teknik gerektirir." },
          { title: "Durum", body: "İçeride anahtar takılı mı, kilit kırık mı, yoksa sadece anahtar mı yok? Bunu söylersen usta doğru aletle gelir." },
          { title: "Konum", body: "Açık adresini ve kat bilgisini ver; en yakın çilingirin gelmesi en hızlısıdır." },
        ],
      },
      {
        heading: "Güvenlik: ne zaman kilit yeniletmeli?",
        paragraphs: [
          "Anahtarını kaybettiysen veya yeni bir eve taşındıysan, kapıyı açtırmakla yetinme; kilit göbeğini (barel) yeniletmek güvenliğin için önemlidir. Eski anahtarların kimde olduğunu bilemezsin. Çilingire bu seçeneği de sor.",
        ],
      },
    ],
    faqs: [
      {
        q: "Kapıda kaldım, kapıyı kendim açmaya çalışmalı mıyım?",
        a: "Hayır. Zorlamak genelde kilidi ve kasayı bozar, masrafı artırır. Sana en yakın müsait çilingire ulaşıp kapı tipini ve durumu anlatman en hızlı ve hasarsız çözümdür.",
      },
      {
        q: "Çilingir kapıyı hasarsız açabilir mi?",
        a: "Çoğu durumda evet. Kapı tipini (çelik/ahşap) ve durumu önceden söylersen usta uygun yöntemle, mümkün olduğunca hasarsız açar.",
      },
      {
        q: "Anahtarımı kaybettim, sadece açtırmak yeterli mi?",
        a: "Güvenlik için kilit göbeğini (barel) yeniletmen önerilir; eski anahtarların kimde olduğunu bilemezsin. Çilingirden bu seçeneği iste.",
      },
    ],
    relatedCategorySlugs: ["cilingir"],
    topic: "guvenlik-kilit",
  },

  "kombi-bakimi-ne-zaman": {
    slug: "kombi-bakimi-ne-zaman",
    title: "Kombi Bakımı Ne Zaman ve Neden Yapılmalı?",
    metaTitle: "Kombi Bakımı Ne Zaman Yapılmalı? — Pendik Rehberi",
    metaDescription:
      "Kombi bakımı ne sıklıkla yapılmalı, hangi belirtiler arıza habercisi? Pendik'te güvenli ve verimli kombi kullanımı için pratik rehber.",
    excerpt:
      "Yıllık kombi bakımının neden önemli olduğu, belirtiler ve doğru zamanlama.",
    publishedAt: "2026-06-13",
    updatedAt: "2026-06-13",
    intro:
      "Kombi, evin hem ısınmasını hem sıcak suyunu sağlayan kritik bir cihazdır; düzenli bakım hem güvenliğin hem de faturanın için önemlidir. Bakımsız bir kombi daha çok yakıt tüketir ve kışın en kötü zamanda arızalanabilir. İşte kombi bakımı hakkında bilmen gerekenler.",
    sections: [
      {
        heading: "Ne sıklıkla bakım yapılmalı?",
        paragraphs: [
          "Kombilerde genellikle yılda bir kez bakım önerilir. En uygun zaman, yoğun kullanımın başlamasından önce, yani sonbahardır. Kış ortasında arızayla uğraşmak yerine sezon öncesi kontrol, hem güvenli hem ekonomiktir.",
        ],
      },
      {
        heading: "Bakımda neler yapılır?",
        bullets: [
          { title: "Temizlik", body: "Eşanjör ve brülör temizliği, verimi artırır ve yakıt tüketimini düşürür." },
          { title: "Basınç ve ayar", body: "Su basıncı, gaz ayarı ve yanma kontrolü yapılır." },
          { title: "Güvenlik kontrolü", body: "Baca/atık gaz tahliyesi ve sızdırmazlık kontrolü, karbonmonoksit riskine karşı önemlidir." },
        ],
      },
      {
        heading: "Bu belirtilere dikkat",
        bullets: [
          { title: "Basınç düşmesi", body: "Sık sık su eklemek zorunda kalıyorsan bir kaçak veya arıza olabilir." },
          { title: "Sesli çalışma", body: "Anormal ses, kireçlenme veya pompada sorun işareti olabilir." },
          { title: "Isınmada düzensizlik", body: "Petekler eşit ısınmıyor veya sıcak su gelmiyorsa bakım/onarım gerekir." },
        ],
      },
    ],
    faqs: [
      {
        q: "Kombi bakımı ne zaman yapılmalı?",
        a: "Genellikle yılda bir kez, ideal olarak yoğun kullanımdan önce sonbaharda. Sezon öncesi kontrol, kış ortasında arıza yaşama riskini azaltır.",
      },
      {
        q: "Bakım yaptırmazsam ne olur?",
        a: "Bakımsız kombi daha çok yakıt tüketir, verimi düşer ve arıza riski artar. Ayrıca baca/yanma sorunları güvenlik açısından risk oluşturabilir.",
      },
      {
        q: "Pendik'te kombi ustasına nasıl ulaşırım?",
        a: "Çevrendekiler sayfasından kombi tamiri/bakımı yapan kişileri bulup doğrudan mesaj atabilirsin. Aracı ve komisyon yoktur.",
      },
    ],
    relatedCategorySlugs: [],
    topic: "tesisat-onarim",
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

/** Liste sayfası sol menüsü için: yalnızca rehberi olan konular + gerçek sayıları. */
export function getTopicsWithCounts(): { topic: GuideTopic; count: number }[] {
  const counts = new Map<GuideTopicSlug, number>();
  for (const g of getAllGuides()) {
    counts.set(g.topic, (counts.get(g.topic) ?? 0) + 1);
  }
  return (Object.keys(GUIDE_TOPICS) as GuideTopicSlug[])
    .filter((slug) => counts.has(slug))
    .map((slug) => ({ topic: GUIDE_TOPICS[slug], count: counts.get(slug)! }));
}

export function formatGuideDate(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
