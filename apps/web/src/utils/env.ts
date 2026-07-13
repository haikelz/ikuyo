import dotenvx from "@dotenvx/dotenvx";

dotenvx.config({
  path: [".env", "apps/web/.env"],
  ignore: ["MISSING_ENV_FILE"],
});

export const PUBLIC_DEVELOPMENT_URL = import.meta.env
  .PUBLIC_DEVELOPMENT_URL as string;
export const PUBLIC_PRODUCTION_URL = import.meta.env
  .PUBLIC_PRODUCTION_URL as string;
export const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL as string;
export const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN as string;
export const MODE = process.env.MODE;

export const SENTRY_DSN = process.env.SENTRY_DSN as string;
export const SENTRY_PROJECT = process.env.SENTRY_PROJECT as string;
export const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN as string;

export const BACKEND_API_URL = process.env.BACKEND_API_URL as string;

export const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY as string;
export const IMAGEKIT_API_BASE_URL = process.env
  .IMAGEKIT_API_BASE_URL as string;

export const PUBLIC_UMAMI_SRC = import.meta.env
  .PUBLIC_UMAMI_SRC as string;
export const PUBLIC_UMAMI_WEBSITE_ID = import.meta.env
  .PUBLIC_UMAMI_WEBSITE_ID as string;
export const PUBLIC_GOATCOUNTER_SRC = import.meta.env
  .PUBLIC_GOATCOUNTER_SRC as string;
