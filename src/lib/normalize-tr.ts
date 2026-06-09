// Türkçe harf duyarsız metin normalizasyonu.
// Aramada "oğuz" ile "oguz", "öğretmen" ile "ogretmen" eşit sayılsın diye
// hem sorguya hem de aranan metne (isim/açıklama/meslek) uygulanır.
// Hem istemci (otomatik tamamlama) hem sunucu (arama) tarafında kullanılır,
// bu yüzden React'tan bağımsız saf bir yardımcıdır.
export function normalizeTr(s: string): string {
  return s
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/â/g, "a")
    .replace(/î/g, "i")
    .replace(/û/g, "u");
}
