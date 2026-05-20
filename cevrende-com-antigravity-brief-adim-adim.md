# Cevrende.com Yerel İş İlanı ve Hizmet Görevlisi Platformu

## 1. Proje Özeti

Bu web sitesi, Cevrende.com markasıyla İstanbul / Pendik ilçesi ve Pendik mahalleleri odağında işverenler ile iş arayan kişileri bir araya getiren ücretsiz bir iş bulma ve iş yayınlama platformudur.

Platform küresel ölçekte değil; ilk aşamada İstanbul / Pendik ilçesi ve Pendik mahalleleri gibi yerel alanlarda çalışacak şekilde tasarlanacaktır. Amaç, özellikle günlük, dönemsel, yarı zamanlı veya kısa süreli işlerde işverenin hızlıca ilan açabilmesi, iş arayanların da bu ilanları görüp işverenle doğrudan iletişime geçebilmesidir.

İlk aşamada kullanıcıdan herhangi bir ücret alınmayacaktır. Sistem ücretsiz çalışacaktır. İlerleyen dönemlerde abonelik, öne çıkarılmış ilan veya premium üyelik gibi gelir modelleri eklenebilir.

---

## 2. Platformun Amacı

Platformun temel amacı:

- Pendik ve çevresindeki yerel işverenlerin kolayca iş ilanı oluşturmasını sağlamak.
- İş arayan kişilerin Pendik ilçesi ve mahallelerindeki işleri hızlıca görebilmesini sağlamak.
- Garson, komi, temizlik görevlisi, taşıma elemanı, günlük işçi, servis elemanı, mağaza personeli, etkinlik çalışanı gibi farklı iş kollarındaki kişileri işverenlerle buluşturmak.
- Küçük işletmelerin hızlı personel ihtiyacına pratik bir çözüm sunmak.
- İş arayanlar için sade, ücretsiz ve erişilebilir bir başvuru/iletişim kanalı oluşturmak.

---

## 3. Hedef Kitle

### 3.1 İşverenler

Platforma iş ilanı oluşturmak için kayıt olan kullanıcılar.

Örnek işveren profilleri:

- Kafe ve restoran sahipleri
- Marketler
- Yerel mağazalar
- Etkinlik organizatörleri
- Temizlik hizmeti arayan kişiler veya işletmeler
- Taşıma, paketleme veya günlük işçi ihtiyacı olan işletmeler
- İnşaat, tadilat veya saha işi için kısa süreli destek arayan kişiler
- Ev veya ofis için hizmet görevlisi arayan bireysel kullanıcılar

### 3.2 İş Arayanlar

Platformdaki ilanları görüntüleyen ve uygun işverenlerle iletişime geçen kullanıcılar.

Örnek iş arayan profilleri:

- Garsonlar
- Komiler
- Temizlik görevlileri
- Günlük işçiler
- Mağaza personelleri
- Paketleme elemanları
- Kurye veya dağıtım personelleri
- Etkinlik çalışanları
- Öğrenciler
- Ek iş arayan kişiler
- Kısa süreli veya yarı zamanlı iş arayanlar

---

## 4. Kullanıcı Rolleri

Platformda ilk aşamada 3 temel rol bulunacaktır. İşverenler hem işletme hem de bireysel kişi olabilir.

### 4.1 Ziyaretçi

Kayıt olmadan siteyi gezen kullanıcıdır.

Ziyaretçi şunları yapabilir:

- Ana sayfayı görüntüleyebilir.
- Yayındaki iş ilanlarını listeleyebilir.
- İş ilanı detaylarını okuyabilir.
- Kayıt veya giriş sayfasına gidebilir.
- İletişim, ad soyad ve telefon gibi hassas bilgileri tamamen göremez.

Ziyaretçilere gizli bilgi gösterimi:

- Telefon numarası maskeleme: `05*********` veya `05** *** ** 45`
- Ad soyad maskeleme: `Ah*** Yı****`
- İşletme adı opsiyonel olarak gösterilebilir.
- Tam iletişim bilgileri yalnızca giriş yapan ve telefon doğrulaması tamamlanmış kullanıcılara gösterilir.

### 4.2 İşveren

İş ilanı oluşturan kullanıcıdır.

İşveren şunları yapabilir:

