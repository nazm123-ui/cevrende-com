import { z } from "zod";

const turkishPhoneRegex = /^(05\d{9}|5\d{9})$/;

export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/\s|-|\(|\)/g, ""))
  .refine((v) => turkishPhoneRegex.test(v), {
    message: "Geçerli bir telefon numarası girin. Örn: 05XXXXXXXXX",
  })
  .transform((v) => (v.startsWith("05") ? v : `0${v}`));

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Ad soyad en az 2 karakter olmalı.")
    .max(80, "Ad soyad en fazla 80 karakter olabilir."),
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta girin."),
  phone: phoneSchema,
  password: z
    .string()
    .min(6, "Şifre en az 6 karakter olmalı.")
    .max(120, "Şifre en fazla 120 karakter olabilir."),
  neighborhood: z
    .string()
    .trim()
    .max(80, "Mahalle en fazla 80 karakter olabilir.")
    .optional()
    .or(z.literal("")),
  acceptTerms: z.boolean().refine((v) => v === true, {
    message: "Kullanım koşullarını kabul etmelisiniz.",
  }),
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
  password: z
    .string()
    .min(6, "Şifre en az 6 karakter olmalı.")
    .max(120, "Şifre en fazla 120 karakter olabilir."),
});

export const workerProfileSchema = z.object({
  professions: z
    .array(z.string().min(1).max(60))
    .min(1, "En az bir meslek seçin.")
    .max(5, "En fazla 5 meslek seçebilirsin."),
  bio: z
    .string()
    .trim()
    .max(500, "Tanıtım en fazla 500 karakter olabilir.")
    .optional()
    .or(z.literal("")),
  neighborhood: z
    .string()
    .trim()
    .max(80, "Mahalle en fazla 80 karakter olabilir.")
    .optional()
    .or(z.literal("")),
  showName: z.boolean(),
  showDistrict: z.boolean(),
  phoneVisibility: z.enum(["public", "after_approval", "private"]),
});

export type WorkerProfileInput = z.infer<typeof workerProfileSchema>;

export const contactRequestSchema = z.object({
  toWorkerId: z.string().min(1, "Alıcı belirtilmedi."),
  message: z
    .string()
    .trim()
    .max(500, "Not en fazla 500 karakter olabilir.")
    .optional()
    .or(z.literal("")),
});

export type ContactRequestInput = z.infer<typeof contactRequestSchema>;

export const contactRequestRespondSchema = z.object({
  decision: z.enum(["accepted", "declined"]),
});

export type ContactRequestRespondInput = z.infer<
  typeof contactRequestRespondSchema
>;

export const sendMessageSchema = z.object({
  recipientId: z.string().min(1, "Alıcı belirtilmedi."),
  content: z
    .string()
    .trim()
    .min(1, "Mesaj boş olamaz.")
    .max(2000, "Mesaj en fazla 2000 karakter olabilir."),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
