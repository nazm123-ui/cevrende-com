import { z } from "zod";
import { GUIDE_TOPICS } from "@/lib/guides";

const topicKeys = Object.keys(GUIDE_TOPICS) as [string, ...string[]];

export const guideBulletSchema = z.object({
  title: z.string().trim().max(120).optional(),
  body: z.string().trim().min(1, "Metin gerekli.").max(800),
  icon: z.enum(["camera", "wave", "thermometer", "shield", "wrench"]).optional(),
});

export const guideSectionSchema = z.object({
  heading: z.string().trim().min(1, "Başlık gerekli.").max(160),
  layout: z.enum(["prose", "steps", "checklist", "features"]).optional(),
  paragraphs: z.array(z.string().trim().min(1).max(2000)).max(30).optional(),
  bullets: z.array(guideBulletSchema).max(20).optional(),
});

export const guideFaqSchema = z.object({
  q: z.string().trim().min(1, "Soru gerekli.").max(200),
  a: z.string().trim().min(1, "Cevap gerekli.").max(1500),
});

export const guideCreateSchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9-]+$/, "Sadece küçük harf, rakam ve tire.")
    .min(2)
    .max(80),
  title: z.string().trim().min(1).max(160),
  metaTitle: z.string().trim().min(1).max(160),
  metaDescription: z.string().trim().min(1).max(320),
  excerpt: z.string().trim().min(1).max(400),
  intro: z.string().trim().min(1).max(2000),
  topic: z.enum(topicKeys),
  sections: z.array(guideSectionSchema).max(20).default([]),
  faqs: z.array(guideFaqSchema).max(20).default([]),
  relatedCategorySlugs: z
    .array(z.string().trim().min(1).max(60))
    .max(20)
    .default([]),
  isPublished: z.boolean().default(true),
  order: z.number().int().nonnegative().default(0),
});

export const guidePatchSchema = guideCreateSchema.partial();

export type GuideInput = z.infer<typeof guideCreateSchema>;
