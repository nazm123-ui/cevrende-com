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

  tesisatci: {
    slug: "tesisatci",
    categorySlug: "tesisatci",
    name: "Tesisatçı",
    h1: "Pendik Tesisatçı / Su Tesisatçısı",
    metaTitle: "Pendik Tesisatçı — Su Tesisatçısı, Tıkanıklık, Kaçak",
    metaDescription:
      "Pendik'te su kaçağı, tıkanıklık, musluk-batarya ve tesisat işleri için mahallenden tesisatçı bul. Profilleri incele, doğrudan mesajla. Aracısız.",
    intro:
      "Su kaçağı, tıkanan gider, damlayan musluk ya da yeni tesisat... Pendik'te su tesisatı işleri için mahallendeki ustaları burada bir arada bulursun. Tesisat çoğu zaman acele gerektirir; sana yakın bir usta hem hızlı gelir hem de küçük bir sorunun büyümesini önler. Profilleri inceleyip aracı olmadan doğrudan mesaj atarsın.",
    guideTitle: "Pendik'te tesisatçı çağırırken nelere dikkat etmeli?",
    guidePoints: [
      {
        title: "Sorunu net anlat",
        body: "Su mu akıyor, gider mi tıkalı, basınç mı düşük? Belirtiyi ve nerede olduğunu (mutfak, banyo, kombi hattı) söyle ki usta doğru ekipmanla gelsin.",
      },
      {
        title: "Acil mi, planlı mı?",
        body: "Aktif su kaçağında müsait ve çevrimiçi ustaya öncelik ver; ana vanayı kapatıp hemen mesaj at. Yeni tesisat gibi planlı işlerde acele etme, karşılaştır.",
      },
      {
        title: "Kaçak tespiti ayrı bir uzmanlık",
        body: "Görünmeyen su kaçaklarında 'kırmadan kaçak tespiti' yapabilen usta, gereksiz kırım masrafından kurtarır. Profilde bu deneyimi sor.",
      },
      {
        title: "Malzeme ve garanti",
        body: "Değişecek parça (batarya, conta, boru) fiyata dahil mi, işçilik ayrı mı? Yapılan işe garanti veriliyor mu, baştan konuş.",
      },
    ],
    emptyState:
      "Şu anda Pendik'te müsait tesisatçı görünmüyor. Tesisat işi yapıyorsan ücretsiz profil oluştur, bu sayfada ilk sen görün.",
    faqs: [
      {
        q: "Su kaçağında ne yapmalıyım?",
        a: "Önce ana su vanasını kapat, ardından müsait bir tesisatçıya mesaj atıp durumu anlat. Vanayı kapatmak, usta gelene kadar hasarın büyümesini önler.",
      },
      {
        q: "Tıkanıklık için tesisatçı mı çağırmalıyım?",
        a: "Basit bir tıkanıklık bazen pompayla açılır; ama tekrar eden veya ana gidere inen tıkanıklıklarda makineyle açım gerekir. Tesisatçıya tıkanıklığın yerini ve ne sıklıkta olduğunu anlat.",
      },
      {
        q: "Tesisatçıdan fiyat alabilir miyim?",
        a: "Evet. Sorunu mesajda tarif edersen bir fiyat aralığı söyleyebilir; kesin tutar genelde yerinde görüldükten sonra netleşir.",
      },
      {
        q: "Cevrende ücretli mi?",
        a: "Hayır. Profil oluşturmak ve tesisatçıyla iletişime geçmek ücretsizdir, komisyon alınmaz.",
      },
    ],
  },

  tadilat: {
    slug: "tadilat",
    categorySlug: "insaat-tadilat",
    name: "Tadilat Ustası",
    h1: "Pendik Tadilat ve İnşaat Yardımı",
    metaTitle: "Pendik Tadilat — Ev Tadilatı ve İnşaat Ustası Bul",
    metaDescription:
      "Pendik'te ev tadilatı, alçı, fayans, boya ve genel inşaat işleri için mahallenden usta bul. Profilleri incele, doğrudan iletişime geç. Aracısız.",
    intro:
      "Evini yenilemek, banyo-mutfak değiştirmek ya da küçük onarımlar mı istiyorsun? Pendik'te tadilat ve inşaat işleri yapan ustaları burada bulursun. Tadilat birden fazla işi (kırım, alçı, fayans, boya, elektrik-su) kapsayabilir; işi baştan netleştirmek hem bütçeni korur hem süreci hızlandırır.",
    guideTitle: "Pendik'te tadilat yaptırırken nelere dikkat etmeli?",
    guidePoints: [
      {
        title: "Kapsamı yaz",
        body: "Hangi odalar, hangi işler? Sadece boya mı, yoksa fayans-alçı-tesisat dahil komple mi? Liste ne kadar net olursa fiyat o kadar gerçekçi olur.",
      },
      {
        title: "Tek usta mı, ekip mi?",
        body: "Küçük işler tek ustayla, komple tadilat genelde ekiple yürür. Ustaya işin büyüklüğünü söyle; gerekirse başka kalemleri de o yönlendirir.",
      },
      {
        title: "Malzeme kimde?",
        body: "Fayans, boya, malzeme alımı sana mı ait, ustaya mı? Bu, toplam maliyeti en çok etkileyen konu — baştan netleştir.",
      },
      {
        title: "Aşamalı ödeme",
        body: "Tadilat uzun sürebilir; ödemeyi işin aşamalarına bölmek iki taraf için de güvenlidir. Tamamını peşin verme.",
      },
    ],
    emptyState:
      "Şu anda Pendik'te müsait tadilat ustası görünmüyor. Tadilat/inşaat işi yapıyorsan ücretsiz profil oluştur, bu sayfada ilk sen görün.",
    faqs: [
      {
        q: "Tadilat ne kadar sürer?",
        a: "İşin kapsamına bağlı. Tek bir odanın boya-onarımı birkaç gün sürerken, banyo-mutfak dahil komple tadilat haftalar alabilir. Ustaya kapsamı anlatıp net süre iste.",
      },
      {
        q: "Tadilat için tek ustaya mı ulaşmalıyım?",
        a: "Küçük işler için tek usta yeterli. Komple tadilatta usta genelde gereken diğer kişileri (fayansçı, boyacı, tesisatçı) yönlendirir ya da ekibiyle gelir.",
      },
      {
        q: "Maliyeti baştan öğrenebilir miyim?",
        a: "Yapılacak işleri net listelersen usta bir tahmin verebilir. Kesin tutar genelde yerinde görüldükten ve malzeme seçimi netleştikten sonra çıkar.",
      },
      {
        q: "Cevrende komisyon alıyor mu?",
        a: "Hayır. Ustaya ulaşmak da profil açmak da ücretsizdir; komisyon yoktur.",
      },
    ],
  },

  cilingir: {
    slug: "cilingir",
    categorySlug: "cilingir",
    name: "Çilingir",
    h1: "Pendik Çilingir",
    metaTitle: "Pendik Çilingir — Kapı Açma ve Kilit Değişimi",
    metaDescription:
      "Pendik'te kapıda kaldıysan veya kilit değişimi gerekiyorsa mahallenden çilingir bul. Sana en yakın ustaya doğrudan, aracısız ulaş.",
    intro:
      "Kapıda mı kaldın, anahtarını mı kaybettin, kilidini mi yeniletmek istiyorsun? Pendik'te çilingirler genelde acil durumlarda aranır; bu yüzden sana en yakın ve müsait olanı bulmak en hızlı çözümdür. Mahallendeki çilingirleri burada görür, doğrudan iletişime geçersin.",
    guideTitle: "Pendik'te çilingir çağırırken nelere dikkat etmeli?",
    guidePoints: [
      {
        title: "Yakınlık her şeydir",
        body: "Acil bir durumda en hızlı çözüm, sana en yakın mahalledeki çilingirdir. Müsait ve çevrimiçi olanı seç.",
      },
      {
        title: "Durumu net söyle",
        body: "Kapı çelik mi ahşap mı, içeride anahtar var mı, kilit kırık mı? Çilingir doğru aletle gelirse hem hızlı hem hasarsız açar.",
      },
      {
        title: "Fiyatı önceden sor",
        body: "Gece/gündüz ve kapı tipine göre ücret değişir. Yola çıkmadan tahmini fiyatı konuşmak sürprizi önler.",
      },
      {
        title: "Güvenlik için kilit yenileme",
        body: "Anahtar kaybında veya taşınmada kilidi/barel'i yenilemek mantıklıdır; çilingire bu seçeneği de sor.",
      },
    ],
    emptyState:
      "Şu anda Pendik'te müsait çilingir görünmüyor. Çilingirsen ücretsiz profil oluştur, acil arayanlar sana doğrudan ulaşsın.",
    faqs: [
      {
        q: "Kapıda kaldım, en hızlı nasıl çilingir bulurum?",
        a: "Listede müsait ve çevrimiçi, sana en yakın mahalledeki çilingiri seç ve hemen mesaj at. Yakınlık, gelme süresini doğrudan kısaltır.",
      },
      {
        q: "Çilingir kapıyı hasarsız açar mı?",
        a: "Çoğu durumda evet. Kapı tipini ve durumunu (içeride anahtar var mı, kilit kırık mı) baştan söylersen usta doğru yöntemle, mümkün olduğunca hasarsız açar.",
      },
      {
        q: "Çilingir ücreti ne kadar?",
        a: "Kapı tipine ve saate (gece/gündüz) göre değişir. Yola çıkmadan mesajla tahmini ücreti sormak en doğrusu.",
      },
      {
        q: "Cevrende ücretli mi?",
        a: "Hayır. Çilingire ulaşmak ve profil açmak ücretsizdir, komisyon alınmaz.",
      },
    ],
  },

  marangoz: {
    slug: "marangoz",
    categorySlug: "marangoz",
    name: "Marangoz",
    h1: "Pendik Marangoz / Mobilya Ustası",
    metaTitle: "Pendik Marangoz — Mobilya Tamiri ve Ahşap İşleri",
    metaDescription:
      "Pendik'te mobilya tamiri, dolap-raf montajı, kapı ayarı ve ahşap işleri için mahallenden marangoz bul. Doğrudan, aracısız iletişim.",
    intro:
      "Açılmayan dolap kapağı, sökülen mobilya, ölçüye özel raf ya da ahşap onarımı... Pendik'te marangoz ve mobilya ustalarını burada bulursun. İster küçük bir tamir ister sıfırdan üretim olsun, mahallendeki ustaya doğrudan ulaşır, işini anlatıp anlaşırsın.",
    guideTitle: "Pendik'te marangoz seçerken nelere dikkat etmeli?",
    guidePoints: [
      {
        title: "İşin türünü belirt",
        body: "Tamir mi (kapak, menteşe, çekmece), montaj mı, yoksa ölçüye özel üretim mi? Marangozların uzmanlığı farklıdır; ihtiyacını net söyle.",
      },
      {
        title: "Fotoğraf gönder",
        body: "Tamir veya üretim işinde mevcut durumun fotoğrafı, ustanın hızlı ve doğru fikir vermesini sağlar.",
      },
      {
        title: "Malzeme ve ölçü",
        body: "Üretim işlerinde malzeme (sunta, MDF, masif) ve ölçüleri netleştir; fiyat buna göre değişir.",
      },
      {
        title: "Yerinde mi, atölyede mi?",
        body: "Bazı işler evde yapılır, bazıları atölyede. Mobilyanın taşınması gerekiyorsa bunu baştan konuş.",
      },
    ],
    emptyState:
      "Şu anda Pendik'te müsait marangoz görünmüyor. Marangoz/mobilya ustasıysan ücretsiz profil oluştur, bu sayfada ilk sen görün.",
    faqs: [
      {
        q: "Marangozlar hangi işleri yapar?",
        a: "Mobilya tamiri, dolap-raf montajı, kapı ve menteşe ayarı, ölçüye özel ahşap üretim ve çeşitli ahşap onarımları. Her ustanın ağırlık verdiği alan profilinde yazar.",
      },
      {
        q: "Küçük bir tamir için de marangoz çağırabilir miyim?",
        a: "Tabii. Menteşe, çekmece rayı, gevşeyen birleşim gibi küçük işler için de ulaşabilirsin. Durumu fotoğrafla anlatman işi kolaylaştırır.",
      },
      {
        q: "Fiyatı önceden öğrenebilir miyim?",
        a: "İşi ve mümkünse fotoğrafı paylaşırsan usta tahmini bir fiyat verebilir. Üretim işlerinde ölçü ve malzeme netleşince kesinleşir.",
      },
      {
        q: "Cevrende ücretli mi?",
        a: "Hayır. Ustaya ulaşmak ve profil açmak ücretsizdir, komisyon yoktur.",
      },
    ],
  },

  demirci: {
    slug: "demirci",
    categorySlug: "demirci-kaynakci",
    name: "Demirci",
    h1: "Pendik Demirci / Kaynakçı / Korkuluk",
    metaTitle: "Pendik Demirci — Kaynakçı, Korkuluk ve Ferforje",
    metaDescription:
      "Pendik'te korkuluk, ferforje, demir kapı, kaynak ve metal işleri için mahallenden demirci-kaynakçı bul. Doğrudan, aracısız iletişim.",
    intro:
      "Balkon korkuluğu, ferforje, demir kapı, çelik raf ya da bir kaynak işi... Pendik'te demirci ve kaynakçıları burada bulursun. Metal işleri çoğu zaman ölçüye özel üretilir; işini net anlatıp mahallendeki ustaya doğrudan ulaşarak doğru fiyatı alırsın.",
    guideTitle: "Pendik'te demirci/kaynakçı seçerken nelere dikkat etmeli?",
    guidePoints: [
      {
        title: "İşi ve ölçüyü belirt",
        body: "Korkuluk, kapı, kafes, tamir kaynağı... Ne istediğini ve yaklaşık ölçüleri söyle. Metal işleri ölçüye göre üretildiği için fiyat buna bağlıdır.",
      },
      {
        title: "Yerinde ölçü önemli",
        body: "Korkuluk/kapı gibi işlerde ustanın yerinde ölçü alması en doğru sonucu verir. Montaj dahil mi, ayrıca sor.",
      },
      {
        title: "Malzeme ve kaplama",
        body: "Demir mi paslanmaz mı, boyalı mı galvaniz mi? Kaplama/boya hem fiyatı hem ömrü etkiler; baştan konuş.",
      },
      {
        title: "Önceki işleri gör",
        body: "Ferforje gibi görsel işlerde ustanın daha önce yaptıklarından fotoğraf istemek beklentini netleştirir.",
      },
    ],
    emptyState:
      "Şu anda Pendik'te müsait demirci/kaynakçı görünmüyor. Bu işi yapıyorsan ücretsiz profil oluştur, bu sayfada ilk sen görün.",
    faqs: [
      {
        q: "Demirciler hangi işleri yapar?",
        a: "Balkon ve merdiven korkuluğu, ferforje, demir/çelik kapı, kafes, raf ve çeşitli kaynak-tamir işleri. Her ustanın uzmanlığı profilinde belirtilir.",
      },
      {
        q: "Korkuluk için fiyatı nasıl alırım?",
        a: "Yaklaşık ölçü ve istediğin modeli (düz, ferforje vb.) anlat; usta tahmini fiyat verir. Kesin fiyat genelde yerinde ölçü sonrası netleşir.",
      },
      {
        q: "Montaj fiyata dahil mi?",
        a: "Ustaya göre değişir. Üretim ve montajın ayrı mı birlikte mi fiyatlandığını baştan netleştir.",
      },
      {
        q: "Cevrende ücretli mi?",
        a: "Hayır. Ustaya ulaşmak ve profil açmak ücretsizdir, komisyon alınmaz.",
      },
    ],
  },

  cekici: {
    slug: "cekici",
    categorySlug: "cekici-yol-yardim",
    name: "Çekici / Yol Yardım",
    h1: "Pendik Çekici / Yol Yardım",
    metaTitle: "Pendik Çekici — Oto Çekici ve Yol Yardım",
    metaDescription:
      "Pendik'te yolda kaldıysan oto çekici ve yol yardım için mahallenden ulaş. Sana en yakın, müsait çekiciye doğrudan ve aracısız mesaj at.",
    intro:
      "Aracın yolda mı kaldı, çalışmıyor mu, kaza mı yaptın? Pendik'te çekici ve yol yardım hizmeti verenleri burada bulursun. Bu hizmette en kritik şey hız ve yakınlık; sana en yakın müsait çekiciye doğrudan ulaşır, konumunu ve durumu anlatırsın.",
    guideTitle: "Pendik'te çekici çağırırken nelere dikkat etmeli?",
    guidePoints: [
      {
        title: "Konumunu net ver",
        body: "Bulunduğun yeri (cadde, yön, belirgin nokta) olabildiğince net söyle. Doğru konum, çekicinin sana hızlı ulaşmasının anahtarıdır.",
      },
      {
        title: "Aracını ve sorunu tarif et",
        body: "Araç tipi (otomobil, ticari), sorun (çalışmıyor, lastik, kaza) ve aracın yol kenarında mı yoksa otoparkta mı olduğunu söyle.",
      },
      {
        title: "Nereye çekilecek?",
        body: "Aracın hangi servise/adrese gideceğini baştan belirt; çekici buna göre fiyat ve rota planlar.",
      },
      {
        title: "Güvende kal",
        body: "Yol kenarında dörtlüleri yak, mümkünse aracın gerisine reflektör/üçgen koy ve çekici gelene kadar güvenli bir yerde bekle.",
      },
    ],
    emptyState:
      "Şu anda Pendik'te müsait çekici görünmüyor. Çekici/yol yardım hizmeti veriyorsan ücretsiz profil oluştur, yolda kalanlar sana ulaşsın.",
    faqs: [
      {
        q: "Yolda kaldım, en hızlı nasıl çekici bulurum?",
        a: "Listede müsait ve sana en yakın çekiciyi seçip hemen mesaj at; konumunu ve aracın durumunu net ver. Yakınlık gelme süresini doğrudan belirler.",
      },
      {
        q: "Çekici ücreti neye göre değişir?",
        a: "Mesafe, araç tipi ve aracın durumu başlıca etkenlerdir. Yola çıkmadan tahmini ücreti sormak sürprizi önler.",
      },
      {
        q: "Aracımı istediğim servise çektirebilir miyim?",
        a: "Evet. Aracın nereye gideceğini baştan söylersen çekici rotayı ve fiyatı ona göre planlar.",
      },
      {
        q: "Cevrende ücretli mi?",
        a: "Hayır. Çekiciye ulaşmak ve profil açmak ücretsizdir, komisyon alınmaz.",
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
