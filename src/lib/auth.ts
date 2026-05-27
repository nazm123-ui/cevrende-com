import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/db";

const SESSION_COOKIE = "cev_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 gün

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET or JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  userId: string;
};

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = await signSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

type VerifiedSession = SessionPayload & { iat: number };

async function verifyToken(): Promise<VerifiedSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.userId !== "string") return null;
    if (typeof payload.iat !== "number") return null;
    return { userId: payload.userId, iat: payload.iat };
  } catch {
    return null;
  }
}

export async function getSessionPayload(): Promise<SessionPayload | null> {
  const verified = await verifyToken();
  if (!verified) return null;
  return { userId: verified.userId };
}

export async function getCurrentUser() {
  const verified = await verifyToken();
  if (!verified) return null;
  const user = await prisma.user.findUnique({
    where: { id: verified.userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      isPhoneVerified: true,
      isEmailVerified: true,
      isActive: true,
      city: true,
      district: true,
      neighborhood: true,
      passwordChangedAt: true,
    },
  });
  if (!user || !user.isActive) return null;

  if (user.passwordChangedAt) {
    const passwordChangedAtSec = Math.floor(
      user.passwordChangedAt.getTime() / 1000,
    );
    if (verified.iat < passwordChangedAtSec) return null;
  }

  // Don't leak passwordChangedAt to callers
  const { passwordChangedAt: _pca, ...safe } = user;
  void _pca;
  return safe;
}
