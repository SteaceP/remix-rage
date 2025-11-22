import { type PlatformProxy } from "wrangler";

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "react-router" {
    interface AppLoadContext {
        // Production: context.cloudflare.env
        cloudflare?: Cloudflare;
        // Development: context.env (uses process.env from .env file)
        env?: {
            CSRF_SECRET?: string;
            BREVO_API_KEY?: string;
            [key: string]: string | undefined;
        };
    }
}
