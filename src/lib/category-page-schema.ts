import { z } from "zod";

export const guidePointSchema = z.object({
  title: z.string().trim().min(1, "Başlık gerekli.").max(120),
  body: z.string().trim().min(1, "Açıklama gerekli.").max(600),
});

export const faqSchema = z.object({
  q: z.string().trim().min(1, "Soru gerekli.").max(200),
  a: z.string().trim().min(1, "Cevap gerekli.").max(1200),
});

export const categoryPageCreateSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, "Sadece küçük harf, rakam ve tire.")
    .min(2)
    .max(60),
  categorySlug: z.string().trim().min(2).max(60),
  name: z.string().trim().min(1).max(60),
  h1: z.string().trim().min(1).max(120),
  metaTitle: z.string().trim().min(1).max(120),
  metaDescription: z.string().trim().min(1).max(300),
  intro: z.string().trim().min(1).max(2000),
  bodyContent: z.string().trim().max(8000).nullable().optional(),
  guideTitle: z.string().trim().min(1).max(160),
  guidePoints: z.array(guidePointSchema).max(12).default([]),
  emptyState: z.string().trim().min(1).max(400),
  faqs: z.array(faqSchema).max(20).default([]),
  coverImageKey: z.string().trim().max(300).nullable().optional(),
  isPublished: z.boolean().default(true),
  order: z.number().int().nonnegative().default(0),
});

export const categoryPagePatchSchema = categoryPageCreateSchema.partial();

export type CategoryPageInput = z.infer<typeof categoryPageCreateSchema>;
