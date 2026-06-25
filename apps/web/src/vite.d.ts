import "vite";

declare module "vite" {
  interface ResolveOptions {
    tsconfigPaths?: boolean;
  }
}

export {};
