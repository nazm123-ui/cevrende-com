// İstanbul'un 39 ilçesi ve mahalleleri.
// İlk seed: sadece Pendik enabled. Diğerleri admin panelinden açılır.
// Mahalle listeleri Pendik için tam (resmi liste). Diğer ilçeler için
// en yaygın bilinen mahalleler — admin gerekirse ilçe sayfasından düzenler.

export type SeedDistrict = {
  slug: string;
  name: string;
  isEnabled: boolean;
  order: number;
  neighborhoods: string[];
};

export const ISTANBUL_DISTRICTS: SeedDistrict[] = [
  // ---- Anadolu Yakası ----
  {
    slug: "pendik",
    name: "Pendik",
    isEnabled: true,
    order: 1,
    neighborhoods: [
      "Bahçelievler", "Batı", "Çamçeşme", "Çamlık", "Çınardere", "Doğu",
      "Dumlupınar", "Ertuğrul Gazi", "Esenler", "Esenyalı", "Fatih",
      "Fevzi Çakmak", "Güllübağlar", "Güzelyalı", "Harmandere", "Kavakpınar",
      "Kaynarca", "Kurtköy", "Orhangazi", "Orta", "Ramazanoğlu", "Sapanbağları",
      "Sülüntepe", "Şeyhli", "Velibaba", "Yayalar", "Yeni", "Yenişehir",
    ],
  },
  {
    slug: "tuzla",
    name: "Tuzla",
    isEnabled: false,
    order: 2,
    neighborhoods: [
      "Aydınlı", "Aydıntepe", "Cami", "Evliya Çelebi", "Fatih", "İçmeler",
      "İstasyon", "Mescit", "Mimar Sinan", "Orhanlı", "Postane", "Şifa",
      "Tepeören", "Yayla",
    ],
  },
  {
    slug: "kartal",
    name: "Kartal",
    isEnabled: false,
    order: 3,
    neighborhoods: [
      "Atalar", "Cevizli", "Cumhuriyet", "Çavuşoğlu", "Esentepe", "Gümüşpınar",
      "Hürriyet", "Karlıktepe", "Kordonboyu", "Orhantepe", "Orta", "Petroliş",
      "Soğanlık Orta", "Soğanlık Yeni", "Topselvi", "Uğur Mumcu", "Yakacık Çarşı",
      "Yakacık Yeni", "Yalı", "Yukarı",
    ],
  },
  {
    slug: "maltepe",
    name: "Maltepe",
    isEnabled: false,
    order: 4,
    neighborhoods: [
      "Altayçeşme", "Altıntepe", "Aydınevler", "Bağlarbaşı", "Başıbüyük",
      "Cevizli", "Çınar", "Esenkent", "Feyzullah", "Fındıklı", "Girne",
      "Gülensu", "Gülsuyu", "İdealtepe", "Küçükyalı", "Yalı", "Zümrütevler",
    ],
  },
  {
    slug: "kadikoy",
    name: "Kadıköy",
    isEnabled: false,
    order: 5,
    neighborhoods: [
      "19 Mayıs", "Acıbadem", "Bostancı", "Caddebostan", "Caferağa", "Dumlupınar",
      "Eğitim", "Erenköy", "Fenerbahçe", "Fikirtepe", "Göztepe", "Hasanpaşa",
      "Koşuyolu", "Kozyatağı", "Merdivenköy", "Osmanağa", "Rasimpaşa", "Sahrayıcedit",
      "Suadiye", "Zühtüpaşa",
    ],
  },
  {
    slug: "atasehir",
    name: "Ataşehir",
    isEnabled: false,
    order: 6,
    neighborhoods: [
      "Aşıkveysel", "Atatürk", "Barbaros", "Esatpaşa", "Ferhatpaşa", "Fetih",
      "İçerenköy", "İnönü", "Kayışdağı", "Küçükbakkalköy", "Mevlana", "Mimar Sinan",
      "Mustafa Kemal", "Örnek", "Yeni Çamlıca", "Yenisahra",
    ],
  },
  {
    slug: "uskudar",
    name: "Üsküdar",
    isEnabled: false,
    order: 7,
    neighborhoods: [
      "Acıbadem", "Ahmediye", "Altunizade", "Aziz Mahmut Hüdayi", "Bahçelievler",
      "Barbaros", "Beylerbeyi", "Bulgurlu", "Burhaniye", "Cumhuriyet",
      "Çengelköy", "Ferah", "Güzeltepe", "İcadiye", "Kandilli", "Kirazlıtepe",
      "Kısıklı", "Kuleli", "Küçük Çamlıca", "Küçüksu", "Kuzguncuk", "Mimar Sinan",
      "Murat Reis", "Sultantepe", "Selimiye", "Salacak", "Ünalan", "Validei Atik",
      "Yavuztürk", "Zeynep Kamil",
    ],
  },
  {
    slug: "umraniye",
    name: "Ümraniye",
    isEnabled: false,
    order: 8,
    neighborhoods: [
      "Adem Yavuz", "Altınşehir", "Armağanevler", "Atakent", "Atatürk", "Aşağı Dudullu",
      "Cemil Meriç", "Çakmak", "Çamlık", "Dumlupınar", "Elmalıkent", "Esenevler",
      "Esenkent", "Esenşehir", "Fatih Sultan Mehmet", "Hekimbaşı", "Huzur",
      "İnkılap", "İstiklal", "Kazım Karabekir", "Madenler", "Mehmet Akif",
      "Namık Kemal", "Necip Fazıl", "Parseller", "Site", "Şerifali", "Tantavi",
      "Tatlısu", "Tepeüstü", "Topağacı", "Yamanevler", "Yeni Sanayi",
      "Yenidoğan", "Yukarı Dudullu",
    ],
  },
  {
    slug: "sancaktepe",
    name: "Sancaktepe",
    isEnabled: false,
    order: 9,
    neighborhoods: [
      "Abdurrahmangazi", "Akpınar", "Atatürk", "Emek", "Eyüp Sultan", "Fatih",
      "Hilal", "İnönü", "Kemal Türkler", "Meclis", "Mevlana", "Merve",
      "Osmangazi", "Paşaköy", "Safa", "Sarıgazi", "Veysel Karani", "Yenidoğan",
    ],
  },
  {
    slug: "sile",
    name: "Şile",
    isEnabled: false,
    order: 10,
    neighborhoods: [
      "Ağva", "Akçakese", "Balibey", "Çavuş", "Doğancılı", "Erenler", "Esenköy",
      "Hacıllı", "Hasanlı", "Kabakoz", "Kalemköy", "Karacaköy", "Kervansaray",
      "Korucu", "Kumbaba", "Meşrutiyet", "Oruçoğlu", "Ovacık", "Sahilköy",
      "Soğullu", "Şuayipli", "Teke", "Üvezli", "Yeniköy", "Yeşilvadi",
    ],
  },
  {
    slug: "cekmekoy",
    name: "Çekmeköy",
    isEnabled: false,
    order: 11,
    neighborhoods: [
      "Alemdağ", "Aşağı Dudullu", "Cumhuriyet", "Çamlık", "Çatalmeşe", "Ekşioğlu",
      "Güngören", "Hamidiye", "Hüseyinli", "Kirazlıdere", "Koçullu", "Mehmet Akif",
      "Merkez", "Mimar Sinan", "Nişantepe", "Ömerli", "Reşadiye", "Sırapınar",
      "Soğukpınar", "Sultançiftliği", "Taşdelen", "Yukarı Dudullu",
    ],
  },
  {
    slug: "beykoz",
    name: "Beykoz",
    isEnabled: false,
    order: 12,
    neighborhoods: [
      "Anadolu Feneri", "Acarlar", "Akbaba", "Anadolu Hisarı", "Anadolu Kavağı",
      "Baklacı", "Çamlıbahçe", "Çavuşbaşı", "Çiftlik", "Çiğdem", "Çubuklu",
      "Fatih", "Gümüşsuyu", "Göllü", "Görele", "Gümüşsuyu", "Kanlıca",
      "Kavacık", "Merkez", "Mahmut Şevket Paşa", "Ortaçeşme", "Öğümce", "Paşabahçe",
      "Paşamandıra", "Polonezköy", "Riva", "Soğuksu", "Tokatköy", "Yalıköy",
      "Yavuz Selim",
    ],
  },
  // ---- Avrupa Yakası ----
  {
    slug: "besiktas",
    name: "Beşiktaş",
    isEnabled: false,
    order: 13,
    neighborhoods: [
      "Abbasağa", "Akatlar", "Arnavutköy", "Balmumcu", "Bebek", "Cihannüma",
      "Dikilitaş", "Etiler", "Gayrettepe", "Konaklar", "Kuruçeşme", "Levazım",
      "Levent", "Mecidiye", "Muradiye", "Nispetiye", "Ortaköy", "Sinanpaşa",
      "Türkali", "Ulus", "Vişnezade", "Yıldız",
    ],
  },
  {
    slug: "sisli",
    name: "Şişli",
    isEnabled: false,
    order: 14,
    neighborhoods: [
      "19 Mayıs", "Ayazağa", "Bozkurt", "Cumhuriyet", "Duatepe", "Ergenekon",
      "Eskişehir", "Esentepe", "Feriköy", "Fulya", "Gülbahar", "Halaskargazi",
      "Halide Edip Adıvar", "Halil Rıfat Paşa", "Harbiye", "İnönü", "İzzetpaşa",
      "Kaptanpaşa", "Kuştepe", "Mahmut Şevket Paşa", "Maslak", "Mecidiyeköy",
      "Merkez", "Meşrutiyet", "Paşa", "Teşvikiye", "Yayla",
    ],
  },
  {
    slug: "beyoglu",
    name: "Beyoğlu",
    isEnabled: false,
    order: 15,
    neighborhoods: [
      "Arap Cami", "Bedrettin", "Bereketzade", "Bostan", "Bülbül", "Camiikebir",
      "Cihangir", "Çukur", "Emekyemez", "Evliya Çelebi", "Fetihtepe", "Firuzağa",
      "Gümüşsuyu", "Hacıahmet", "Hacımimi", "Halıcıoğlu", "Hüseyinağa", "İstiklal",
      "Kadı Mehmet Efendi", "Kalyoncu Kulluğu", "Kamer Hatun", "Kaptanpaşa", "Karaköy",
      "Katip Mustafa Çelebi", "Keçeci Piri", "Kemankeş Karamustafa Paşa", "Kılıçali Paşa",
      "Kocatepe", "Kuloğlu", "Kuştepe", "Müeyyetzade", "Ömer Avni", "Örnektepe",
      "Piri Mehmet Paşa", "Piyalepaşa", "Pürtelaş Hasanefendi", "Sururi", "Sütlüce",
      "Şahkulu", "Şehit Muhtar", "Tomtom", "Yahyakahya",
    ],
  },
  {
    slug: "fatih",
    name: "Fatih",
    isEnabled: false,
    order: 16,
    neighborhoods: [
      "Aksaray", "Alemdar", "Ali Kuşçu", "Atikali", "Ayvansaray", "Balat",
      "Balabanağa", "Beyazıt", "Binbirdirek", "Cankurtaran", "Cerrahpaşa",
      "Cibali", "Demirtaş", "Derviş Ali", "Eminönü", "Fatih Camii Karayüzü",
      "Hacı Kadın", "Hırka-i Şerif", "Hobyar", "Hocapaşa", "Hoca Gıyasettin",
      "Hoca Üveys", "İskenderpaşa", "Kalenderhane", "Karagümrük", "Katip Kasım",
      "Kemal Paşa", "Küçük Mustafa Paşa", "Mercan", "Mesihpaşa", "Mevlanakapı",
      "Mimar Hayrettin", "Mimar Kemalettin", "Molla Fenari", "Molla Gürani",
      "Molla Hüsrev", "Muhsine Hatun", "Nişanca", "Rüstempaşa", "Saraç İshak",
      "Sarıdemir", "Seyyid Ömer", "Silivrikapı", "Sümbül Efendi", "Süleymaniye",
      "Şehremini", "Şehsuvar Bey", "Tahtakale", "Taya Hatun", "Topkapı",
      "Yavuz Sinan", "Yavuz Sultan Selim", "Yedikule",
    ],
  },
  {
    slug: "eyupsultan",
    name: "Eyüpsultan",
    isEnabled: false,
    order: 17,
    neighborhoods: [
      "Akpınar", "Akşemsettin", "Alibeyköy", "Defterdar", "Düğmeciler", "Emniyettepe",
      "Esentepe", "Eyüp Merkez", "Göktürk Merkez", "Güzeltepe", "İslambey",
      "Karadolap", "Kemerburgaz", "Mimar Sinan", "Nişanca", "Pirinççi", "Rami Cuma",
      "Rami Yeni", "Sakarya", "Silahtarağa", "Topçular", "Yeşilpınar",
    ],
  },
  {
    slug: "kagithane",
    name: "Kağıthane",
    isEnabled: false,
    order: 18,
    neighborhoods: [
      "Çağlayan", "Çeliktepe", "Emniyetevleri", "Gültepe", "Gürsel", "Hamidiye",
      "Harmantepe", "Hürriyet", "Mehmet Akif Ersoy", "Merkez", "Nurtepe",
      "Ortabayır", "Sanayi", "Seyrantepe", "Şirintepe", "Talatpaşa", "Telsizler",
      "Yahya Kemal", "Yeşilce",
    ],
  },
  {
    slug: "sariyer",
    name: "Sarıyer",
    isEnabled: false,
    order: 19,
    neighborhoods: [
      "Ayazağa", "Bahçeköy Merkez", "Bahçeköy Kemer", "Bahçeköy Yeni", "Baltalimanı",
      "Cumhuriyet", "Çamlıtepe", "Çayırbaşı", "Darüşşafaka", "Demirciköy",
      "Emirgan", "Ferahevler", "Fatih Sultan Mehmet", "Garipçe", "Gümüşdere",
      "Huzur", "İstinye", "Kazım Karabekir", "Kireçburnu", "Kısırkaya", "Kocataş",
      "Maden", "Maslak", "Merkez", "Pınar", "Poligon", "Reşitpaşa", "Rumelifeneri",
      "Rumelihisarı", "Rumelikavağı", "Tarabya", "Uskumruköy", "Yeniköy", "Yeni Mahalle",
    ],
  },
  {
    slug: "bayrampasa",
    name: "Bayrampaşa",
    isEnabled: false,
    order: 20,
    neighborhoods: [
      "Altıntepsi", "Cevatpaşa", "İsmetpaşa", "Kartaltepe", "Kocatepe",
      "Muratpaşa", "Orta", "Terazidere", "Vatan", "Yenidoğan", "Yıldırım",
    ],
  },
  {
    slug: "adalar",
    name: "Adalar",
    isEnabled: false,
    order: 39,
    neighborhoods: [
      "Burgazada", "Heybeliada", "Kınalıada", "Maden", "Nizam",
    ],
  },
  {
    slug: "esenler",
    name: "Esenler",
    isEnabled: false,
    order: 21,
    neighborhoods: [
      "Birlik", "Çiftehavuzlar", "Davutpaşa", "Fatih", "Fevzi Çakmak",
      "Havaalanı", "Kazım Karabekir", "Kemer", "Menderes", "Mimar Sinan",
      "Namık Kemal", "Nene Hatun", "Oruçreis", "Tuna", "Turgut Reis", "Yavuz Selim",
    ],
  },
  {
    slug: "bagcilar",
    name: "Bağcılar",
    isEnabled: false,
    order: 22,
    neighborhoods: [
      "100. Yıl", "Bağlar", "Barbaros", "Çınar", "Demirkapı", "Evren",
      "Fatih", "Fevzi Çakmak", "Göztepe", "Güneşli", "Hürriyet", "İnönü",
      "Kazım Karabekir", "Kemalpaşa", "Kirazlı", "Mahmutbey", "Merkez",
      "Sancaktepe", "Yavuz Selim", "Yeni Mahalle", "Yenigün", "Yıldıztepe",
    ],
  },
  {
    slug: "gungoren",
    name: "Güngören",
    isEnabled: false,
    order: 23,
    neighborhoods: [
      "Abdurrahman Nafiz Gürman", "Akıncılar", "Genç Osman", "Güneştepe",
      "Gençosman", "Haznedar", "Mareşal Çakmak", "Merkez", "Sanayi", "Tozkoparan",
    ],
  },
  {
    slug: "zeytinburnu",
    name: "Zeytinburnu",
    isEnabled: false,
    order: 24,
    neighborhoods: [
      "Beştelsiz", "Çırpıcı", "Gökalp", "Kazlıçeşme", "Maltepe", "Merkezefendi",
      "Nuripaşa", "Seyitnizam", "Sümer", "Telsiz", "Veliefendi", "Yeşiltepe",
      "Yenidoğan",
    ],
  },
  {
    slug: "bakirkoy",
    name: "Bakırköy",
    isEnabled: false,
    order: 25,
    neighborhoods: [
      "Ataköy 1. Kısım", "Ataköy 2-5-6. Kısım", "Ataköy 3-4-11. Kısım",
      "Ataköy 7-8-9-10. Kısım", "Basınköy", "Cevizlik", "Kartaltepe", "Osmaniye",
      "Sakızağacı", "Şenlikköy", "Yenimahalle", "Yeşilköy", "Yeşilyurt", "Zeytinlik",
      "Zuhuratbaba",
    ],
  },
  {
    slug: "bahcelievler",
    name: "Bahçelievler",
    isEnabled: false,
    order: 26,
    neighborhoods: [
      "Bahçelievler", "Cumhuriyet", "Çobançeşme", "Fevzi Çakmak", "Hürriyet",
      "Kocasinan Merkez", "Siyavuşpaşa", "Soğanlı", "Şirinevler", "Yenibosna",
      "Zafer",
    ],
  },
  {
    slug: "kucukcekmece",
    name: "Küçükçekmece",
    isEnabled: false,
    order: 27,
    neighborhoods: [
      "Atakent", "Atatürk", "Beşyol", "Cennet", "Cumhuriyet", "Fatih",
      "Fevzi Çakmak", "Gültepe", "Halkalı Merkez", "İkitelli-1", "İkitelli-2",
      "İnönü", "Kanarya", "Kartaltepe", "Kemalpaşa", "Mehmet Akif", "Söğütlüçeşme",
      "Sultan Murat", "Tevfik Bey", "Yarımburgaz", "Yenidoğan", "Yeşilova",
    ],
  },
  {
    slug: "avcilar",
    name: "Avcılar",
    isEnabled: false,
    order: 28,
    neighborhoods: [
      "Ambarlı", "Cihangir", "Denizköşkler", "Firuzköy", "Gümüşpala", "Merkez",
      "Mustafa Kemal Paşa", "Tahtakale", "Üniversite", "Yeşilkent",
    ],
  },
  {
    slug: "esenyurt",
    name: "Esenyurt",
    isEnabled: false,
    order: 29,
    neighborhoods: [
      "Akçaburgaz", "Akşemsettin", "Ardıçlı", "Aşık Veysel", "Atatürk Merkez",
      "Bağlarçeşme", "Balıkyolu", "Barbaros", "Bahçelievler", "Bahçeşehir 1.Kısım",
      "Bahçeşehir 2.Kısım", "Cumhuriyet", "Çınar", "Esenkent", "Fatih",
      "Gökevler", "Güzelyurt", "Hürriyet", "İncirtepe", "İnönü", "Kıraç",
      "Koza", "Mehterçeşme", "Merkez", "Mevlana", "Namık Kemal", "Necip Fazıl",
      "Örnek", "Pınar", "Saadetdere", "Sanayi", "Selahaddin Eyyubi", "Sultaniye",
      "Süleymaniye", "Talatpaşa", "Turgut Reis", "Yakuplu", "Yenikent", "Yeşilkent",
      "Yeşilova", "Zafer",
    ],
  },
  {
    slug: "beylikduzu",
    name: "Beylikdüzü",
    isEnabled: false,
    order: 30,
    neighborhoods: [
      "Adnan Kahveci", "Barış", "Büyükşehir", "Cumhuriyet", "Dereağzı", "Gürpınar",
      "Kavaklı", "Marmara", "Sahil", "Yakuplu",
    ],
  },
  {
    slug: "buyukcekmece",
    name: "Büyükçekmece",
    isEnabled: false,
    order: 31,
    neighborhoods: [
      "Ahmediye", "Alkent 2000", "Atatürk", "Bahçelievler", "Cumhuriyet",
      "Dizdariye", "Ekinoba", "Fatih", "Güzelce", "Hürriyet", "Karaağaç",
      "Kumburgaz", "Mimaroba", "Mimarsinan", "Murat Bey", "Pınartepe",
      "Sinanoba", "Tepecik", "Türkoba", "Yenimahalle",
    ],
  },
  {
    slug: "catalca",
    name: "Çatalca",
    isEnabled: false,
    order: 32,
    neighborhoods: [
      "Akalan", "Atatürk", "Bahşayiş", "Çakıl", "Çiftlik", "Çilingir",
      "Dağyenice", "Elbasan", "Ferhatpaşa", "Gökçeali", "Gümüşpınar", "Hisarbeyli",
      "İhsaniye", "İnceğiz", "Izzettin", "Kabakça", "Kaleiçi", "Karacaköy",
      "Karamandere", "Kestanelik", "Muratbey", "Nakkaş", "Ormanlı", "Ovayenice",
      "Subaşı", "Yalıköy", "Yaylacık", "Yeniköy",
    ],
  },
  {
    slug: "silivri",
    name: "Silivri",
    isEnabled: false,
    order: 33,
    neighborhoods: [
      "Akören", "Alibey", "Alipaşa", "Beyciler", "Büyükçavuşlu", "Cumhuriyet",
      "Çanta Balaban", "Çanta Mimar Sinan", "Çayırdere", "Danamandıra", "Değirmenköy",
      "Fatih", "Fener", "Gazi Tepe", "Gümüşyaka", "Kavaklı", "Mimar Sinan",
      "Ortaköy", "Piri Mehmet Paşa", "Sayalar", "Selimpaşa", "Semizkumlar",
      "Seymen", "Yeni", "Yolçatı",
    ],
  },
  {
    slug: "arnavutkoy",
    name: "Arnavutköy",
    isEnabled: false,
    order: 34,
    neighborhoods: [
      "Adnan Menderes", "Anadolu", "Arnavutköy Merkez", "Atatürk", "Baklalı",
      "Balaban", "Boğazköy", "Boyalık", "Bolluca", "Çilingir", "Deliklikaya",
      "Durusu", "Fatih", "Hadımköy", "Hastane", "Hicret", "İmrahor",
      "İslambey", "Karaburun", "Karlıbayır", "Mavigöl", "Mehmet Akif Ersoy",
      "Mareşal Fevzi Çakmak", "Mustafa Kemal Paşa", "Nenehatun", "Ömerli",
      "Tahtakale", "Taşoluk", "Terkos", "Yassıören", "Yavuz Selim", "Yeniköy",
      "Yeşilbayır",
    ],
  },
  {
    slug: "basaksehir",
    name: "Başakşehir",
    isEnabled: false,
    order: 35,
    neighborhoods: [
      "Altınşehir", "Bahçeşehir 1. Kısım", "Bahçeşehir 2. Kısım", "Başak",
      "Başakşehir", "Güvercintepe", "Kayabaşı", "Şahintepe", "Şamlar", "Ziya Gökalp",
    ],
  },
  {
    slug: "sultangazi",
    name: "Sultangazi",
    isEnabled: false,
    order: 36,
    neighborhoods: [
      "50. Yıl", "75. Yıl", "Cebeci", "Cumhuriyet", "Eski Habipler", "Esentepe",
      "Gazi", "Habipler", "İsmetpaşa", "Malkoçoğlu", "Sultançiftliği",
      "Uğur Mumcu", "Yayla", "Yunusemre", "Zübeyde Hanım",
    ],
  },
  {
    slug: "gaziosmanpasa",
    name: "Gaziosmanpaşa",
    isEnabled: false,
    order: 37,
    neighborhoods: [
      "Bağlarbaşı", "Barbaros Hayrettin Paşa", "Fevzi Çakmak", "Hürriyet",
      "Karadeniz", "Karayolları", "Kazım Karabekir", "Merkez", "Mevlana",
      "Pazariçi", "Sarıgöl", "Şemsipaşa", "Yenidoğan", "Yıldıztabya",
      "Yenimahalle",
    ],
  },
  {
    slug: "sultanbeyli",
    name: "Sultanbeyli",
    isEnabled: false,
    order: 38,
    neighborhoods: [
      "Abdurrahmangazi", "Adil", "Ahmet Yesevi", "Akşemsettin", "Battalgazi",
      "Fatih", "Hamidiye", "Hasanpaşa", "Mecidiye", "Mehmet Akif", "Mimar Sinan",
      "Necip Fazıl", "Orhangazi", "Turgutreis", "Yavuz Selim",
    ],
  },
];

export const ENABLED_DEFAULT_SLUGS = ISTANBUL_DISTRICTS
  .filter((d) => d.isEnabled)
  .map((d) => d.slug);