- Kayıt olabilir.
- Telefon doğrulaması yapabilir.
- Giriş yapabilir.
- Profil bilgilerini düzenleyebilir.
- Yeni iş ilanı oluşturabilir.
- Kendi ilanlarını listeleyebilir.
- İlanlarını düzenleyebilir.
- İlanlarını yayından kaldırabilir.
- Başvurular veya iletişime geçen kişiler için bildirim alabilir. Bu özellik MVP sonrası eklenebilir.

### 4.3 İş Arayan

İş ilanlarını inceleyen ve işverenle iletişime geçen kullanıcıdır.

İş arayan şunları yapabilir:

- Kayıt olabilir.
- Giriş yapabilir.
- Profil bilgilerini düzenleyebilir.
- İş ilanlarını listeleyebilir.
- Filtreleme yapabilir.
- İlan detaylarını okuyabilir.
- İşverenle telefon, WhatsApp, e-posta veya platform içi mesajlaşma üzerinden iletişime geçebilir.

---

## 5. MVP Kapsamı

İlk sürüm sade, hızlı ve kullanılabilir olmalıdır. Karmaşık özellikler sonraki fazlara bırakılmalıdır.

### 5.1 MVP’de Olması Gereken Temel Özellikler

- Kullanıcı kayıt sistemi
- Kullanıcı giriş sistemi
- İşveren ve iş arayan için telefon doğrulama
- İşveren ve iş arayan rol seçimi
- İşveren için ilan oluşturma
- İlan listeleme sayfası
- İlan detay sayfası
- İstanbul / Pendik / mahalle bazlı filtreleme
- İş kategorisi filtreleme
- İş tipi filtreleme
- İşveren iletişim bilgisinin yalnızca giriş yapan doğrulanmış kullanıcılara gösterimi
- İşverenin kendi ilanlarını yönetebileceği panel
- Mobil uyumlu arayüz
- Temel güvenlik ve form doğrulamaları

### 5.2 MVP’de Olması Gerekmeyen Özellikler

İlk sürümde zorunlu değildir:

- Online ödeme
- Abonelik sistemi
- Platform içi mesajlaşma
- Puanlama / yorum sistemi
- CV yükleme
- Gelişmiş aday takip sistemi
- Gelişmiş harita arama deneyimi
- Otomatik eşleştirme algoritması
- Admin onay süreci

Bu özellikler ilerleyen versiyonlara bırakılabilir.

---

## 6. Sayfa Yapısı

### 6.1 Ana Sayfa

Ana sayfa sade ve doğrudan aksiyona yönlendiren bir yapıda olmalıdır.

İçerik önerisi:

- Hero alanı
- Kısa değer önerisi
- “İş İlanlarını Gör” butonu
- “İş İlanı Oluştur” butonu
- Bölge veya kategoriye göre arama alanı
- Öne çıkan / son eklenen ilanlar
- Platformun nasıl çalıştığını anlatan 3 adımlı bölüm
- Güven veren kısa açıklama
- Footer

Örnek hero mesajı:

> Yakınındaki işi bul. İhtiyacın olan çalışanla hızlıca tanış.

Alternatif mesaj:

> Yerel işler, gerçek insanlar, hızlı iletişim.

### 6.2 İş İlanları Listeleme Sayfası

Bu sayfada yayındaki tüm iş ilanları listelenmelidir.

Filtreler:

- İl: İstanbul
- İlçe: Pendik
- Mahalle
- İş kategorisi
- İş tipi
- Ücret, opsiyonel aralığı
- Tarih
- Aciliyet
- Yayınlanma tarihi

İlan kartında gösterilecek bilgiler:

- İş başlığı
- Kategori
- Konum
- Ücret bilgisi
- İş tipi
- Tarih / çalışma zamanı
- Kısa açıklama
- “Detayları Gör” butonu

### 6.3 İş İlanı Detay Sayfası

İş ilanının tüm bilgileri burada gösterilmelidir.

Alanlar:

- İş başlığı
- İş açıklaması
- İş kategorisi
- Konum
- Harita konumu / Google Maps bağlantısı
- Çalışma tarihi
- Çalışma saatleri
- Ücret
- Ödeme tipi
- Aranan kişi sayısı
- Deneyim gereksinimi
- İşveren adı veya işletme adı
- İletişim yöntemi: telefon
- Başvuru / iletişime geç butonu

İletişim yöntemleri:

- Telefon
- WhatsApp
- E-posta
- Platform içi mesajlaşma ilk sürümde olmayacaktır

### 6.4 Kayıt Sayfası

