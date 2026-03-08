import { createDatabase } from "@kilocode/app-builder-db";
import * as schema from "./schema";

// Singleton database instance - only initialized at runtime
let dbInstance: ReturnType<typeof createDatabase<typeof schema>> | null = null;

function getDbInstance() {
  if (typeof window !== 'undefined') {
    throw new Error("Database can only be used on the server");
  }
  
  if (!dbInstance) {
    dbInstance = createDatabase(schema);
  }
  return dbInstance;
}

// Proxy object that lazily initializes the database
export const db = new Proxy({} as any, {
  get(_target, prop) {
    const database = getDbInstance();
    return (database as any)[prop];
  }
});
