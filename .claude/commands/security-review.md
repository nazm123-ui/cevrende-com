---
description: Cevrende.com güvenlik denetimi — secrets, auth, input validation, IDOR, XSS, rate limiting
---

Cevrende.com kod tabanını güvenlik açısından denetle. Tüm bulguları **kritik → yüksek → orta → düşük** olarak grupla, her birinin için dosya:satır referansı ver.

## Kontrol listesi

### 1. Secrets & ortam değişkenleri
- `.env` ve `.env.local` git'e dahil mi? `.gitignore` doğru mu?
- Kod içinde hardcoded API key / şifre / token var mı? (`grep -rn "sk_\|secret\|password.*=.*\"" src/`)
- `process.env.X` çağrıları null-safe mi? Production'da eksik env değişkeni varsa ne olur?

### 2. Auth & yetki
- `src/lib/auth.ts` — JWT secret rotasyonu, session expiry, cookie flag'leri (httpOnly, secure, sameSite)
- `src/lib/require-auth.ts` — her korumalı route'ta çağrılıyor mu?
- `src/lib/constants/admin-emails.ts` — admin allowlist mantığı sağlam mı? Race condition yok mu?
- Email doğrulama atlatılabilir mi? Doğrulanmamış kullanıcı hangi action'ları yapabilir?

### 3. Input validation (zod)
- `src/app/api/*/route.ts` altındaki her POST/PATCH/DELETE zod ile validate ediliyor mu?
- `src/lib/validators.ts` schema'larında max length, regex constraint, enum sıkı mı?
- Body parse hatası graceful mi? Stack trace sızdırıyor mu?

### 4. IDOR (Insecure Direct Object Reference)
- `/api/messages`, `/api/contact-requests`, `/api/profile` — userId parametresi session user ile eşleşiyor mu, yoksa istemcinin gönderdiğine güveniyor mu?
- Mesaj thread'lerinde başkasının konuşmasını okuma açığı var mı?

### 5. Content filter & XSS
- `src/lib/content-filter.ts` — bypass yolları (zalgo unicode, homoglyph, base64) var mı?
- React JSX'te `dangerouslySetInnerHTML` kullanılıyor mu? Markdown render varsa sanitize ediliyor mu?

### 6. Rate limiting & abuse
- Register / login / OTP / contact-request endpoint'lerinde rate limit var mı? Yoksa açıkça not düş.
- Brute-force korumalı mı?

### 7. Database
- Prisma raw query (`$queryRaw`) kullanılıyor mu? Parametreli mi?
- Soft delete vs hard delete tutarlı mı?

### 8. Üçüncü taraf
- nodemailer SMTP credentials nasıl saklanıyor?
- next.config + headers (CSP, X-Frame-Options) eksik mi?

## Çıktı formatı

```
🔴 KRİTİK
- [Başlık] — dosya:satır — Açıklama — Önerilen düzeltme (kod parçası)

🟠 YÜKSEK
...

🟡 ORTA
...

🟢 DÜŞÜK / İYİLEŞTİRME
...
```

Bulduğun her açığın **somut bir exploit senaryosu** olsun ("kötü niyetli kullanıcı X yaparsa Y kazanır"). Sadece güzel-olur önerilerinde bulunma; gerçek riskler önce.
