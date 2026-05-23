import { JOB_TYPES, SALARY_TYPES } from "@/lib/constants/job-types";

const jobTypeMap = new Map<string, string>(
  JOB_TYPES.map((t) => [t.value, t.label]),
);
const salaryTypeMap = new Map<string, string>(
  SALARY_TYPES.map((t) => [t.value, t.label]),
);

export function formatJobType(value: string): string {
  return jobTypeMap.get(value) ?? value;
}

export function formatSalaryType(value: string): string {
  return salaryTypeMap.get(value) ?? value;
}

export function formatSalary(
  amount: number | null,
  type: string,
): string | null {
  if (amount == null) {
    if (type === "negotiable") return "Görüşülür";
    return null;
  }
  const tl = new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(amount);
  const typeLabel = formatSalaryType(type);
  if (type === "not_specified" || type === "negotiable") return `${tl} TL`;
  return `${tl} TL / ${typeLabel.toLowerCase()}`;
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 11) return phone;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
}

const dateFmt = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDate(d: Date): string {
  return dateFmt.format(d);
}

const relativeFmt = new Intl.RelativeTimeFormat("tr-TR", { numeric: "auto" });

export function formatRelative(d: Date): string {
  const diff = Date.now() - d.getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 60) return relativeFmt.format(-minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (hours < 24) return relativeFmt.format(-hours, "hour");
  const days = Math.round(hours / 24);
  if (days < 30) return relativeFmt.format(-days, "day");
  const months = Math.round(days / 30);
  return relativeFmt.format(-months, "month");
}
