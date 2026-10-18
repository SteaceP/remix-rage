import { createContext, type RouterContextProvider } from "react-router";

export interface CloudflareContext {
    env: Env;
    ctx: ExecutionContext;
    cf?: IncomingRequestCfProperties;
    caches?: CacheStorage;
}

export const cloudflareContext = createContext<CloudflareContext>();

export function getEnvFromContext(context: Readonly<RouterContextProvider> | unknown): Partial<Env> {
    if (context && typeof (context as any).get === "function") {
        try {
            const cf = (context as Readonly<RouterContextProvider>).get(cloudflareContext);
            if (cf?.env) return cf.env;
        } catch {
            // context not set
        }
    }

    const legacy = context as any;
    if (legacy?.cloudflare?.env) return legacy.cloudflare.env;
    if (legacy?.env) return legacy.env;

    return {};
}
