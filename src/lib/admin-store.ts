import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

interface AdminUser {
  id: number;
  email: string;
  password: string;
  name: string;
  role: "admin" | "judge";
  createdAt: Date;
}

interface AdminStore {
  users: AdminUser[];
  nextId: number;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const ADMIN_FILE = path.join(DATA_DIR, "admins.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadStore(): AdminStore {
  ensureDataDir();
  if (!fs.existsSync(ADMIN_FILE)) {
    const initialStore: AdminStore = {
      users: [],
      nextId: 1,
    };
    fs.writeFileSync(ADMIN_FILE, JSON.stringify(initialStore, null, 2));
    return initialStore;
  }
  return JSON.parse(fs.readFileSync(ADMIN_FILE, "utf-8"));
}

function saveStore(store: AdminStore) {
  ensureDataDir();
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(store, null, 2));
}

export async function createAdminUser(
  email: string,
  password: string,
  name: string,
  role: "admin" | "judge" = "admin"
): Promise<AdminUser> {
  const store = loadStore();
  
  // Check if user already exists
  const existing = store.users.find((u) => u.email === email);
  if (existing) {
    return existing;
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: AdminUser = {
    id: store.nextId++,
    email,
    password: hashedPassword,
    name,
    role,
    createdAt: new Date(),
  };
  
  store.users.push(newUser);
  saveStore(store);
  
  return newUser;
}

export async function findAdminByEmail(email: string): Promise<AdminUser | null> {
  const store = loadStore();
  return store.users.find((u) => u.email === email) || null;
}

export async function verifyAdminPassword(
  email: string,
  password: string
): Promise<AdminUser | null> {
  const user = await findAdminByEmail(email);
  if (!user) return null;
  
  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user : null;
}

// Ensure default admin exists
export async function ensureDefaultAdmin() {
  const DEFAULT_ADMIN_EMAIL = "lost.lil.bot@gmail.com";
  const DEFAULT_ADMIN_PASSWORD = "Sunbeam99!!@@";
  
  const existing = await findAdminByEmail(DEFAULT_ADMIN_EMAIL);
  if (!existing) {
    await createAdminUser(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, "Admin", "admin");
    console.log("Default admin user created");
  }
}
