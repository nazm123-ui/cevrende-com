import { z } from "zod";

export type Experience = {
  role: string;
  workplace: string;
  fromYear: number;
  toYear: number | null;
  description?: string;
};

const currentYear = new Date().getFullYear();

export const experienceSchema = z.object({
  role: z.string().trim().min(2, "Görev en az 2 karakter").max(80),
  workplace: z.string().trim().min(2, "İşyeri en az 2 karakter").max(80),
  fromYear: z
    .number()
    .int()
    .min(1950, "Geçerli bir yıl gir")
    .max(currentYear, "Gelecek yıl olamaz"),
  toYear: z
    .number()
    .int()
    .min(1950)
    .max(currentYear)
    .nullable(),
  description: z.string().trim().max(300, "Açıklama en fazla 300 karakter").optional(),
});

export const experiencesSchema = z
  .array(experienceSchema)
  .max(10, "En fazla 10 deneyim ekleyebilirsin")
  .refine(
    (arr) => arr.every((e) => e.toYear === null || e.toYear >= e.fromYear),
    { message: "Bitiş yılı başlangıçtan önce olamaz" },
  );

export function parseExperiences(raw: unknown): Experience[] {
  if (!Array.isArray(raw)) return [];
  const parsed = experiencesSchema.safeParse(raw);
  if (!parsed.success) return [];
  return parsed.data;
}

export function formatYearRange(e: Experience): string {
  return e.toYear === null ? `${e.fromYear} — günümüz` : `${e.fromYear} — ${e.toYear}`;
}
