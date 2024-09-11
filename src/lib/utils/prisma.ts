import { createClient } from "@libsql/client/web";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from "./constants";

const libsql = createClient({
  url: `libsql://${TURSO_DATABASE_URL}`,
  authToken: TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);
export const prisma = new PrismaClient({ adapter });
