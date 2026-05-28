export function getInitials(name: string): string {
  const cleaned = name.replace(/\*+/g, "").trim();
  if (!cleaned) return "··";
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "··";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
