# Changelog — Cevrende.com

Tüm önemli değişiklikler bu dosyada toplanır. Ters kronolojik sırada (en üstte en yeni).

---

## 2026-05-27 — İkinci Kullanıcı Testi Düzeltmeleri (11 madde)

### 🐛 Bugfix
- **Mesaj gönder hatası giderildi.** `/panel/mesajlar/[userId]/page.tsx` içindeki gereksiz `revalidatePath("/", "layout")` çağrısı kaldırıldı. Sayfa `force-dynamic` olduğu için Header zaten her navigasyonda taze sayım çekiyor.
- **Admin paneline ulaşım sağlandı.** `prisma/seed-admin.ts` çalıştırıldı, `infocevrende@gmail.com` / `demo1234` admin kullanıcısı DB'de mevcut. Bu hesapla giriş yapınca Header'da "Admin" linki belirir.

### ✨ Yeni Özellik — Profili Kaydet (DB persistence)
- Yeni Prisma modeli: `SavedProfile` (userId, savedUserId, createdAt) — `prisma/schema.prisma`
- Yeni API: `src/app/api/saved-profiles/route.ts` — `GET` (kaydedilen liste), `POST` (kaydet), `DELETE` (kaldır)
- `WorkerContactCard` artık bookmark ikonu gösteriyor; tıklanınca optimistic state + DB kaydı yapılıyor
- Buton sadece **giriş yapmış ve e-postası doğrulanmış** kullanıcılar için görünür (`canContact` gate)
- `Icon.tsx`'e `bookmark` (boş) ve `bookmark-filled` (dolu) ikonları eklendi
- `cevrendekiler/[id]/page.tsx` ön yüklemede `initialSaved` hesaplayıp kart'a geçiriyor

### 🎨 UI / UX
- **Hızlı Arama (anasayfa)** — input/select ikonları metinle çakışmıyor: padding `pl-12` → `pl-14`, ikon konumu `left-4` → `left-5`, dikey hizalama `flex items-center`
- **Header** — desktop nav'dan "Çevrendekiler" linki kaldırıldı (Hero CTA + Hızlı Arama yeterli)
- **MobileMenu** — mobil drawer'dan da "Çevrendekiler" linki kaldırıldı
- **Hero** — Logged-in kullanıcı için "İş arayanları gör" + "Ücretsiz profil oluştur" CTA'ları artık görünmez (gereksiz tekrar)
- **Şifre kuralları görsel checklist** — `/kayit`'te şifre yazılırken altta 4 kural canlı koyulaşır/açılır (PasswordChecklist component'i)
- **ProfileForm Section başlıkları** — `font-semibold` (16px+ default) → `text-[15px] font-semibold tracking-tight`, hint `text-[12px]`, padding `p-4 sm:p-5`
- **CompactRadio / CompactToggle** — radio dairesi ve checkbox: 16×16 → 14×14, label `13.5px`, desc `12px`, gap `2.5` → `2`
- **Gizlilik kart** — "Telefon görünürlüğü" alt başlığı `text-sm` → `text-[13px]`, radio container `space-y-1.5` → `space-y-1`
- **İş Deneyimi Editor** — "Hâlâ devam ediyor" full-width checkbox kaldırıldı; yerine **MiniSwitch** (28×16 toggle) bitiş yılı label'ının yanına eklendi. Switch açıkken bitiş yılı select'i `opacity-50` ve disabled, içinde "Devam ediyor" placeholder gösteriliyor.

### 📚 Dokümantasyon
- Yeni `docs/CHANGELOG.md` dosyası — tüm önemli değişiklikleri ters kronolojik kaydeder

---

## 2026-05-26 — Birinci Kullanıcı Testi Düzeltmeleri (22 madde)

### 🏠 Anasayfa
- FAQ üst boşluğu daraltıldı (`py-20` → `pt-6 pb-20`)
- Hızlı Arama ikon padding ilk düzeltme (`pl-11` → `pl-12`, yetersizdi → 2026-05-27'de daha geniş yapıldı)
- Hero "Ücretsiz profil oluştur" butonu giriş yapmış kullanıcılar için gizlendi

### 🔍 Çevrendekiler
- Route taşıması: `/iscilar` → `/cevrendekiler`
- Üst başlık ("Pendik ve çevresindeki ustalar") kaldırıldı
- Kartlara tıklayınca profil sayfası açılıyor (`WorkerCard`'da avatar + isim alanı `<Link>` ile sarıldı)
- "Teklif Gönder" → "Mesaj gönder" (direkt mesajlaşma)

### 👤 Profil Paneli
- 3 sekmeli yapı: Özet / Hesap Ayarları / Profil Ayarları
- "Profilimi gör" butonu kaldırıldı
- **Hesap Ayarları:** Ad ve Mahalle düzenlenebilir (dropdown), e-posta/telefon read-only
- **Profil Ayarları:** Meslek autocomplete, Hakkımda zorunlu min 30 karakter, iş deneyimi Hakkımda altına taşındı
- Telefon görünürlüğü: 3 seçenek → **2 seçenek** (Herkese açık / Sadece mesajlaşma)
- "Adımı göster" toggle kaldırıldı — ad her zaman görünür
- Mahalle kapalıysa görünmez (mevcut showDistrict mantığı korundu)

### 📨 Talep Sistemi Tamamen Kaldırıldı
- `ContactRequest` modeli, ilgili API'ler (`/api/contact-requests`), `/panel/talepler` sayfası ve UI bileşenleri silindi
- `/api/messages` artık `canMessageWorker` kontrolü yapmıyor — herkes herkese direkt mesaj atabilir

### 🪪 Header & Logo
- Logo: "çevrende" → "Çevrende" (baş harf büyük)
- "Talepler" linki kaldırıldı (talep sistemi kalktığı için)

### 🔐 Kayıt & Giriş
- Telefon normalize: `+90`, `90`, `0`, `5` ile başlayan formatlar → DB'de `0XXXXXXXXXX` (11 hane)
- Şifre kuralı: 8+ karakter, 1 büyük harf, 1 sayı, 1 noktalama
- Şifre tekrar alanı eklendi (eşleşme kontrolü)
- Mahalle dropdown'u zorunlu (Pendik mahalle listesinden)
- Giriş sayfasında "Hesabın yok mu?" alt boşluğu azaltıldı

### 🗂️ Yeni Sayfalar
- `/yardim` — FAQ tarzı yardım merkezi
- `/geri-bildirim` — geri bildirim formu + `/api/feedback` endpoint

### Footer
- "Yardım merkezi" ve "Geri bildirim" linkleri aktif edildi (önceden disabled span'di)

---

## 2026-05-25 ve Öncesi — Tasarım Uygulaması ve Backend Temeli

Detaylı git geçmişi için `git log` kullanın. Önemli kilometre taşları:

- **2026-05-23** — Admin için "Profilim" linki gizlendi (Header + Mobile drawer), admin seed scripti eklendi (`prisma/seed-admin.ts`)
- **2026-05-22** — Admin paneli: istatistikler, kullanıcı yönetimi, raporlar
- **2026-05-21** — 20 demo işçi seed scripti (`prisma/seed-demo-workers.ts`)
- **2026-05-20** — Drawer React Portal ile body'ye taşındı (Header backdrop-blur stacking context fix)
- **Daha öncesi** — Hero / İşçi listesi / Profil paneli / Mesajlaşma tasarımları uygulandı, Prisma + Neon kuruldu, OTP doğrulama akışı (telefon + e-posta) eklendi, JobCategory tablosu seed edildi
