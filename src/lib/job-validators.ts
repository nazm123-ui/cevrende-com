import { z } from "zod";
import { JOB_TYPES, SALARY_TYPES } from "@/lib/constants/job-types";
import { PENDIK_NEIGHBORHOODS } from "@/lib/constants/pendik-neighborhoods";

const jobTypeValues = JOB_TYPES.map((t) => t.value) as [string, ...string[]];
const salaryTypeValues = SALARY_TYPES.map((t) => t.value) as [
  string,
  ...string[],
];
const neighborhoodValues = [...PENDIK_NEIGHBORHOODS] as [string, ...string[]];

const benefitValues = ["meal", "transport", "uniform"] as const;

const optionalNonEmpty = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined));

const optionalNumber = z
  .union([z.number(), z.string()])
  .optional()
  .nullable()
  .transform((v) => {
    if (v === undefined || v === null || v === "") return null;
    const n = typeof v === "number" ? v : Number(v);
    if (Number.isNaN(n)) return null;
    return n;
  })
  .refine((v) => v === null || (v >= 0 && v <= 10_000_000), {
    message: "Geçersiz ücret tutarı.",
  });

export const jobInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Başlık en az 5 karakter olmalı.")
    .max(120, "Başlık en fazla 120 karakter olabilir."),
  description: z
    .string()
    .trim()
    .min(20, "Açıklama en az 20 karakter olmalı.")
    .max(2000, "Açıklama en fazla 2000 karakter olabilir."),
  categorySlug: z.string().min(1, "Kategori seçin."),
  jobType: z.enum(jobTypeValues, { message: "İş tipi seçin." }),
  neighborhood: z.enum(neighborhoodValues, { message: "Mahalle seçin." }),
  workDate: optionalNonEmpty(20),
  startTime: optionalNonEmpty(10),
  endTime: optionalNonEmpty(10),
  salaryAmount: optionalNumber,
  salaryType: z.enum(salaryTypeValues).default("not_specified"),
  neededPeopleCount: z
    .union([z.number(), z.string()])
    .transform((v) => {
      const n = typeof v === "number" ? v : Number(v);
      return Number.isNaN(n) ? 1 : n;
    })
    .pipe(z.number().int().min(1).max(50))
    .default(1),
  experienceRequired: z.boolean().default(false),
  benefits: z.array(z.enum(benefitValues)).default([]),
  mapLocationUrl: optionalNonEmpty(500),
});

export type JobInput = z.infer<typeof jobInputSchema>;
