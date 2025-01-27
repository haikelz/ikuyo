import { createClient } from "@libsql/client/web";
import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from "./constants";

export const libsql = createClient({
  url: `libsql://${TURSO_DATABASE_URL}`,
  authToken: TURSO_AUTH_TOKEN,
});
