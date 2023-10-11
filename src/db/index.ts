// Import needed packages
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import ws from "ws";

// Setup
dotenv.config();
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

// Init prisma client
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
let db: PrismaClient | null = null;
db = db ?? new PrismaClient({ adapter });

// Use Prisma Client as normal
export default db!;
