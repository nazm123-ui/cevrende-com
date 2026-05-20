/**
 * Tam iletişim bilgileri yalnızca giriş yapan ve telefon doğrulaması
 * tamamlanmış kullanıcılara gösterilir. Diğer durumlarda bu yardımcılar
 * çağrılır.
 */

export function maskName(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => {
      if (part.length <= 2) return part + "*";
      return part.slice(0, 2) + "*".repeat(part.length - 2);
    })
    .join(" ");
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 11) return "0**********";
  return `${digits.slice(0, 2)}** *** ** ${digits.slice(-2)}`;
}

export function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return "***@***";
  const visible = user.slice(0, Math.min(2, user.length));
  return `${visible}${"*".repeat(Math.max(2, user.length - visible.length))}@${domain}`;
}

export type Viewer =
  | { kind: "guest" }
  | { kind: "unverified"; userId: string }
  | { kind: "verified"; userId: string };

export function canSeeFullContact(viewer: Viewer): boolean {
  return viewer.kind === "verified";
}
