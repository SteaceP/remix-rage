import { type PlatformProxy } from "wrangler";

interface ProcessEnv {
    [x: string]: string | undefined;
}

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "react-router" {
    interface AppLoadContext {
        // Production: context.cloudflare.env
        cloudflare?: Cloudflare;
        // Development: context.env (uses process.env from .env file)
        env?: ProcessEnv & {
            CSRF_SECRET?: string;
            ADMIN_SECRET?: string;
            DIRECT_MESSAGE_HUB?: DurableObjectNamespace;
        };
    }
}

export function getLoadContext(): {
    env: {
        CSRF_SECRET?: string;
        ADMIN_SECRET?: string;
        [key: string]: string | undefined;
    };
} {
    return {
        env: {
            CSRF_SECRET: typeof process !== "undefined" ? process.env.CSRF_SECRET : undefined,
            ADMIN_SECRET: typeof process !== "undefined" ? process.env.ADMIN_SECRET : undefined,
        },
    };
}
