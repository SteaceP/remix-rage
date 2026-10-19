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
            const origin = request.headers.get("Origin");
            if (origin) {
                try {
                    const originUrl = new URL(origin);
                    if (originUrl.host !== url.host) {
                        return new Response("Forbidden", { status: 403 });
                    }
                } catch {
                    return new Response("Invalid Origin", { status: 403 });
                }
            }

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

        // Serve RFC 9727 API Catalog for agent discovery
        if (url.pathname === "/.well-known/api-catalog") {
            const catalog = {
                linkset: [
                    {
                        anchor: `${url.origin}/.well-known/api-catalog`,
                        item: [
                            {
                                href: `${url.origin}/api/dm`,
                                title: "Direct Message API",
                            },
                        ],
                    },
                    {
                        anchor: `${url.origin}/api/dm`,
                        "service-doc": [
                            {
                                href: `${url.origin}/contact`,
                                type: "text/html",
                            },
                        ],
                    },
                ],
            };
            return new Response(JSON.stringify(catalog, null, 2), {
                status: 200,
                headers: {
                    "Content-Type":
                        'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"; charset=utf-8',
                    "Cache-Control": "public, max-age=86400, must-revalidate",
                    "Access-Control-Allow-Origin": "*",
                },
            });
        }

        const handler = getRequestHandler();
        const routerContext = new RouterContextProvider();
        routerContext.set(cloudflareContext, {
            env,
            ctx,
            cf: request.cf as any,
            caches: caches as any,
        });

        const response = await handler(request, routerContext);

        // Add RFC 8288 / RFC 9727 Link header on homepage response for agent discovery
        if (url.pathname === "/" || url.pathname === "") {
            const headers = new Headers(response.headers);
            headers.set("Link", '</.well-known/api-catalog>; rel="api-catalog", </contact>; rel="service-doc"');
            return new Response(response.body, {
                status: response.status,
                statusText: response.statusText,
                headers,
            });
        }

        return response;
    },
} satisfies ExportedHandler<Env>;
