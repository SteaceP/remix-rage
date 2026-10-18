import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import {
    clearAdminCookieHeader,
    createAdminCookieHeader,
    createAdminSessionToken,
    getAdminSessionFromRequest,
    resolveSigningSecret,
} from "~/utils/auth.server";
import { fetchHubJson } from "~/utils/dm-hub.server";
import {
    chatMessageSchema,
    visitorStartSchema,
    type AdminPresence,
    type ChatMessage,
    type ChatThread,
    type PasskeyCredential,
} from "~/utils/dm-types";
import { checkRateLimit, getRateLimitKey } from "~/utils/rate-limit.server";

export async function loader({ request, context, params }: LoaderFunctionArgs) {
    const env = (context.cloudflare?.env || context.env || {}) as Record<string, any>;
    const signingSecret = resolveSigningSecret(env);
    const actionName = params.action;

    if (actionName === "status") {
        const url = new URL(request.url);
        const threadId = url.searchParams.get("threadId") || "";
        const token = url.searchParams.get("token") || "";
        const session = await getAdminSessionFromRequest(request, signingSecret);

        try {
            const query =
                threadId && token ? `?threadId=${encodeURIComponent(threadId)}&token=${encodeURIComponent(token)}` : "";
            const status = await fetchHubJson<{
                presence: AdminPresence;
                passkeysCount: number;
                hasStoredPasscode: boolean;
                vapidPublicKey: string;
                thread: ChatThread | null;
                messages: ChatMessage[];
            }>(context, `/status${query}`);

            return Response.json({
                ...status,
                hasEnvPasscode: Boolean(env.ADMIN_SECRET),
                isAdmin: Boolean(session),
            });
        } catch {
            return Response.json({
                presence: {
                    available: true,
                    adminConnected: false,
                    statusText: "Available",
                    updatedAt: Date.now(),
                },
                passkeysCount: 0,
                hasStoredPasscode: false,
                hasEnvPasscode: Boolean(env.ADMIN_SECRET),
                vapidPublicKey: "",
                isAdmin: Boolean(session),
                thread: null,
                messages: [],
            });
        }
    }

    if (actionName === "thread") {
        const session = await getAdminSessionFromRequest(request, signingSecret);
        if (!session) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const url = new URL(request.url);
        const threadId = url.searchParams.get("threadId") || "";
        const data = await fetchHubJson<{ thread: ChatThread; messages: ChatMessage[] }>(
            context,
            `/admin/thread?threadId=${encodeURIComponent(threadId)}`
        );
        return Response.json(data);
    }

    return Response.json({ error: "Unknown endpoint" }, { status: 404 });
}

