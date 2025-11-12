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

// Load environment variables from .env file in development
// This only runs on the server side
if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
    // Node.js automatically loads .env files when using --env-file flag or dotenv
    // For React Router v7, we need to manually ensure they're available
    try {
        // Try to load from .env file using Node's fs if available
        if (typeof require !== "undefined") {
            const fs = require("fs");
            const path = require("path");
            const envPath = path.join(process.cwd(), ".env");
            if (fs.existsSync(envPath)) {
                const envFile = fs.readFileSync(envPath, "utf-8");
                envFile.split("\n").forEach((line: string) => {
                    const match = line.match(/^([^#][^=]+)=(.*)$/);
                    if (match) {
                        const key = match[1].trim();
                        const value = match[2].trim();
                        if (!process.env[key]) {
                            process.env[key] = value;
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.error("Failed to load .env file:", error);
    }
}

export function getLoadContext(): {
    env: {
        CSRF_SECRET?: string;
        BREVO_API_KEY?: string;
        FROM_EMAIL?: string;
        TO_EMAIL?: string;
        [key: string]: string | undefined;
    };
} {
    // In development, load environment variables from process.env
    // These are loaded from the .env file by the code above
    return {
        env: {
            CSRF_SECRET: process.env.CSRF_SECRET,
            BREVO_API_KEY: process.env.BREVO_API_KEY,
            FROM_EMAIL: process.env.FROM_EMAIL,
            TO_EMAIL: process.env.TO_EMAIL,
        },
    };
}
