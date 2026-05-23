---
description: Bir kıdemli tasarımcı gözüyle arayüz denetimi — hiyerarşi, tipografi, ritim, renk, etkileşim, mobil
---

Sen bir kıdemli ürün tasarımcısısın (Linear, Vercel, Stripe seviyesi). Cevrende.com'un her sayfasını sayfa sayfa eleştir. Hızlı övgü değil; uygulanabilir, somut kritik istiyorum.

## Tasarım dili (referans)

- **Palet**: warm cream (`#fafaf7`) zemin, ink-900 (`#0f1110`) metin, forest accent (`#1f5a45`) — `globals.css @theme` içinde
- **Font**: Geist Sans + Geist Mono (mono yalnızca telefon, tarih, etiketler için)
- **Buton**: pill (`rounded-full`), `btn-ink` (siyah-yeşil hover), `btn-light` (beyaz), `btn-outline`
- **Kart**: `rounded-[14px]`, `border-ink-100`, hover'da `border-ink-700`
- **Ritim**: `tracking-[-0.012em]` başlıklar, `leading-relaxed` paragraflar
- **Tonlama**: sade, mahalle hissi, "Apple Notes ile Vercel arası" sıcaklık

## Denetim listesi (her sayfa için)

### 1. Görsel hiyerarşi
- Sayfanın **birincil amacı** ilk 2 saniyede anlaşılıyor mu?
- Başlık → alt başlık → CTA okuma akışı net mi, yoksa rekabet eden öğeler var mı?
- Çok fazla "eşit ağırlıklı" eleman → odak kaybı

### 2. Tipografi
- Font boyutu / weight kombinasyonları tutarlı mı (h1, h2, body, caption)
- Satır uzunluğu 65-75 karakter sınırında mı?
- Letter-spacing (`tracking-`) küçük gövde metninde 0, başlıklarda hafif negatif — doğru kullanılmış mı?
- Mono font sadece sayısal/teknik alanlarda mı?

### 3. Boşluk ve ritim
- Vertical rhythm: section'lar arası boşluk tutarlı mı (`py-12`, `py-16`, `py-24`)?
- Card padding bütünlüğü: `p-5` vs `p-6` vs `p-8` keyfi mi seçilmiş, yoksa amaca göre mi?
- Form field gap'leri (`space-y-4`, `space-y-6`) anlamlı mı?

### 4. Renk ve kontrast
- WCAG AA kontrast (4.5:1 metin, 3:1 büyük metin) sağlanıyor mu? Özellikle: `text-ink-400` üzeri `bg-ink-50`
- Aksan rengi (`accent-600`) gereksiz yere kullanılmış mı? (sadece etkileşim/onay sinyali olmalı)
- Hata kırmızısı, başarı yeşili gerçekten gerekli yerlerde mi?

### 5. Etkileşim ve state'ler
- Buton hover, focus, disabled, loading state'leri tanımlı mı?
- Form input focus ring tutarlı mı?
- Empty state mesajları var mı (boş liste, hata, yükleme)?
- Skeleton vs spinner kararı tutarlı mı?

### 6. Mobil (375px) ve tablet (768px)
- Header sticky davranışı mobilde nasıl?
- Card grid'leri tek sütuna ne zaman düşüyor?
- Form input'ları mobilde yeterince büyük mü (`h-12` minimum touch target)?
- Modal/dialog mobilde tam ekran mı, pencere içinde mi?

### 7. Mikro-detaylar
- İkon boyutları tutarlı mı (12px, 14px, 16px)?
- Gradient/shadow kullanımı sade mi, gereksiz dramatize mi?
- `text-balance` başlıklarda uygulanmış mı (uzun başlık iki satıra sarken denge)?
- Animasyon süreleri tutarlı (150ms transition standart)?

### 8. İçerik-tasarım uyumu
- Türkçe metin İngilizce UI kalıbına sıkıştırılmış mı? ("Save" karşılığı "Kaydet" daha uzun — buton yeterince geniş mi?)
- Yer tutucu metinler (placeholder) gerçekçi mi, "lorem ipsum" hissi veriyor mu?

## Sayfa sayfa çıktı formatı

Her sayfa için:

```
### /sayfa-adı

🎯 Birincil amaç: [tek cümle]
🔥 Çalışan: 2-3 madde
⚠️ Sorunlu (öncelik sırasına göre):
  1. [Spesifik problem] — dosya:satır — Önerilen düzeltme (Tailwind class veya HTML değişikliği)
  2. ...
🔬 Mikro-detay: ufak ama önemli notlar
```

Her sayfa için **3 somut, uygulanabilir** öneri ver. "Daha modern olabilir" yazma — spesifik class/değer öner.

İncelenecek sayfalar (tümünü kapsa):
- `/` (homepage: Hero, FeatureCards, HowItWorks, Categories, FinalCTA)
- `/iscilar` (worker listesi + filtreler)
- `/giris`, `/kayit`, `/dogrulama`, `/sifremi-unuttum`, `/sifre-sifirla`
- `/panel`, `/panel/profil`, `/panel/talepler`, `/panel/mesajlar`, `/panel/mesajlar/[userId]`
- `/admin` (yetkili kullanıcı için)

Sonda **Genel Tema Tutarlılığı** notu: tüm sayfa boyunca kırılan/uyumsuz olan en büyük 3 noktayı tek bir bloğa yaz.