export async function action({ request, context, params }: ActionFunctionArgs) {
    if (request.method !== "POST") {
        return Response.json({ error: "Method not allowed" }, { status: 405 });
    }

    const env = (context.cloudflare?.env || context.env || {}) as Record<string, any>;
    const signingSecret = resolveSigningSecret(env);
    const actionName = params.action;
    const rateKey = getRateLimitKey(request);

    try {
        if (actionName === "visitor-message") {
            const limit = checkRateLimit(`dm-msg:${rateKey}`, 20, 60000);
            if (!limit.allowed) {
                return Response.json({ error: "Sending too fast. Please wait a moment." }, { status: 429 });
            }

            const body = await request.json();
            const validated = visitorStartSchema.parse(body);

            const res = await fetchHubJson<{
                thread: ChatThread;
                message: ChatMessage;
                threadId: string;
                visitorToken: string;
            }>(context, "/visitor/message", {
                method: "POST",
                body: JSON.stringify(validated),
            });

            return Response.json(res);
        }

        if (actionName === "passcode-login") {
            const limit = checkRateLimit(`dm-login:${rateKey}`, 6, 60000);
            if (!limit.allowed) {
                return Response.json({ error: "Too many login attempts. Please wait a minute." }, { status: 429 });
            }

            const body = (await request.json()) as { passcode?: string };
            const passcode = (body.passcode || "").trim();

            const verifyResult = await fetchHubJson<{
                ok: boolean;
                bootstrapped?: boolean;
                error?: string;
            }>(context, "/admin/passcode/verify", {
                method: "POST",
                body: JSON.stringify({
                    passcode,
                    envAdminSecret:
                        typeof env.ADMIN_SECRET === "string" && env.ADMIN_SECRET ? env.ADMIN_SECRET : undefined,
                }),
            });

            if (!verifyResult.ok) {
                return Response.json({ error: verifyResult.error || "Invalid passcode" }, { status: 401 });
            }

            const token = await createAdminSessionToken(signingSecret, "passcode");
            return Response.json(
                { ok: true, bootstrapped: verifyResult.bootstrapped },
                {
                    headers: {
                        "Set-Cookie": createAdminCookieHeader(token, request),
                    },
                }
            );
        }

        if (actionName === "logout") {
            return Response.json(
                { ok: true },
                {
                    headers: {
                        "Set-Cookie": clearAdminCookieHeader(request),
                    },
                }
            );
        }

        if (actionName === "webauthn-challenge") {
            const limit = checkRateLimit(`dm-webauthn:${rateKey}`, 10, 60000);
            if (!limit.allowed) {
                return Response.json({ error: "Too many requests" }, { status: 429 });
            }

            const body = (await request.json()) as { purpose: "register" | "login" };
            if (body.purpose === "register") {
                const session = await getAdminSessionFromRequest(request, signingSecret);
                if (!session) {
                    // Check if system is completely unbootstrapped
                    const status = await fetchHubJson<{
                        passkeysCount: number;
                        hasStoredPasscode: boolean;
                    }>(context, "/status");
                    if (status.passkeysCount > 0 || status.hasStoredPasscode || env.ADMIN_SECRET) {
                        return Response.json(
                            { error: "Log in with your passcode first to register a new Passkey" },
                            { status: 401 }
                        );
                    }
                }
            }

            const challengeData = await fetchHubJson<{
                challenge: string;
                allowCredentialIds: string[];
            }>(context, "/admin/webauthn/challenge", {
                method: "POST",
                body: JSON.stringify({ purpose: body.purpose }),
            });

            const url = new URL(request.url);
            return Response.json({
                ...challengeData,
                rpId: url.hostname,
            });
        }

        if (actionName === "webauthn-register") {
            const session = await getAdminSessionFromRequest(request, signingSecret);
            if (!session) {
                const status = await fetchHubJson<{
                    passkeysCount: number;
                    hasStoredPasscode: boolean;
                }>(context, "/status");
                if (status.passkeysCount > 0 || status.hasStoredPasscode || env.ADMIN_SECRET) {
                    return Response.json({ error: "Unauthorized" }, { status: 401 });
                }
            }

            const body = (await request.json()) as Record<string, unknown>;
            const url = new URL(request.url);

            const result = await fetchHubJson<{
                ok: boolean;
                passkeys: Array<Omit<PasskeyCredential, "publicKeySpki">>;
            }>(context, "/admin/webauthn/register", {
                method: "POST",
                body: JSON.stringify({
                    ...body,
                    origin: url.origin,
                    rpId: url.hostname,
                }),
            });

            const token = await createAdminSessionToken(signingSecret, "passkey");
            return Response.json(result, {
                headers: {
                    "Set-Cookie": createAdminCookieHeader(token, request),
                },
            });
        }

        if (actionName === "webauthn-login") {
            const limit = checkRateLimit(`dm-webauthn-login:${rateKey}`, 10, 60000);
            if (!limit.allowed) {
                return Response.json({ error: "Too many login attempts" }, { status: 429 });
            }

            const body = (await request.json()) as Record<string, unknown>;
            const url = new URL(request.url);

            const result = await fetchHubJson<{ ok: boolean; deviceName: string }>(context, "/admin/webauthn/login", {
                method: "POST",
                body: JSON.stringify({
                    ...body,
                    origin: url.origin,
                    rpId: url.hostname,
                }),
            });

            const token = await createAdminSessionToken(signingSecret, "passkey");
            return Response.json(result, {
                headers: {
                    "Set-Cookie": createAdminCookieHeader(token, request),
                },
            });
        }

        // All remaining endpoints require an active admin session
        const session = await getAdminSessionFromRequest(request, signingSecret);
        if (!session) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (actionName === "webauthn-delete") {
            const body = await request.json();
            const res = await fetchHubJson(context, "/admin/webauthn/delete", {
                method: "POST",
                body: JSON.stringify(body),
            });
            return Response.json(res);
        }

        if (actionName === "passcode-update") {
            const body = await request.json();
            const res = await fetchHubJson(context, "/admin/passcode/update", {
                method: "POST",
                body: JSON.stringify(body),
            });
            return Response.json(res);
        }

        if (actionName === "availability") {
            const body = await request.json();
            const res = await fetchHubJson(context, "/admin/availability", {
                method: "POST",
                body: JSON.stringify(body),
            });
            return Response.json(res);
        }

        if (actionName === "admin-reply") {
            const body = await request.json();
            const validated = chatMessageSchema.parse(body);
            const res = await fetchHubJson(context, "/admin/reply", {
                method: "POST",
                body: JSON.stringify(validated),
            });
            return Response.json(res);
        }

        if (actionName === "push-subscribe") {
            const body = await request.json();
            const res = await fetchHubJson(context, "/admin/push/subscribe", {
                method: "POST",
                body: JSON.stringify(body),
            });
            return Response.json(res);
        }

        if (actionName === "push-unsubscribe") {
            const body = await request.json();
            const res = await fetchHubJson(context, "/admin/push/unsubscribe", {
                method: "POST",
                body: JSON.stringify(body),
            });
            return Response.json(res);
        }

        if (actionName === "push-test") {
            const res = await fetchHubJson(context, "/admin/push/test", {
                method: "POST",
                body: JSON.stringify({}),
            });
            return Response.json(res);
        }

        return Response.json({ error: "Unknown action" }, { status: 404 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Operation failed";
        return Response.json({ error: message }, { status: 400 });
    }
}
