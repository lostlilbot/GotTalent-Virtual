import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";

const ADMIN_SESSION_COOKIE = "admin_session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function loginAdmin(email: string, password: string) {
  const admin = await db.select().from(admins).where(eq(admins.email, email)).limit(1);
  
  if (admin.length === 0) {
    return { success: false, error: "Invalid email or password" };
  }
  
  const isValid = await verifyPassword(password, admin[0].password);
  
  if (!isValid) {
    return { success: false, error: "Invalid email or password" };
  }
  
  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, String(admin[0].id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  
  return { success: true, admin: admin[0] };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE);
  
  if (!session) {
    return null;
  }
  
  const adminId = parseInt(session.value, 10);
  const admin = await db.select().from(admins).where(eq(admins.id, adminId)).limit(1);
  
  return admin.length > 0 ? admin[0] : null;
}

export async function createAdmin(email: string, password: string, name: string, role: "admin" | "judge" = "judge") {
  const hashedPassword = await hashPassword(password);
  
  const result = await db.insert(admins).values({
    email,
    password: hashedPassword,
    name,
    role,
  });
  
  return result;
}
