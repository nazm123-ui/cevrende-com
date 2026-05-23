---
description: API endpoint ve backend kod kalite denetimi — validation, hata yönetimi, prisma, response tutarlılığı
---

Cevrende.com'un API kalitesini ve backend kod sağlığını incele. `src/app/api/` altındaki her endpoint'i ve `src/lib/` altındaki destek modülleri gözden geçir.

## Kontrol listesi

### 1. Endpoint envanteri
Her API route için:
- HTTP metodu (GET/POST/PATCH/DELETE)
- Auth zorunlu mu? (`requireAuth`, `requireAdmin`)
- Input validation (zod schema) var mı?
- Response shape tutarlı mı? (`{ ok: true, data }` veya `{ error, issues }` standardı)

### 2. Hata yönetimi
- Try/catch eksik route'lar
- `console.error` ile loglanıyor mu, yoksa sessizce yutuluyor mu?
- Hata mesajlarında stack trace / internal detail sızıyor mu?
- Kullanıcıya dönen mesajlar Türkçe ve anlaşılır mı?

### 3. Prisma query kalitesi
- N+1 sorgu pattern'leri var mı? (`map` içinde `findUnique`)
- Gereksiz `include` ile büyük payload çekimi
- Hassas alanların (passwordHash, otpHash, sessionToken) `select` ile çıkarıldığından emin ol
- Transaction gereken yerlerde (kontak talep + bildirim) `prisma.$transaction` kullanılıyor mu?

### 4. Validators
- `src/lib/validators.ts` — schema'lar test edilebilir mi? Reusable mi?
- Magic number/string'ler constants'a çıkarılmış mı?

### 5. Lib modüller
- `src/lib/auth.ts`, `src/lib/workers.ts`, `src/lib/contact-requests.ts`, `src/lib/messages.ts`, `src/lib/content-filter.ts`, `src/lib/phone-visibility.ts`
- Her birinin tek bir sorumluluğu var mı?
- Ölü kod (kullanılmayan export, eski helper) var mı?

### 6. Type safety
- `any` kullanımı (`grep -rn ": any\b" src/`)
- `as` cast'leri — gerekli mi, yoksa tip tanımı eksik mi?

### 7. Performans
- API route'larında gereksiz `await` zincirleri (paralel olabilecek `Promise.all`)
- Listeleme endpoint'lerinde pagination var mı? Yoksa N gigantik response gelebilir mi?

### 8. Tutarlılık
- Naming: bazen `workerId`, bazen `userId` — projede tek bir konvansiyon var mı?
- Date alanları: `Date` vs `string` (ISO) — API sınırında tutarlı mı?

## Çıktı formatı

```
📊 ENDPOINT ÖZETİ (12 route)
- POST /api/auth/register     auth: ❌   zod: ✅
- ...

🔧 İYİLEŞTİRMELER (öncelik sırasına göre)
1. [Yüksek] src/app/api/X/route.ts:42 — N+1 sorgu, Promise.all'a çevir (kod örneği)
2. [Orta]   src/lib/Y.ts:18 — `any` tipi, IUser ile değiştir
3. ...

♻️ ÖLÜ KOD
- src/lib/foo.ts — formatBaz() kimse import etmiyor

🎯 TUTARLILIK
- API response shape 3 farklı stilde dönüyor — birleştirme önerisi
```

Bulguların her birinin **mevcut kod parçası → önerilen kod parçası** karşılaştırmasıyla gel.