Kullanıcı kayıt olurken rol seçmelidir.

Alanlar:

- Ad soyad
- Telefon
- E-posta
- Şifre
- Kullanıcı tipi:
  - İşveren
  - İş arayan
- Telefon doğrulama
- İl: İstanbul
- İlçe: Pendik
- Mahalle, opsiyonel
- Kullanım koşulları onayı

### 6.5 Giriş Sayfası

Alanlar:

- E-posta veya telefon
- Şifre
- Şifremi unuttum bağlantısı
- Kayıt ol bağlantısı

### 6.6 İşveren Paneli

İşverenin kendi ilanlarını yönetebileceği alandır.

Özellikler:

- Yeni ilan oluşturma
- Aktif ilanları görüntüleme
- Pasif ilanları görüntüleme
- İlan düzenleme
- İlan silme veya yayından kaldırma
- Profil bilgilerini düzenleme

### 6.7 İş Arayan Paneli

MVP’de basit tutulabilir.

Özellikler:

- Profil bilgilerini düzenleme
- Konum bilgisi güncelleme
- İlgi alanı / iş kategorisi seçme
- Favori ilanlar, opsiyonel
- Daha önce görüntülenen ilanlar, opsiyonel

### 6.8 Admin Paneli

MVP’de temel bir admin paneli önerilir.

Admin şunları yapabilir:

- Kullanıcıları görüntüleyebilir.
- İş kategorilerini sonradan ekleyebilir, düzenleyebilir veya pasifleştirebilir.
- İlanları görüntüleyebilir.
- Uygunsuz ilanları yayından kaldırabilir.
- Şikayet edilen ilanları inceleyebilir.
- Kategori ve lokasyonları yönetebilir.

---

## 7. İş İlanı Oluşturma Formu

İşveren ilan oluştururken aşağıdaki alanları doldurmalıdır.

### Zorunlu Alanlar

- İş başlığı
- İş açıklaması
- İş kategorisi
- İl: İstanbul
- İlçe: Pendik
- Mahalle
- Çalışma tarihi
- Çalışma saatleri
- Ücret
- Ödeme tipi
- İletişim yöntemi
- İşveren adı / işletme adı

### Opsiyonel Alanlar

- Ücret bilgisi
- Aranan kişi sayısı
- Deneyim gereksinimi
- Yaş aralığı
- Cinsiyet tercihi, yasal ve etik açıdan dikkatli kullanılmalı
- Yemek / yol desteği
- Üniforma gereksinimi
- Aciliyet durumu
- Ek notlar

### İş Tipi Seçenekleri

- Günlük iş
- Yarı zamanlı
- Tam zamanlı
- Sezonluk
- Vardiyalı
- Tek seferlik
- Etkinlik bazlı
- Acil iş

### Ödeme Tipi Seçenekleri

- Saatlik
- Günlük
- Haftalık
- Aylık
- İş bitiminde
- Görüşülür

---

## 8. İş Kategorileri

İlk sürümde önerilen kategoriler:

- Garson / Servis
- Komi
- Mutfak Yardımcısı
- Temizlik
- Mağaza Personeli
- Depo / Paketleme
- Taşıma / Nakliye Yardımı
- Kurye / Dağıtım
- Etkinlik Personeli
- Güvenlik
- İnşaat / Tadilat Yardımı
- Bahçe / Peyzaj
- Çocuk Bakımı
- Yaşlı Bakımı
- Ev Hizmetleri
- Diğer

---

## 9. Veri Modeli Önerisi

Aşağıdaki veri yapısı Antigravity veya geliştirme ekibi için referans olabilir.

### 9.1 User

```json
{
  "id": "string",
  "role": "employer | worker | admin",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "passwordHash": "string",
  "city": "string",
  "district": "string",
  "neighborhood": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "isVerified": "boolean",
  "isActive": "boolean"
}
```

### 9.2 EmployerProfile

