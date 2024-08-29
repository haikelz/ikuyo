import { createClient } from "@libsql/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";

const libsql = createClient({
  url: `libsql://${import.meta.env.TURSO_DATABASE_URL as string}`,
  authToken: import.meta.env.TURSO_AUTH_TOKEN as string,
});

const adapter = new PrismaLibSQL(libsql);
export const prisma = new PrismaClient({ adapter });
