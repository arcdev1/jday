import { PrismaClient } from "@prisma/client";

let db: PrismaClient | null = null;
db = db ?? new PrismaClient();

export default db;
