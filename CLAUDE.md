# Cevrende.com

## Proje Özeti
İstanbul'da işçi ve işveren eşleştirmesi yapan platform. PostgreSQL (Neon) + Next.js + Prisma.

Şu anki sistem: İşverenler iş ilanları yayınlıyor, işçiler başvuruyor.

---

## Yeni Feature: İşçi Profili & Arama Sistemi

### Gereksinimler
1. Kayıtlı işçiler mesleklerini kaydedebilirler
2. Diğer kişiler işçileri meslek/bölge ile arayabilirler
3. **Fotoğraf kullanmıyoruz** (depolama maliyeti)
4. Güvenlik: Direkt numara paylaşılmaz

### Tasarım: 2+1 Kombinasyonu

**Platform Mesajlaşma (Tier 1)**
- Tüm iletişim başında platform içi mesaj üzerinden
- Numara asla paylaşılmaz

**İletişim Talep Sistemi (Tier 2)**
- Birisi işçiye "Teklif Gönder" → işçiye bildirim
- İşçi onay verirse, mesajlaşma aktif olur
- Istenmeyen erişim kontrol altında

**Gizlilik Kontrolleri (Tier 3)**
- İşçi kendi profili için hangi bilgiyi kimlere gösterecek ayarlayabilir
- Örn: Meslek herkese, isim/bölge sadece teklif verenler, numara sadece mesajlaştıktan sonra
- Mesajlaştıktan sonra isteğe bağlı WhatsApp/telefon linkine geç

### Veritabanı Değişiklikleri (Taslak)
```
User tablosuna:
- professions: String[] (JSON) — meslekler
- bio: String — kısa özgeçmiş
- workerSettings: JSON — gizlilik ayarları

Yeni tablo: Message
- id, senderId, recipientId, content, createdAt
- read, readAt

Yeni tablo: ContactRequest
- id, fromUserId, toWorkerId, status, createdAt
```

---

## Implementation Sırası (TO-DO)

1. **Veritabanı** — User'a professions/bio eklemek, Message + ContactRequest tabloları
2. **Worker Profili Sayfası** — İşçi kendi mesleklerini yazıyor
3. **Worker Arama Sayfası** — Filtreleme (meslek, bölge), arama
4. **Mesajlaşma API'si** — Backend
5. **İletişim Talep Sistemi** — Frontend + Backend
6. **Gizlilik Ayarları Paneli** — Worker'ın kontrol edebileceği bilgi görünürlüğü

---

## Mevcut Yapı Referansları
- User model: role, fullName, email, phone, city, district
- JobCategory: meslekler (var olan kategoriler kullanılabilir)
- Pages: /giris, /kayit, /panel, /ilanlar, /dogrulama

---

## Ajanlar (Kurulu Araçlar)

Geliştirme esnasında siteyi kontrol etmek için 4 ajan kullanılıyor. Her biri farklı bir görev yapar:

### 1. 🔒 **Güvenlik Kontrolü Ajanı**
**Komut:** `/security-review`

**Ne Yapar?**
- Kod taraması yapıyor
- Gizli bilgilerin korunduğunu kontrol ediyor (şifreler, token'lar)
- XSS, SQL injection, CSRF gibi siber saldırı açıklarını bulunduyor
- Kullanıcı verilerinin güvenli saklandığını kontrol ediyor

**Ne Zaman Çalıştır?**
- Yeni feature yazdığında
- Veritabanı değişikliği yaptığında
- Haftalık periyodik kontrol

**Neden Önemli?** İşçi numarası, adres, şifre gibi gizli bilgiler çalınabilir. Bu ajan bunları korur.

---

### 2. 🎯 **E2E Test Ajanı (Kullanıcı Simülasyonu)**
**Komut:** `/loop` (E2E test senaryoları)

**Ne Yapar?**
- Gerçek bir kullanıcı gibi davranır
- Siteye giriş yapıyor, kayıt oluyor, iş arıyor, mesaj gönderiyor
- Tüm bu işlerin sorunsuz çalıştığını kontrol ediyor
- Eğer form kırık, button çalışmıyor, vb. olursa bulur

**Simülasyon Senaryoları:**
1. İşçi kayıt ol → Profil oluştur → İş ara
2. İşveren kayıt ol → İlan yayınla → İşçi arama
3. Mesajlaşma sistemi → Mesaj gönder → Cevap al
4. Teklif sistemi → Teklif gönder → İşçi onay ver

**Ne Zaman Çalıştır?**
- Yeni sayfalar ekledikten sonra
- Büyük değişiklikler yaptıktan sonra
- Canlı yapmadan önce

**Neden Önemli?** Bir işçi kaydı olmak istedi ama form hatası çıktı mı? Bu ajan bulur.

---

### 3. 🎨 **Arayüz Kontrolü Ajanı**
**Komut:** `/verify`

**Ne Yapar?**
- Tüm sayfaları açıyor ve kontrol ediyor
- Tasarım düzgün mi, butonlar çalışıyor mu bak
- Telefonlarda görünüm düzgün mü (responsive)
- Broken link'ler, eksik görseller findable
- Erişilebilirlik kontrol (renk karşıtlığı, font büyüklüğü)

**Ne Zaman Çalıştır?**
- Tasarım değişikliği yaptıktan sonra
- Yeni sayfa ekledikten sonra
- Stiller güncelledikten sonra

**Neden Önemli?** Biri siteye girdi ama sayfalar çirkin görünüyor, butonlar kırık = kullanıcı kaybı.

---

### 4. 🔌 **API Test Ajanı**
**Komut:** `/code-review` (API validasyonu)

**Ne Yapar?**
- Tüm API endpoint'lerini test ediyor
- Backend'e veri gönderip doğru dönüş aldığını kontrol ediyor
- API error'larını, timeout'ları kontrol ediyor
- Database'e veri doğru yazıldığını kontrol ediyor

**Test Edilen Endpoint'ler:**
- `/api/auth/register` — Kayıt
- `/api/auth/login` — Giriş
- `/api/messages` — Mesajlaşma
- `/api/profile` — Profil işlemleri
- `/api/workers` — İşçi arama
- vb.

**Ne Zaman Çalıştır?**
- Backend kodu değiştirdikten sonra
- Database query'lerini güncellendikten sonra
- Yeni API endpoint ekledikten sonra

**Neden Önemli?** Frontend'in (arayüz) istekleri gidiyor ama API çöp veri dönerseya çökmeseyse = sessiz ama ciddi hata.

---

## Ajan Çalıştırma Hızlı Rehberi

```bash
# Güvenlik kontrolü
/security-review

# Arayüz kontrol + test
/verify

# API validasyonu
/code-review

# E2E senaryoları (uzun çalışır, lokal)
npm run test:e2e
```

---

## Hangi Ajanı Ne Zaman Çalıştır? (Checklist)

| Durumda | Çalıştır |
|---------|----------|
| Yeni feature yazdın | ✅ security-review + verify |
| Tasarım değiştirdin | ✅ verify |
| Backend API kodu değiştirdin | ✅ code-review |
| Canlı yapmadan önce | ✅ Tüm 4 ajanı çalıştır |
| Her gün sabah başında | ✅ security-review |
| Haftalık periyodik | ✅ Tüm 4 ajanı çalıştır |