```json
{
  "id": "string",
  "userId": "string",
  "businessName": "string",
  "businessType": "string",
  "description": "string",
  "contactPreference": "phone",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 9.3 WorkerProfile

```json
{
  "id": "string",
  "userId": "string",
  "bio": "string",
  "skills": ["string"],
  "preferredCategories": ["string"],
  "availableLocations": ["string"],
  "experienceLevel": "none | beginner | intermediate | experienced",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 9.4 JobPost

```json
{
  "id": "string",
  "employerId": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "jobType": "daily | part_time | full_time | seasonal | shift | one_time | event | urgent",
  "city": "string",
  "district": "string",
  "neighborhood": "string",
  "mapLocationUrl": "string",
  "latitude": "number | null",
  "longitude": "number | null",
  "workDate": "date",
  "startTime": "time",
  "endTime": "time",
  "salaryAmount": "number | null",
  "salaryType": "hourly | daily | weekly | monthly | per_job | negotiable | not_specified",
  "neededPeopleCount": "number",
  "experienceRequired": "boolean",
  "benefits": ["meal", "transport", "uniform"],
  "contactMethod": "phone",
  "status": "draft | active | passive | expired | removed",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### 9.5 Report

```json
{
  "id": "string",
  "reporterUserId": "string",
  "jobPostId": "string",
  "reason": "string",
  "description": "string",
  "status": "pending | reviewed | resolved",
  "createdAt": "datetime"
}
```

---

## 10. Temel Kullanıcı Akışları

### 10.1 İşveren Akışı

1. İşveren siteye girer.
2. Kayıt olur veya giriş yapar.
3. Kullanıcı tipi olarak işveren seçer.
4. Panelden “Yeni İş İlanı Oluştur” butonuna tıklar.
5. İş bilgilerini girer.
6. İlanı yayınlar.
7. İş arayanlar ilanı görüntüler.
8. İş arayan kişi telefon, WhatsApp veya e-posta yoluyla işverenle iletişime geçer.
9. İşveren ilanı düzenleyebilir veya yayından kaldırabilir.

### 10.2 İş Arayan Akışı

1. İş arayan siteye girer.
2. İş ilanlarını görüntüler.
3. Konum ve kategoriye göre filtreleme yapar.
4. Uygun ilanı seçer.
5. Detayları okur.
6. İletişim butonuna tıklar.
7. İşverenle doğrudan iletişime geçer.

---

## 11. Harita ve Konum Mantığı

İş ilanlarında konum bilgisi bulunmalıdır.

MVP önerisi:

- Her ilan İstanbul / Pendik / mahalle seçimiyle oluşturulur.
- İşveren isterse harita konumu veya Google Maps bağlantısı ekleyebilir.
- İlan detayında “Konumu Haritada Aç” butonu yer alır.
- Butona tıklandığında Google Maps veya benzeri harita uygulaması açılır.
- İlk aşamada site içinde gelişmiş harita arama zorunlu değildir.
- İlerleyen fazlarda harita üzerinde ilan gösterimi eklenebilir.

---

## 11. İletişim Mantığı

İlk sürümde platform içi mesajlaşma olmayacaktır.

MVP iletişim yöntemi:

- İşveren ilan oluştururken telefon numarasını doğrular.
- İş arayan kayıt olur, giriş yapar ve telefon doğrulamasını tamamlar.
- İş arayan ilan detayında “Telefonla İletişime Geç” butonunu görür.
- Tam telefon numarası yalnızca giriş yapan ve doğrulanmış kullanıcılara gösterilir.
- Kayıtlı olmayan ziyaretçiler ilanı görebilir, fakat telefon, ad soyad ve benzeri hassas bilgilerin yalnızca maskelenmiş halini görür.

Örnek maskeleme:

- Telefon: `05*********`
- Ad soyad: `Me**** Ka****`

Not:
WhatsApp, e-posta ve platform içi mesajlaşma ilk sürümde yer almayacaktır. İleride talebe göre eklenebilir.

---

## 13. Güvenlik ve Moderasyon

Platform ücretsiz olduğu için sahte ilan, spam ve uygunsuz kullanım riskleri vardır. İlk sürümde temel güvenlik önlemleri alınmalıdır.

Öneriler:

- Telefon veya e-posta doğrulama
- Şifreli parola saklama
- Form validasyonları
- Spam ilan engelleme
- Pornografik, +18, küfür, hakaret, kötüye kullanım ve dolandırıcılık çağrışımı yapan kelimeler için otomatik filtreleme
- Aynı kullanıcının kısa sürede çok fazla ilan açmasını sınırlama
- İlan şikayet etme özelliği
- Admin tarafından ilan kaldırma
- Otomatik filtreye takılan ilanı yayınlamama veya incelemeye alma
- Uygunsuz kelime filtresi
- Kullanım koşulları onayı
- KVKK ve gizlilik politikası sayfaları

---

## 14. Hukuki ve Etik Notlar

Platform doğrudan işveren ile iş arayanı buluşturan aracı bir yapıdadır. Bu nedenle aşağıdaki metinler hazırlanmalıdır:

- Kullanım Koşulları
- Gizlilik Politikası
- KVKK Aydınlatma Metni
- Çerez Politikası
- Sorumluluk Reddi

Önemli:
Platform, işverenin ilan içeriğinden ve kullanıcılar arasındaki anlaşmalardan doğrudan sorumlu olmadığını belirtmelidir. Ancak şikayet ve kötüye kullanım durumlarında müdahale edebilmelidir.

---

## 15. Tasarım Dili

Tasarım sade, güven veren ve hızlı aksiyona yönlendiren bir yapıda olmalıdır.

### Görsel Dil

- Temiz arayüz
- Mobil öncelikli tasarım
- Büyük ve okunaklı butonlar
- Yerel, samimi, sıcak ama güven veren profesyonel ton
- Karmaşık olmayan ilan kartları
- Hızlı filtreleme deneyimi

### Renk Önerisi

Güven ve erişilebilirlik hissi için:

- Ana renk: Mavi, yeşil veya turuncu tonları
- Arka plan: Açık gri / kırık beyaz
- Vurgu rengi: Canlı ama gözü yormayan bir ton

### Tipografi

- Modern, okunaklı sans-serif font
- Mobilde rahat okunabilir yazı boyutları
- İlan başlıklarında güçlü hiyerarşi

---

## 16. Ana Sayfa İçerik Taslağı

### Hero Başlığı

Yakınındaki işi bul, ihtiyacın olan çalışanla tanış.

### Alt Metin

İlçendeki, mahallendeki ve çevrendeki iş fırsatlarını tek yerde gör. İşverenler ücretsiz ilan açsın, iş arayanlar hızlıca iletişime geçsin.

### Butonlar

- İş İlanlarını Gör
- Ücretsiz İlan Oluştur

### Nasıl Çalışır?

1. İşveren ilan oluşturur.
2. İş arayan uygun işi bulur.
3. Taraflar doğrudan iletişime geçer.

### Güven Mesajı

Basit, ücretsiz ve yerel iş bağlantıları için tasarlandı.

---

## 17. Örnek İlan Kartı

```text
Garson Aranıyor
Kategori: Garson / Servis
Konum: Kadıköy / Caferağa
İş Tipi: Günlük
Ücret: Günlük 1.000 TL
Saat: 17:00 - 23:00
Açıklama: Akşam servisi için deneyimli veya öğrenmeye açık garson aranıyor.
[Detayları Gör]
```

---

## 18. Örnek İlan Detayı

```text
Başlık: Hafta Sonu Etkinliği İçin Servis Personeli

Açıklama:
Cumartesi günü yapılacak özel etkinlikte servis alanında destek olacak 3 kişi arıyoruz. Daha önce servis deneyimi olan adaylar önceliklidir.

Konum:
İstanbul / Kadıköy / Moda

Tarih:
25 Mayıs 2026

Saat:
15:00 - 23:00

Ücret:
Günlük 1.200 TL

Ödeme:
İş bitiminde

Aranan Kişi Sayısı:
3

İletişim:
WhatsApp üzerinden iletişime geçilebilir.
```

---

## 19. Gelecek Faz Özellikleri

İlerleyen dönemlerde eklenebilecek özellikler:

- Abonelik sistemi
- Öne çıkarılmış ilanlar
- Premium işveren hesabı
- Platform içi mesajlaşma
- İş arayan profili ve deneyim bilgileri
- CV veya belge yükleme
- Puanlama ve yorum sistemi
- İşveren doğrulama rozeti
- Harita üzerinden ilan gösterimi
- Bildirim sistemi
- Favori ilanlar
- Otomatik ilan süresi bitirme
- Aday başvuru takibi
- Bölge bazlı ilan önerileri
- Mobil uygulama

---

## 20. Gelir Modeli Notları

İlk aşamada platform ücretsiz olacaktır. Sonraki dönemlerde aşağıdaki gelir modelleri değerlendirilebilir:

- İşveren aboneliği
- Öne çıkarılmış ilan
- Acil ilan etiketi
- Premium işletme profili
- Bölgesel reklam alanları
- Kurumsal işveren paketi

İlk MVP’de ödeme altyapısı kurulmayacaktır. Ancak mimari, ileride abonelik sisteminin eklenmesine uygun tasarlanmalıdır.

---

## 21. Teknik Beklentiler

Antigravity veya geliştirici aracı için genel teknik beklentiler:

- Responsive web tasarım
- Mobil öncelikli yapı
- Temiz, okunabilir kod yapısı
- SEO uyumlu sayfa başlıkları
- Hızlı yüklenen ilan listeleme
- Form validasyonu
- İlanların 30 gün sonunda otomatik pasife alınması
- İşverenin ilanı 30 gün daha uzatabilmesi
- Kullanıcı rol yönetimi
- Güvenli giriş / kayıt sistemi
- Admin müdahalesine uygun yapı
- Gelecekte ödeme sistemi eklenebilecek esnek mimari

---

## 22. Önceliklendirme

### Öncelik 1

- Kayıt / giriş
- Rol seçimi
- İş ilanı oluşturma
- İş ilanı listeleme
- İş ilanı detay sayfası
- Konum ve kategori filtreleme
- İletişim butonu

### Öncelik 2

- İşveren paneli
- İlan düzenleme
- İlan yayından kaldırma
- Admin paneli
- Şikayet etme özelliği

### Öncelik 3

- Favori ilanlar
- Bildirimler
- Puanlama
- Mesajlaşma
- Abonelik / ödeme sistemi

---

## 23. Netleşen Kararlar

Aşağıdaki kararlar proje sahibi tarafından netleştirilmiştir.

1. Platform adı: Cevrende.com
2. İlk hedef bölge: İstanbul / Pendik ilçesi ve Pendik mahalleleri
3. İşveren tipi: Hem işletmeler hem bireysel kişiler ilan açabilir.
4. Kayıt zorunluluğu: İşverenler ve iş arayanlar kayıt olmalıdır.
5. İletişim görünürlüğü: Tam iletişim bilgileri yalnızca giriş yapan doğrulanmış kullanıcılara gösterilir.
6. İlan onayı: İlan yayınlamak için manuel admin onayı gerekmeyecek.
7. İlan süresi: İlk öneri 30 gündür. Daha sağlıklı MVP önerisi: İlanlar 30 gün yayında kalmalı, işveren isterse panelden tek tıkla 30 gün daha uzatabilmelidir.
8. İşveren doğrulaması: Telefon doğrulaması yapılmalıdır.
9. İş arayan doğrulaması: Telefon doğrulaması yapılmalıdır.
10. Platform içi mesajlaşma: İlk sürümde olmayacaktır.
11. İletişim yöntemi: Telefon üzerinden iletişim kurulacaktır.
12. Ücret bilgisi: İlk sürümde zorunlu olmayacaktır. İleride zorunlu hale getirilebilir.
13. İş kategorileri: Admin sonradan kategori ekleyebilir.
14. Harita: İş konumu olmalı ve tıklandığında Google Maps gibi harita uygulamasında açılmalıdır.
15. Puanlama: İlk sürümde kullanıcılar birbirini puanlamayacaktır.
16. Uygunsuz ilan yönetimi: Sistem otomatik filtreleme yapmalıdır.
17. Admin paneli: İlk sürümde gerekli olacaktır.
18. Abonelik sistemi: İleride hem işverenler hem iş arayanlar için değerlendirilecektir.
19. Dil: Platform yalnızca Türkçe olacaktır.
20. Tasarım dili: Samimi, yerel ve güven veren bir ton kullanılacaktır.

### Hâlâ Netleştirilmesi Faydalı Olan Küçük Kararlar

- İşveren bireysel kişi ise ilanda gerçek ad soyad mı, yoksa sadece “Bireysel İşveren” etiketi mi gösterilecek?
- Telefon numarası maskeleme formatı nasıl olmalı?
- İlan uygunsuz kelime filtresine takılırsa tamamen engellensin mi, yoksa admin incelemesine mi düşsün?
- İş konumu tam adres mi olacak, yoksa mahalle + harita pini yeterli mi?
- Admin panelinde ilk etapta kaç admin olacak?
- İlan süresi dolduğunda otomatik pasife alınan ilana işverene bildirim gönderilecek mi?

---

## 24. Varsayımlar

Bu brief hazırlanırken aşağıdaki varsayımlar yapılmıştır:

- Platform ilk aşamada Türkiye’de, İstanbul / Pendik ilçesi ve Pendik mahalleleri için kullanılacaktır.
- MVP ücretsiz olacaktır.
- İşveren ve iş arayan rolleri ayrıdır.
- İletişim ilk sürümde doğrudan telefon üzerinden kurulacaktır.
- Online ödeme sistemi ilk sürümde olmayacaktır.
- Abonelik sistemi ileride eklenebilecek şekilde mimari esnek bırakılacaktır.
- Mobil kullanım önceliklidir.
- Admin paneli ilk sürüm için gereklidir.
- Kullanıcı güvenliği için en azından telefon veya e-posta doğrulama tavsiye edilir.

---

## 25. Antigravity İçin Kısa Görev Özeti

İstanbul / Pendik ilçesi ve mahalleleri odağında çalışan, Cevrende.com adlı, işverenler ile iş arayanları buluşturan ücretsiz bir web platformu geliştir.

Platformda işletmeler ve bireysel işverenler kayıt olup telefon doğrulamasıyla iş ilanı oluşturabilmeli, iş arayanlar ise kayıt/giriş ve telefon doğrulaması sonrası konum ve kategori bazlı ilanları görüntüleyip ilan detayından telefon üzerinden işverenle doğrudan iletişime geçebilmelidir.

İlk sürümde ödeme veya abonelik sistemi olmayacak. Ancak ileride abonelik ve premium ilan özellikleri eklenebilecek şekilde sistem esnek tasarlanmalıdır.

Temel sayfalar:

- Ana sayfa
- İlan listeleme
- İlan detay
- Kayıt
- Giriş
- İşveren paneli
- İş arayan profil paneli
- Admin paneli

Temel özellikler:

- Kullanıcı kayıt/giriş
- İşveren / iş arayan rol seçimi
- İş ilanı oluşturma
- İlan listeleme
- Filtreleme
- İlan detay görüntüleme
- Telefon ile iletişim
- İşverenin kendi ilanlarını yönetmesi
- Sistemin uygunsuz kelimeleri otomatik filtrelemesi
- Adminin uygunsuz ilanları kaldırabilmesi

Tasarım mobil uyumlu, sade, samimi, güven veren ve hızlı kullanılabilir olmalıdır.
---

## 26. Antigravity İçin Çalışma Yöntemi: Adım Adım Geliştirme

Bu proje Antigravity ile geliştirilirken tek seferde tüm sistemi oluşturmaya çalışılmamalıdır. Token kullanımını azaltmak, hataları daha kolay yakalamak ve sistemi kontrollü büyütmek için adım adım ilerlenmelidir.

### Temel Çalışma Prensibi

Antigravity her aşamada şu yöntemi izlemelidir:

1. Sadece ilgili aşamanın gerektirdiği kodu üret.
2. Üretilen yapıyı kontrol et.
3. Eksik, hata veya çakışma varsa düzelt.
4. Aşama tamamlanmadan bir sonraki modüle geçme.
5. Gereksiz dosya, gereksiz component veya kullanılmayan kod üretme.
6. Her aşamanın sonunda kısa bir kontrol özeti ver.
7. Sonraki aşamaya geçmeden önce mevcut yapının çalışır durumda olduğundan emin ol.

### Önerilen Geliştirme Sırası

#### Aşama 1: Proje Temeli

- Proje yapısını kur.
- Ana layout yapısını oluştur.
- Responsive temel tasarım sistemini hazırla.
- Renk, tipografi, spacing ve buton stillerini tanımla.
- Ana sayfa iskeletini oluştur.

Kontrol:
- Proje hatasız çalışıyor mu?
- Ana sayfa mobil ve masaüstünde düzgün görünüyor mu?
- Gereksiz dosya oluşmuş mu?

#### Aşama 2: Kullanıcı Rolleri ve Auth

- Kayıt ekranını oluştur.
- Giriş ekranını oluştur.
- İşveren / iş arayan rol seçimini ekle.
- Telefon doğrulama akışını tasarla.
- Giriş yapan ve yapmayan kullanıcı ayrımını kur.

Kontrol:
- Kullanıcı kayıt olabiliyor mu?
- Rol bilgisi doğru saklanıyor mu?
- Giriş yapmayan kullanıcı hassas bilgileri göremiyor mu?

#### Aşama 3: İlan Listeleme

- İlan listeleme sayfasını oluştur.
- Pendik mahalle filtrelerini ekle.
- Kategori filtrelerini ekle.
- İlan kartı tasarımını oluştur.
- Ziyaretçiler için maskeleme mantığını uygula.

Kontrol:
- İlanlar doğru listeleniyor mu?
- Filtreler çalışıyor mu?
- Telefon ve ad soyad bilgileri kayıt olmayan kullanıcıya maskeli görünüyor mu?

#### Aşama 4: İlan Detay Sayfası

- İlan detay sayfasını oluştur.
- İş açıklaması, konum, kategori, tarih ve iletişim alanlarını göster.
- Tam iletişim bilgisini yalnızca giriş yapan ve doğrulanmış kullanıcıya göster.
- Harita bağlantısını ekle.

Kontrol:
- Giriş yapmayan kullanıcı tam iletişim bilgisi göremiyor mu?
- Giriş yapan doğrulanmış kullanıcı telefon bilgisini görebiliyor mu?
- Harita bağlantısı doğru çalışıyor mu?

#### Aşama 5: İşveren Paneli

- İşveren panelini oluştur.
- Yeni ilan oluşturma formunu ekle.
- İlan düzenleme ve yayından kaldırma özelliklerini ekle.
- 30 günlük ilan süresi ve uzatma mantığını kur.

Kontrol:
- İşveren ilan oluşturabiliyor mu?
- İlan düzenleyebiliyor mu?
- İlan 30 gün sonra pasife alınacak şekilde yapılandırılmış mı?
- İşveren ilanı 30 gün daha uzatabiliyor mu?

#### Aşama 6: Otomatik Filtreleme

- Uygunsuz kelime filtresini ekle.
- Pornografik, +18, küfür, hakaret, kötüye kullanım ve dolandırıcılık çağrışımı yapan kelimeleri engelle.
- Filtreye takılan ilanları yayınlama veya admin incelemesine düşürme mantığını kur.

Kontrol:
- Uygunsuz kelimeler yakalanıyor mu?
- Temiz ilanlar yanlışlıkla engellenmiyor mu?
- Filtre sonucu kullanıcıya anlaşılır şekilde gösteriliyor mu?

#### Aşama 7: Admin Paneli

- Admin giriş yetkisini oluştur.
- Kullanıcıları görüntüleme ekranını ekle.
- İlanları görüntüleme ekranını ekle.
- Kategori ekleme / düzenleme / pasifleştirme özelliğini ekle.
- Uygunsuz ilanları kaldırma özelliğini ekle.

Kontrol:
- Admin olmayan kullanıcı admin paneline erişemiyor mu?
- Admin kategori yönetebiliyor mu?
- Admin ilan kaldırabiliyor mu?

#### Aşama 8: Son Kontrol ve Temizlik

- Kullanılmayan kodları temizle.
- Responsive kontrolleri yap.
- Form validasyonlarını test et.
- SEO başlıklarını kontrol et.
- Hata mesajlarını düzenle.
- Gereksiz tekrarları azalt.
- Dosya yapısını sadeleştir.

Kontrol:
- Site mobilde sorunsuz çalışıyor mu?
- Kullanıcı akışları tamamlanabiliyor mu?
- Gereksiz token ve kod şişkinliği oluşturan tekrarlar kaldırıldı mı?

### Token Kullanımını Azaltma Kuralları

Antigravity şu kurallara uymalıdır:

- Aynı anda tüm projeyi üretmeye çalışma.
- Her seferinde yalnızca aktif aşamaya odaklan.
- Daha önce yazılmış çalışan kodu gereksiz yere yeniden yazma.
- Büyük componentler yerine küçük, tekrar kullanılabilir componentler oluştur.
- Gereksiz açıklama, demo veri ve yorum satırı üretme.
- Dosya yapısını sade tut.
- Önce çalışır MVP, sonra geliştirme mantığıyla ilerle.
- Her aşamada sadece gerekli dosyalara müdahale et.
- Bir sorun çıktığında tüm projeyi baştan yazmak yerine ilgili dosyayı düzelt.

### Antigravity’ye Verilecek Kısa Komut

Bu projeyi tek seferde tamamen üretme. Aşamalar halinde ilerle. Her aşamada yalnızca gerekli dosyaları oluştur veya güncelle. Aşama sonunda sistemi kontrol et, hataları düzelt ve kısa bir özet ver. Bir aşama tamamlanmadan sonraki aşamaya geçme. Token kullanımını azaltmak için tekrar eden kod üretme, çalışan yapıyı gereksiz yere yeniden yazma ve her zaman küçük, kontrollü değişiklikler yap.

