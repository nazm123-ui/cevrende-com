---
description: E2E kullanıcı senaryolarını adım adım kontrol et — kayıt, giriş, profil, arama, mesajlaşma
---

Cevrende.com'un kritik kullanıcı yolculuklarını **kod düzeyinde** simüle et. Her senaryoda hangi route'a/komponente/state'e gidildiğini izle, kırılma noktalarını işaretle.

## Senaryolar

### Senaryo 1: Yeni kullanıcı kaydı + email doğrulama
1. `/kayit` GET → `RegisterForm` mount oluyor mu?
2. Form submit → `POST /api/auth/register` → User row + OTP token oluşuyor mu?
3. Email gönderimi (`sendVerificationEmail`) — env eksikse ne olur?
4. `/dogrulama` GET → token query parsing
5. `POST /api/auth/verify-email` → user.emailVerifiedAt set ediliyor mu, session cookie set ediliyor mu?
6. Doğrulama sonrası `/panel` redirect zinciri çalışıyor mu?

### Senaryo 2: Çevredeki kişileri arama
1. Public visitor `/iscilar` GET → `getActiveWorkers` çağrısı
2. `WorkerFilters` ile meslek + mahalle seçimi → query param'lara yansıyor mu?
3. `WorkerCard` render — masking doğru çalışıyor mu? (showName false → maskName)
4. phoneVisibility="public" worker → non-member kart üzerinde tel: butonu görüyor mu?
5. Sayfalama / boş sonuç durumu

### Senaryo 3: Profil oluşturma (worker olma)
1. `/panel/profil` GET → `ProfileForm` initial state mevcut User verilerinden geliyor mu?
2. Profession checkbox max-5 enforcement
3. phoneVisibility radio değişimi
4. `PATCH /api/profile` → workerSettings JSON doğru güncelleniyor mu?
5. router.refresh() sonrası UI gerçekten yeni state'i mi gösteriyor?

### Senaryo 4: İletişim talebi flow
1. Kayıtlı kullanıcı bir worker kartında `ContactRequestButton` tıklar
2. Modal açılır → mesaj yazılır → `POST /api/contact-requests`
3. Worker'da `requestStatus = "pending"` görünür mü? Kendi panelinde `/panel/talepler` listesinde mi?
4. Worker kabul eder → `PATCH /api/contact-requests/[id]` (status: "accepted")
5. Talep gönderen artık `/panel/mesajlar/[workerId]` thread'e erişebiliyor mu?

### Senaryo 5: Mesajlaşma
1. Thread sayfası mount → eski mesajlar yükleniyor mu?
2. Yeni mesaj submit → `POST /api/messages` → content filter geçiyor mu?
3. Küfür/URL/telefon içeren mesaj → 400 dönüyor mu, hata mesajı Türkçe mi?
4. Karşı taraf mesajı görüyor mu? (refresh / polling stratejisi nedir?)

### Senaryo 6: Şifremi unuttum
1. `/sifremi-unuttum` → email girişi
2. `POST /api/auth/forgot-password` → reset token oluşturulur, email gönderilir
3. `/sifre-sifirla?token=...` → token validation
4. Yeni şifre set → otomatik giriş veya `/giris` redirect?

### Senaryo 7: Admin paneli
1. `infocevrende@gmail.com` ile giriş yap → `/admin` erişimi var mı?
2. Başka email ile `/admin` → 403/redirect?
3. Admin kullanıcı listesi, sorun bildirimleri vs.

## Çıktı formatı

Her senaryo için:

```
### Senaryo N: [İsim]
✅ Çalışan adımlar: 1, 2, 3
❌ Kırık: Adım 4 — dosya:satır — neden + önerilen düzeltme
⚠️ Şüpheli: Adım 6 — race condition / edge case açıklaması
```

Sonda **Kırılma Özeti**: kaç senaryoda kaç adım sağlam, en kritik 3 hata hangi.

Browser açma; dosya okuma + kod izleme yeterli. Test üretme; sadece denetle.
