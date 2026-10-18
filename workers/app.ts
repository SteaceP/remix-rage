import { createRequestHandler, RouterContextProvider } from "react-router";
import { cloudflareContext } from "../app/context";
import { getAdminSessionFromRequest, resolveSigningSecret } from "../app/utils/auth.server";
import { DirectMessageHub } from "./chat.do";

export { DirectMessageHub };

let requestHandler: ReturnType<typeof createRequestHandler>;

function getRequestHandler() {
    if (!requestHandler) {
        requestHandler = createRequestHandler(() => import("virtual:react-router/server-build"), import.meta.env.MODE);
    }
    return requestHandler;
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // Handle real-time WebSocket upgrades directly via the DirectMessageHub Durable Object
        if (url.pathname === "/api/dm/ws" && request.headers.get("Upgrade")?.toLowerCase() === "websocket") {
            const role = url.searchParams.get("role") === "admin" ? "admin" : "visitor";
            if (role === "admin") {
                const secret = resolveSigningSecret(env as unknown as Record<string, unknown>);
                const session = await getAdminSessionFromRequest(request, secret);
                if (!session) {
                    return new Response("Unauthorized", { status: 401 });
                }
            }

            const id = env.DIRECT_MESSAGE_HUB.idFromName("global");
            const stub = env.DIRECT_MESSAGE_HUB.get(id);
            return stub.fetch(request);
        }

        const handler = getRequestHandler();
        const routerContext = new RouterContextProvider();
        routerContext.set(cloudflareContext, {
            env,
            ctx,
            cf: request.cf as any,
            caches: caches as any,
        });

        return handler(request, routerContext);
    },
} satisfies ExportedHandler<Env>;
