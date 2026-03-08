import { db } from "./index";
import { admins } from "./schema";
import { hashPassword } from "@/lib/auth";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding admin user...");
  
  // Check if admin already exists
  const existingAdmin = await db.select().from(admins).where(eq(admins.email, "lost.lil.bot@gmail.com")).limit(1);
  
  if (existingAdmin.length > 0) {
    console.log("Admin user already exists, skipping...");
    return;
  }
  
  const hashedPassword = await hashPassword("Sunbeam99!!@@");
  
  await db.insert(admins).values({
    email: "lost.lil.bot@gmail.com",
    password: hashedPassword,
    name: "Admin",
    role: "admin",
  });
  
  console.log("Admin user created successfully!");
  console.log("Email: lost.lil.bot@gmail.com");
}

seed()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  });
