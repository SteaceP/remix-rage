import { type PlatformProxy } from "wrangler";

// When using `wrangler.toml` to configure bindings,
// `wrangler types` will generate types for those bindings
// into the global `Env` interface.
// Need this empty interface so that typechecking passes
// even if no `wrangler.toml` exists.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Env {
  [x: string]: string;
}

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "react-router" {
  interface AppLoadContext {
    // Production: context.cloudflare.env
    cloudflare?: Cloudflare;
    // Development: context.env (uses process.env from .env file)
    env?: Env & {
      CSRF_SECRET?: string;
      BREVO_API_KEY?: string;
    };
  }
}

// Note: This file is only used for type definitions
// Environment variables in development are accessed directly in route files
// via import.meta.env or configured through Vite
