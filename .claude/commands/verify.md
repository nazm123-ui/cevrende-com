---
description: Tüm sayfaları, route'ları ve linkleri statik olarak doğrula — kırık link, eksik route, console error
---

Cevrende.com'un sayfa/route bütünlüğünü doğrula. Browser açmadan, kodun kendi kendine tutarlı olup olmadığını kontrol et.

## Kontrol listesi

### 1. Route envanteri
- `src/app/` altındaki tüm `page.tsx` dosyalarını listele → public URL haritası çıkar
- Her sayfa metadata (`title`, `description`) export ediyor mu?
- Dinamik route'ların ([id], [slug]) `notFound()` davranışı tanımlı mı?

### 2. Kırık iç link tarama
- Tüm `<Link href="...">` ve `router.push("...")` çağrılarını bul
- Her href hedefi `src/app/` altında mevcut bir route'a denk geliyor mu?
- 404'e gidecek linkleri raporla: dosya:satır → kırık href

### 3. API çağrı tutarlılığı
- Client tarafında `fetch("/api/...")` çağrıları → ilgili route handler var mı?
- HTTP metodu eşleşiyor mu (POST gönderiliyor ama route sadece GET export ediyor olabilir)?

### 4. Component import sağlığı
- `import X from "@/..."` → dosya var mı, export ediyor mu?
- Default vs named export karışıklığı var mı?

### 5. Responsive class denetimi
- Her sayfa container'ı `max-w-` ve `px-` set ediyor mu?
- Sadece `flex` kullanılan yerler `flex-wrap` veya `gap` eksikliği yüzünden mobilde taşıyor mu? Şüpheli noktaları işaretle.
- `sm:`, `md:` breakpoint kullanım tutarlılığı

### 6. Tailwind sınıf geçerliliği
- `text-ink-1000`, `bg-brand-50` gibi var olmayan utility class kullanımı var mı? (`globals.css` @theme'de tanımlı renklerle karşılaştır)
- `btn-ink`, `btn-light` gibi custom class'lar tanımlı yerlerde kullanılıyor mu?

### 7. Form aksesibilitesi
- `<input>` için `<label>` veya `aria-label` var mı?
- Submit butonları `type="submit"` belirtiyor mu?
- Form alanlarında autocomplete attribute mantıklı mı?

### 8. Konsol/build hataları
- `npm run build` (varsa veya `next build`) çalıştırıp çıktıyı incele
- TypeScript hataları, ESLint warning'leri raporla

## Çıktı formatı

```
✅ Sağlam: 23 sayfa, 87 iç link

❌ Kırık linkler (3)
- src/components/X.tsx:42 → /eksik-sayfa
- ...

⚠️ Şüpheli responsive (2)
- src/app/foo/page.tsx:18 — flex container, mobilde taşabilir

🔧 Tailwind temizliği
- src/components/Bar.tsx:9 — text-ink-1000 (yok, ink-900 olmalı)

📦 Build durumu
- npm run build: 0 error / 2 warning
```

Sadece somut, eyleme dönük bulgular. "Genel olarak iyi görünüyor" gibi övgü yazma.
