// KVKK uyumu: log/analytics alanlarına PII düşmesini engellemek için.
// Sıralama önemli: önce e-posta ve TCKN, sonra telefon (e-posta sayıları
// önce yakalanmasın).

const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const TCKN_RE = /\b[1-9]\d{10}\b/g;
const PHONE_RE =
  /(?:\+?9?0[\s\-.]?)?5\d{2}[\s\-.]?\d{3}[\s\-.]?\d{2}[\s\-.]?\d{2}/g;

export function redactPii(input: string): string {
  return input
    .replace(EMAIL_RE, "[email]")
    .replace(TCKN_RE, "[tckn]")
    .replace(PHONE_RE, "[phone]");
}
