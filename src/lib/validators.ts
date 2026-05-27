import { z } from "zod";
import { experiencesSchema } from "@/lib/experience";

// Telefon kuralları:
// +90 5XX XXX XX XX → 0XXXXXXXXXX
// 90 5XX XXX XX XX  → 0XXXXXXXXXX
// 0 5XX XXX XX XX   → 0XXXXXXXXXX
// 5XX XXX XX XX     → 0XXXXXXXXXX (sistem başına 0 ekler)
export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s\-()+]/g, ""))
  .transform((v) => {
    if (v.startsWith("90") && v.length === 12) return "0" + v.slice(2);
    if (/^5\d{9}$/.test(v)) return "0" + v;
    return v;
  })
  .refine((v) => /^05\d{9}$/.test(v), {
    message: "Geçerli bir telefon girin. Örn: 0555 555 55 55",
  });

// Şifre: 8+ karakter, 1 büyük harf, 1 sayı, 1 noktalama/özel karakter
const passwordRule = z
  .string()
  .min(8, "Şifre en az 8 karakter olmalı.")
  .max(120, "Şifre en fazla 120 karakter olabilir.")
  .regex(/[A-ZĞÜŞİÖÇ]/, "Şifrede en az 1 büyük harf olmalı.")
  .regex(/\d/, "Şifrede en az 1 sayı olmalı.")
  .regex(/[^A-Za-z0-9ğüşıöçĞÜŞİÖÇ]/, "Şifrede en az 1 noktalama veya özel karakter olmalı (örn: . , ! ? * @).");

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Ad soyad en az 2 karakter olmalı.")
      .max(80, "Ad soyad en fazla 80 karakter olabilir."),
    email: z.string().trim().toLowerCase().email("Geçerli bir e-posta girin."),
    phone: phoneSchema,
    password: passwordRule,
    confirmPassword: z.string().min(1, "Şifreyi tekrar girin."),
    neighborhood: z
      .string()
      .trim()
      .min(1, "Mahalle seçmelisin.")
      .max(80, "Mahalle en fazla 80 karakter olabilir."),
    acceptTerms: z.boolean().refine((v) => v === true, {
      message: "Kullanım koşullarını kabul etmelisiniz.",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Şifreler eşleşmiyor.",
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const verifyOtpSchema = z.object({
  userId: z.string().min(1),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "6 haneli doğrulama kodunu girin."),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "E-posta veya telefon girin.")
    .max(120),
  password: z.string().min(1, "Şifrenizi girin."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const requestPasswordResetSchema = z.object({
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta girin."),
});

export const resetPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta girin."),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "6 haneli kodu girin."),
  password: passwordRule,
});

export const accountInfoSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Ad soyad en az 2 karakter olmalı.")
    .max(80, "Ad soyad en fazla 80 karakter olabilir."),
  neighborhood: z
    .string()
    .trim()
    .min(1, "Mahalle seçmelisin.")
    .max(80),
});

export type AccountInfoInput = z.infer<typeof accountInfoSchema>;

export const workerProfileSchema = z.object({
  professions: z
    .array(z.string().min(1).max(60))
    .min(1, "En az bir meslek seçin.")
    .max(5, "En fazla 5 meslek seçebilirsin."),
  bio: z
    .string()
    .trim()
    .min(30, "Hakkımda en az 30 karakter olmalı.")
    .max(500, "Hakkımda en fazla 500 karakter olabilir."),
  showDistrict: z.boolean(),
  phoneVisibility: z.enum(["public", "private"]),
  experiences: experiencesSchema.optional().default([]),
});

export type WorkerProfileInput = z.infer<typeof workerProfileSchema>;

export const clearConversationSchema = z.object({
  otherUserId: z.string().min(1, "Kullanıcı belirtilmedi.").max(40),
});

export const reportMessageSchema = z.object({
  messageId: z.string().min(1, "Mesaj belirtilmedi.").max(40),
  reason: z
    .string()
    .trim()
    .min(1, "Rapor sebebi gereklidir.")
    .max(500, "Rapor sebebi en fazla 500 karakter olabilir."),
});

export const sendMessageSchema = z.object({
  recipientId: z.string().min(1, "Alıcı belirtilmedi."),
  content: z
    .string()
    .trim()
    .min(1, "Mesaj boş olamaz.")
    .max(2000, "Mesaj en fazla 2000 karakter olabilir."),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
