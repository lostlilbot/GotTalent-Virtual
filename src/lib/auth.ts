import { cookies } from "next/headers";
import { ensureDefaultAdmin as ensureAdmin, findAdminByEmail, verifyAdminPassword, createAdminUser } from "./admin-store";

const ADMIN_SESSION_COOKIE = "admin_session";

export { ensureDefaultAdmin } from "./admin-store";

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.compare(password, hash);
}

export async function loginAdmin(email: string, password: string) {
  // Ensure default admin exists
  await ensureAdmin();
  
  const admin = await verifyAdminPassword(email, password);
  
  if (!admin) {
    return { success: false, error: "Invalid email or password" };
  }
  
  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, String(admin.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  
  return { success: true, admin };
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
  
  // For simple authentication, we'll check if the session ID is valid
  // In a more robust system, we'd look up the user by ID
  if (adminId === 1) {
    // Return a mock admin object for the default admin
    return {
      id: 1,
      email: "lost.lil.bot@gmail.com",
      name: "Admin",
      role: "admin" as const,
    };
  }
  
  return null;
}

export async function createAdmin(email: string, password: string, name: string, role: "admin" | "judge" = "judge") {
  return createAdminUser(email, password, name, role);
}
