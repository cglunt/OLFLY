import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Database operations will fail.");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL || '' });
export const db = drizzle({ client: pool, schema });

pool.on('error', (err) => {
  console.error('Database pool error:', err);
});
