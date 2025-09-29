import dotenvx from "@dotenvx/dotenvx";

dotenvx.config();

export const PUBLIC_DEVELOPMENT_URL = process.env
  .PUBLIC_DEVELOPMENT_URL as string;
export const PUBLIC_PRODUCTION_URL = process.env
  .PUBLIC_PRODUCTION_URL as string;
export const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL as string;
export const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN as string;
export const MODE = process.env.MODE;

export const SENTRY_DSN = process.env.SENTRY_DSN as string;
export const SENTRY_PROJECT = process.env.SENTRY_PROJECT as string;
export const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN as string;
export const BACKEND_API_URL = process.env.BACKEND_API_URL as string;
