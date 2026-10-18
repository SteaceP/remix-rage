import { DurableObject } from "cloudflare:workers";
import { hashPasscode, verifyPasscodeHash } from "../app/utils/auth.server";
import type {
    AdminPresence,
    ChatMessage,
    ChatThread,
    PasskeyCredential,
    PushSubscriptionRecord,
    WsServerEvent,
} from "../app/utils/dm-types";
import { generateToken, validateToken } from "../app/utils/token.server";
import {
    generateWebAuthnChallenge,
    verifyPasskeyAssertion,
    verifyPasskeyRegistration,
} from "../app/utils/webauthn.server";
import { generateVapidKeys, sendWebPushNotification, type StoredVapidKeys } from "../app/utils/webpush.server";

interface StoredThread extends ChatThread {
    visitorToken: string;
}

interface WsAttachment {
    role: "visitor" | "admin";
    threadId?: string;
    visitorToken?: string;
}

interface StoredChallenge {
    challenge: string;
    purpose: "register" | "login";
    expiresAt: number;
}

export class DirectMessageHub extends DurableObject<Env> {
    constructor(ctx: DurableObjectState, env: Env) {
        super(ctx, env);
    }

    private async getPresenceState(): Promise<AdminPresence> {
        const stored = await this.ctx.storage.get<{
            available: boolean;
            statusText: string;
            updatedAt: number;
        }>("presence");
        const adminSockets = this.ctx.getWebSockets("role:admin");
        const available = stored ? stored.available : true;
        const statusText = stored?.statusText || (available ? "Available" : "Away");
        return {
            available,
            adminConnected: adminSockets.length > 0,
            statusText,
            updatedAt: stored?.updatedAt || Date.now(),
        };
    }

    private async getVapidKeys(): Promise<StoredVapidKeys> {
        let keys = await this.ctx.storage.get<StoredVapidKeys>("vapid_keys");
        if (!keys) {
            keys = await generateVapidKeys();
            await this.ctx.storage.put("vapid_keys", keys);
        }
        return keys;
    }

    private async getPasskeys(): Promise<PasskeyCredential[]> {
        return (await this.ctx.storage.get<PasskeyCredential[]>("passkeys")) || [];
    }

    private async getPushSubscriptions(): Promise<PushSubscriptionRecord[]> {
        return (await this.ctx.storage.get<PushSubscriptionRecord[]>("push_subs")) || [];
    }

    private isVisitorOnline(threadId: string): boolean {
        return this.ctx.getWebSockets(`thread:${threadId}`).length > 0;
    }

    private sanitizeThread(stored: StoredThread): ChatThread {
        const { visitorToken: _unused, ...publicThread } = stored;
        return {
            ...publicThread,
            visitorOnline: this.isVisitorOnline(stored.id),
        };
    }

    private async listThreads(): Promise<ChatThread[]> {
        const map = await this.ctx.storage.list<StoredThread>({ prefix: "thread:" });
        const threads: ChatThread[] = [];
        for (const [, value] of map) {
            threads.push(this.sanitizeThread(value));
        }
        threads.sort((a, b) => b.updatedAt - a.updatedAt);
        return threads;
    }

    private async getMessages(threadId: string): Promise<ChatMessage[]> {
        return (await this.ctx.storage.get<ChatMessage[]>(`messages:${threadId}`)) || [];
    }

    private sendEvent(ws: WebSocket, event: WsServerEvent) {
        try {
            ws.send(JSON.stringify(event));
        } catch {
            // Socket may already be closed
        }
    }

    private broadcastToTag(tag: string, event: WsServerEvent) {
        const payload = JSON.stringify(event);
        for (const ws of this.ctx.getWebSockets(tag)) {
            try {
                ws.send(payload);
            } catch {
                // Ignore closed socket
            }
        }
    }

    private broadcastAll(event: WsServerEvent) {
        const payload = JSON.stringify(event);
        for (const ws of this.ctx.getWebSockets()) {
            try {
                ws.send(payload);
            } catch {
                // Ignore closed socket
            }
        }
    }

    private async notifyAdminPush(thread: ChatThread, message: ChatMessage) {
        const subs = await this.getPushSubscriptions();
        if (subs.length === 0) return;

        const vapidKeys = await this.getVapidKeys();
        const threads = await this.listThreads();
        const totalUnread = threads.reduce((acc, t) => acc + (t.unreadByAdmin || 0), 0);

        const validSubs: PushSubscriptionRecord[] = [];
        let changed = false;

        for (const sub of subs) {
            const res = await sendWebPushNotification(
                sub,
                {
                    title: `${thread.visitorName} • ${thread.topic}`,
                    body: message.text.slice(0, 180),
                    url: `/inbox?thread=${encodeURIComponent(thread.id)}`,
                    threadId: thread.id,
                    unreadCount: totalUnread,
                    ts: message.createdAt,
                },
                vapidKeys
            );
            if (res.gone) {
                changed = true;
            } else {
                validSubs.push(sub);
            }
        }

        if (changed) {
            await this.ctx.storage.put("push_subs", validSubs);
        }
    }

    private async handleVisitorMessage(params: {
        threadId?: string;
        visitorToken?: string;
        visitorName?: string;
        visitorContact?: string;
        topic?: string;
        text: string;
    }): Promise<{
        thread: ChatThread;
        message: ChatMessage;
        threadId: string;
        visitorToken: string;
    }> {
        const now = Date.now();
        const text = params.text.trim().slice(0, 4000);
        if (!text) {
            throw new Error("Message cannot be empty");
        }

        let storedThread: StoredThread | undefined;
        if (params.threadId) {
            const candidate = await this.ctx.storage.get<StoredThread>(`thread:${params.threadId}`);
            if (candidate && params.visitorToken && validateToken(candidate.visitorToken, params.visitorToken)) {
                storedThread = candidate;
            }
        }

        if (!storedThread) {
            const newThreadId =
                params.threadId && /^[a-zA-Z0-9_-]{8,64}$/.test(params.threadId)
                    ? params.threadId
                    : `dm_${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`;
            const newVisitorToken = params.visitorToken || generateToken();
            const visitorName = (params.visitorName || "Visitor").trim().slice(0, 80) || "Visitor";
            const visitorContact = params.visitorContact?.trim().slice(0, 160) || undefined;
            const topic = (params.topic || "General Inquiry").trim().slice(0, 120) || "General Inquiry";

            storedThread = {
                id: newThreadId,
                visitorToken: newVisitorToken,
                visitorName,
                visitorContact,
                topic,
                createdAt: now,
                updatedAt: now,
                unreadByAdmin: 1,
                unreadByVisitor: 0,
                status: "open",
                lastMessagePreview: text.slice(0, 140),
            };
        } else {
            if (params.visitorName?.trim()) {
                storedThread.visitorName = params.visitorName.trim().slice(0, 80);
            }
            if (params.visitorContact !== undefined && params.visitorContact.trim()) {
                storedThread.visitorContact = params.visitorContact.trim().slice(0, 160);
            }
            if (params.topic?.trim()) {
                storedThread.topic = params.topic.trim().slice(0, 120);
            }
            storedThread.updatedAt = now;
            storedThread.unreadByAdmin = (storedThread.unreadByAdmin || 0) + 1;
            storedThread.status = "open";
            storedThread.lastMessagePreview = text.slice(0, 140);
        }

        const message: ChatMessage = {
            id: `msg_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`,
            threadId: storedThread.id,
            sender: "visitor",
            senderName: storedThread.visitorName,
            text,
            createdAt: now,
        };

        const messages = await this.getMessages(storedThread.id);
        messages.push(message);
        if (messages.length > 300) {
            messages.splice(0, messages.length - 300);
        }

        await this.ctx.storage.put({
            [`thread:${storedThread.id}`]: storedThread,
            [`messages:${storedThread.id}`]: messages,
        });

        const publicThread = this.sanitizeThread(storedThread);
        const event: WsServerEvent = {
            type: "message",
            thread: publicThread,
            message,
        };

        this.broadcastToTag("role:admin", event);
        this.broadcastToTag(`thread:${storedThread.id}`, event);

        this.ctx.waitUntil(this.notifyAdminPush(publicThread, message));

        return {
            thread: publicThread,
            message,
            threadId: storedThread.id,
            visitorToken: storedThread.visitorToken,
        };
    }

    private async handleAdminMessage(params: {
        threadId: string;
        text: string;
    }): Promise<{ thread: ChatThread; message: ChatMessage }> {
        const text = params.text.trim().slice(0, 4000);
        if (!text) {
            throw new Error("Message cannot be empty");
        }

        const storedThread = await this.ctx.storage.get<StoredThread>(`thread:${params.threadId}`);
        if (!storedThread) {
            throw new Error("Conversation thread not found");
        }

        const now = Date.now();
        storedThread.updatedAt = now;
        storedThread.unreadByAdmin = 0;
        storedThread.unreadByVisitor = (storedThread.unreadByVisitor || 0) + 1;
        storedThread.lastMessagePreview = `You: ${text.slice(0, 130)}`;

        const messages = await this.getMessages(storedThread.id);
        for (const msg of messages) {
            if (msg.sender === "visitor" && !msg.readAt) {
                msg.readAt = now;
            }
        }

        const message: ChatMessage = {
            id: `msg_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`,
            threadId: storedThread.id,
            sender: "admin",
            senderName: "Steace • Code Rage",
            text,
            createdAt: now,
        };
        messages.push(message);
        if (messages.length > 300) {
            messages.splice(0, messages.length - 300);
        }

        await this.ctx.storage.put({
            [`thread:${storedThread.id}`]: storedThread,
            [`messages:${storedThread.id}`]: messages,
        });

        const publicThread = this.sanitizeThread(storedThread);
        const event: WsServerEvent = {
            type: "message",
            thread: publicThread,
            message,
        };

        this.broadcastToTag("role:admin", event);
        this.broadcastToTag(`thread:${storedThread.id}`, event);

        return { thread: publicThread, message };
    }

    async fetch(request: Request): Promise<Response> {
        const url = new URL(request.url);
        const path = url.pathname;

        // WebSocket upgrade
        if (request.headers.get("Upgrade")?.toLowerCase() === "websocket") {
            const role = url.searchParams.get("role") === "admin" ? "admin" : "visitor";
            const threadId = url.searchParams.get("threadId") || undefined;
            const visitorToken = url.searchParams.get("token") || undefined;

            const pair = new WebSocketPair();
            const [client, server] = Object.values(pair);

            const tags: string[] = [`role:${role}`];
            let validThread: StoredThread | undefined;

            if (role === "visitor" && threadId && visitorToken) {
                const candidate = await this.ctx.storage.get<StoredThread>(`thread:${threadId}`);
                if (candidate && validateToken(candidate.visitorToken, visitorToken)) {
                    validThread = candidate;
                    tags.push(`thread:${threadId}`);
                }
            }

            const attachment: WsAttachment = {
                role,
                threadId: validThread?.id,
                visitorToken: validThread?.visitorToken,
            };

            this.ctx.acceptWebSocket(server, tags);
            server.serializeAttachment(attachment);

            const presence = await this.getPresenceState();

            if (role === "admin") {
                const [threads, vapidKeys, passkeys, pushSubs] = await Promise.all([
                    this.listThreads(),
                    this.getVapidKeys(),
                    this.getPasskeys(),
                    this.getPushSubscriptions(),
                ]);
                this.sendEvent(server, {
                    type: "admin_init",
                    presence,
                    threads,
                    vapidPublicKey: vapidKeys.publicKey,
                    passkeys: passkeys.map(({ publicKeySpki: _spki, ...rest }) => rest),
                    pushCount: pushSubs.length,
                });
                // Notify everyone that admin is live
                this.broadcastAll({ type: "presence", presence });
            } else {
                const messages = validThread ? await this.getMessages(validThread.id) : [];
                this.sendEvent(server, {
                    type: "visitor_init",
                    presence,
                    thread: validThread ? this.sanitizeThread(validThread) : null,
                    messages,
                });
                if (validThread) {
                    this.broadcastToTag("role:admin", {
                        type: "thread_updated",
                        thread: this.sanitizeThread(validThread),
                    });
                }
            }

            return new Response(null, { status: 101, webSocket: client });
        }

        try {
            if (path.endsWith("/status") && request.method === "GET") {
                const threadId = url.searchParams.get("threadId");
                const token = url.searchParams.get("token");
                const [presence, passkeys, passcodeHash, vapidKeys] = await Promise.all([
                    this.getPresenceState(),
                    this.getPasskeys(),
                    this.ctx.storage.get<string>("admin_passcode_hash"),
                    this.getVapidKeys(),
                ]);

                let thread: ChatThread | null = null;
                let messages: ChatMessage[] = [];
                if (threadId && token) {
                    const candidate = await this.ctx.storage.get<StoredThread>(`thread:${threadId}`);
                    if (candidate && validateToken(candidate.visitorToken, token)) {
                        thread = this.sanitizeThread(candidate);
                        messages = await this.getMessages(candidate.id);
                    }
                }

                return Response.json({
                    presence,
                    passkeysCount: passkeys.length,
                    hasStoredPasscode: Boolean(passcodeHash),
                    vapidPublicKey: vapidKeys.publicKey,
                    thread,
                    messages,
                });
            }

            if (path.endsWith("/visitor/message") && request.method === "POST") {
                const body = (await request.json()) as {
                    threadId?: string;
                    visitorToken?: string;
                    visitorName?: string;
                    visitorContact?: string;
                    topic?: string;
                    text: string;
                };
                const result = await this.handleVisitorMessage(body);
                return Response.json(result);
            }

            if (path.endsWith("/admin/bootstrap") && request.method === "GET") {
                const [presence, threads, vapidKeys, passkeys, pushSubs] = await Promise.all([
                    this.getPresenceState(),
                    this.listThreads(),
                    this.getVapidKeys(),
                    this.getPasskeys(),
                    this.getPushSubscriptions(),
                ]);
                return Response.json({
                    presence,
                    threads,
                    vapidPublicKey: vapidKeys.publicKey,
                    passkeys: passkeys.map(({ publicKeySpki: _spki, ...rest }) => rest),
                    pushCount: pushSubs.length,
                });
            }

            if (path.endsWith("/admin/thread") && request.method === "GET") {
                const threadId = url.searchParams.get("threadId") || "";
                const stored = await this.ctx.storage.get<StoredThread>(`thread:${threadId}`);
                if (!stored) {
                    return Response.json({ error: "Thread not found" }, { status: 404 });
                }
                const messages = await this.getMessages(threadId);
                return Response.json({
                    thread: this.sanitizeThread(stored),
                    messages,
                });
            }

            if (path.endsWith("/admin/reply") && request.method === "POST") {
                const body = (await request.json()) as { threadId: string; text: string };
                const result = await this.handleAdminMessage(body);
                return Response.json(result);
            }

            if (path.endsWith("/admin/availability") && request.method === "POST") {
                const body = (await request.json()) as { available: boolean; statusText?: string };
                const available = Boolean(body.available);
                const statusText = body.statusText?.trim().slice(0, 40) || (available ? "Available" : "Away");
                await this.ctx.storage.put("presence", {
                    available,
                    statusText,
                    updatedAt: Date.now(),
                });
                const presence = await this.getPresenceState();
                this.broadcastAll({ type: "presence", presence });
                return Response.json({ presence });
            }

            if (path.endsWith("/admin/passcode/verify") && request.method === "POST") {
                const body = (await request.json()) as {
                    passcode: string;
                    envAdminSecret?: string;
                };
                const passcode = (body.passcode || "").trim();
                if (!passcode || passcode.length < 4) {
                    return Response.json(
                        { ok: false, error: "Passcode must be at least 4 characters" },
                        { status: 400 }
                    );
                }

                const storedHash = await this.ctx.storage.get<string>("admin_passcode_hash");
                const passkeys = await this.getPasskeys();

                // 1. Check env ADMIN_SECRET if configured
                if (body.envAdminSecret && validateToken(body.envAdminSecret, passcode)) {
                    return Response.json({ ok: true });
                }

                // 2. Check DO-stored PBKDF2 passcode hash if configured
                if (storedHash) {
                    const valid = await verifyPasscodeHash(passcode, storedHash);
                    if (valid) {
                        return Response.json({ ok: true });
                    }
                    return Response.json({ ok: false, error: "Invalid admin passcode" }, { status: 401 });
                }

                // 3. First-time bootstrap: if neither envAdminSecret nor storedHash nor passkeys exist,
                // save this passcode as the initial admin passcode in Durable Object storage.
                if (!body.envAdminSecret && passkeys.length === 0) {
                    const newHash = await hashPasscode(passcode);
                    await this.ctx.storage.put("admin_passcode_hash", newHash);
                    return Response.json({ ok: true, bootstrapped: true });
                }

                return Response.json({ ok: false, error: "Invalid admin passcode" }, { status: 401 });
            }

            if (path.endsWith("/admin/passcode/update") && request.method === "POST") {
                const body = (await request.json()) as { newPasscode: string };
                const newPasscode = (body.newPasscode || "").trim();
                if (newPasscode.length < 6) {
                    return Response.json({ error: "Passcode must be at least 6 characters" }, { status: 400 });
                }
                const newHash = await hashPasscode(newPasscode);
                await this.ctx.storage.put("admin_passcode_hash", newHash);
                return Response.json({ ok: true });
            }

            if (path.endsWith("/admin/webauthn/challenge") && request.method === "POST") {
                const body = (await request.json()) as { purpose: "register" | "login" };
                const challenge = generateWebAuthnChallenge();
                const challenges = (await this.ctx.storage.get<Record<string, StoredChallenge>>("challenges")) || {};

                const now = Date.now();
                // Prune expired challenges
                for (const [k, v] of Object.entries(challenges)) {
                    if (v.expiresAt < now) {
                        delete challenges[k];
                    }
                }

                challenges[challenge] = {
                    challenge,
                    purpose: body.purpose,
                    expiresAt: now + 5 * 60 * 1000,
                };
                await this.ctx.storage.put("challenges", challenges);

                const passkeys = await this.getPasskeys();
                return Response.json({
                    challenge,
                    allowCredentialIds: passkeys.map((p) => p.id),
                });
            }

            if (path.endsWith("/admin/webauthn/register") && request.method === "POST") {
                const body = (await request.json()) as {
                    credentialId: string;
                    clientDataJSON: string;
                    publicKeySpki: string;
                    algorithm?: number;
                    authenticatorData?: string;
                    deviceName?: string;
                    challenge: string;
                    origin: string;
                    rpId: string;
                };

                const challenges = (await this.ctx.storage.get<Record<string, StoredChallenge>>("challenges")) || {};
                const storedChallenge = challenges[body.challenge];
                if (
                    !storedChallenge ||
                    storedChallenge.purpose !== "register" ||
                    storedChallenge.expiresAt < Date.now()
                ) {
                    return Response.json({ error: "Registration challenge expired or invalid" }, { status: 400 });
                }

                delete challenges[body.challenge];
                await this.ctx.storage.put("challenges", challenges);

                const credential = await verifyPasskeyRegistration({
                    credentialId: body.credentialId,
                    clientDataJSON: body.clientDataJSON,
                    publicKeySpki: body.publicKeySpki,
                    algorithm: body.algorithm,
                    authenticatorData: body.authenticatorData,
                    deviceName: body.deviceName,
                    expectedChallenge: body.challenge,
                    expectedOrigin: body.origin,
                    expectedRpId: body.rpId,
                });

                const passkeys = await this.getPasskeys();
                const filtered = passkeys.filter((p) => p.id !== credential.id);
                filtered.push(credential);
                await this.ctx.storage.put("passkeys", filtered);

                return Response.json({
                    ok: true,
                    passkeys: filtered.map(({ publicKeySpki: _spki, ...rest }) => rest),
                });
            }

            if (path.endsWith("/admin/webauthn/login") && request.method === "POST") {
                const body = (await request.json()) as {
                    credentialId: string;
                    clientDataJSON: string;
                    authenticatorData: string;
                    signature: string;
                    challenge: string;
                    origin: string;
                    rpId: string;
                };

                const challenges = (await this.ctx.storage.get<Record<string, StoredChallenge>>("challenges")) || {};
                const storedChallenge = challenges[body.challenge];
                if (!storedChallenge || storedChallenge.purpose !== "login" || storedChallenge.expiresAt < Date.now()) {
                    return Response.json({ error: "Login challenge expired or invalid" }, { status: 400 });
                }

                delete challenges[body.challenge];
                await this.ctx.storage.put("challenges", challenges);

                const passkeys = await this.getPasskeys();
                const credential = passkeys.find((p) => p.id === body.credentialId);
                if (!credential) {
                    return Response.json({ error: "Passkey not recognized" }, { status: 401 });
                }

                const { newCounter } = await verifyPasskeyAssertion({
                    credentialId: body.credentialId,
                    clientDataJSON: body.clientDataJSON,
                    authenticatorData: body.authenticatorData,
                    signature: body.signature,
                    expectedChallenge: body.challenge,
                    expectedOrigin: body.origin,
                    expectedRpId: body.rpId,
                    credential,
                });

                credential.counter = newCounter;
                credential.lastUsedAt = Date.now();
                await this.ctx.storage.put("passkeys", passkeys);

                return Response.json({ ok: true, deviceName: credential.deviceName });
            }

            if (path.endsWith("/admin/webauthn/delete") && request.method === "POST") {
                const body = (await request.json()) as { credentialId: string };
                const passkeys = await this.getPasskeys();
                const updated = passkeys.filter((p) => p.id !== body.credentialId);
                await this.ctx.storage.put("passkeys", updated);
                return Response.json({
                    ok: true,
                    passkeys: updated.map(({ publicKeySpki: _spki, ...rest }) => rest),
                });
            }

            if (path.endsWith("/admin/push/subscribe") && request.method === "POST") {
                const body = (await request.json()) as {
                    subscription: PushSubscriptionRecord;
                };
                if (!body.subscription?.endpoint || !body.subscription?.keys?.p256dh) {
                    return Response.json({ error: "Invalid push subscription" }, { status: 400 });
                }
                const subs = await this.getPushSubscriptions();
                const filtered = subs.filter((s) => s.endpoint !== body.subscription.endpoint);
                filtered.push({
                    ...body.subscription,
                    createdAt: Date.now(),
                });
                await this.ctx.storage.put("push_subs", filtered);
                return Response.json({ ok: true, pushCount: filtered.length });
            }

            if (path.endsWith("/admin/push/unsubscribe") && request.method === "POST") {
                const body = (await request.json()) as { endpoint: string };
                const subs = await this.getPushSubscriptions();
                const filtered = subs.filter((s) => s.endpoint !== body.endpoint);
                await this.ctx.storage.put("push_subs", filtered);
                return Response.json({ ok: true, pushCount: filtered.length });
            }

            if (path.endsWith("/admin/push/test") && request.method === "POST") {
                const subs = await this.getPushSubscriptions();
                const vapidKeys = await this.getVapidKeys();
                let delivered = 0;
                for (const sub of subs) {
                    const res = await sendWebPushNotification(
                        sub,
                        {
                            title: "Code Rage Inbox • Push Active",
                            body: "Real-time direct message alerts are active on this device.",
                            url: "/inbox",
                            unreadCount: 0,
                            ts: Date.now(),
                        },
                        vapidKeys
                    );
                    if (res.ok) delivered++;
                }
                return Response.json({ ok: true, delivered, total: subs.length });
            }

            return Response.json({ error: "Not found" }, { status: 404 });
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Unexpected Durable Object error";
            return Response.json({ error: msg }, { status: 400 });
        }
    }

    async webSocketMessage(ws: WebSocket, rawMessage: string | ArrayBuffer): Promise<void> {
        const textData = typeof rawMessage === "string" ? rawMessage : new TextDecoder().decode(rawMessage);

        let payload: Record<string, any>;
        try {
            payload = JSON.parse(textData);
        } catch {
            this.sendEvent(ws, { type: "error", error: "Invalid JSON payload" });
            return;
        }

        const attachment = (ws.deserializeAttachment() || { role: "visitor" }) as WsAttachment;

        if (payload.type === "ping") {
            this.sendEvent(ws, { type: "pong", ts: Date.now() });
            return;
        }

        try {
            if (payload.type === "send_message") {
                if (attachment.role === "admin") {
                    if (!payload.threadId || typeof payload.text !== "string") return;
                    await this.handleAdminMessage({
                        threadId: payload.threadId,
                        text: payload.text,
                    });
                } else {
                    const result = await this.handleVisitorMessage({
                        threadId: attachment.threadId || payload.threadId,
                        visitorToken: attachment.visitorToken || payload.visitorToken,
                        visitorName: payload.visitorName,
                        visitorContact: payload.visitorContact,
                        topic: payload.topic,
                        text: String(payload.text || ""),
                    });
                    if (!attachment.threadId) {
                        attachment.threadId = result.threadId;
                        attachment.visitorToken = result.visitorToken;
                        ws.serializeAttachment(attachment);
                    }
                    // Also ensure the current socket gets the message event even if it wasn't tagged with threadId initially
                    this.sendEvent(ws, {
                        type: "message",
                        thread: result.thread,
                        message: result.message,
                    });
                }
                return;
            }

            if (payload.type === "typing") {
                const threadId = attachment.role === "admin" ? String(payload.threadId || "") : attachment.threadId;
                if (!threadId) return;
                const event: WsServerEvent = {
                    type: "typing",
                    threadId,
                    sender: attachment.role,
                    isTyping: Boolean(payload.isTyping),
                };
                if (attachment.role === "admin") {
                    this.broadcastToTag(`thread:${threadId}`, event);
                } else {
                    this.broadcastToTag("role:admin", event);
                }
                return;
            }

            if (payload.type === "mark_read") {
                const threadId = attachment.role === "admin" ? String(payload.threadId || "") : attachment.threadId;
                if (!threadId) return;
                const storedThread = await this.ctx.storage.get<StoredThread>(`thread:${threadId}`);
                if (!storedThread) return;

                const now = Date.now();
                const messages = await this.getMessages(threadId);
                let updated = false;

                if (attachment.role === "admin") {
                    if (storedThread.unreadByAdmin > 0) {
                        storedThread.unreadByAdmin = 0;
                        updated = true;
                    }
                    for (const m of messages) {
                        if (m.sender === "visitor" && !m.readAt) {
                            m.readAt = now;
                            updated = true;
                        }
                    }
                } else {
                    if (storedThread.unreadByVisitor > 0) {
                        storedThread.unreadByVisitor = 0;
                        updated = true;
                    }
                    for (const m of messages) {
                        if (m.sender === "admin" && !m.readAt) {
                            m.readAt = now;
                            updated = true;
                        }
                    }
                }

                if (updated) {
                    await this.ctx.storage.put({
                        [`thread:${threadId}`]: storedThread,
                        [`messages:${threadId}`]: messages,
                    });
                    const readEvent: WsServerEvent = {
                        type: "read",
                        threadId,
                        reader: attachment.role,
                        readAt: now,
                    };
                    this.broadcastToTag("role:admin", readEvent);
                    this.broadcastToTag(`thread:${threadId}`, readEvent);
                }
                return;
            }

            if (attachment.role === "admin") {
                if (payload.type === "get_thread" && typeof payload.threadId === "string") {
                    const stored = await this.ctx.storage.get<StoredThread>(`thread:${payload.threadId}`);
                    if (!stored) return;
                    const messages = await this.getMessages(payload.threadId);
                    this.sendEvent(ws, {
                        type: "thread_messages",
                        thread: this.sanitizeThread(stored),
                        messages,
                    });
                    return;
                }

                if (payload.type === "set_availability") {
                    const available = Boolean(payload.available);
                    const statusText =
                        typeof payload.statusText === "string" && payload.statusText.trim()
                            ? payload.statusText.trim().slice(0, 40)
                            : available
                              ? "Available"
                              : "Away";
                    await this.ctx.storage.put("presence", {
                        available,
                        statusText,
                        updatedAt: Date.now(),
                    });
                    const presence = await this.getPresenceState();
                    this.broadcastAll({ type: "presence", presence });
                    return;
                }

                if (payload.type === "archive_thread" && typeof payload.threadId === "string") {
                    const stored = await this.ctx.storage.get<StoredThread>(`thread:${payload.threadId}`);
                    if (!stored) return;
                    stored.status = payload.status === "archived" ? "archived" : "open";
                    stored.updatedAt = Date.now();
                    await this.ctx.storage.put(`thread:${stored.id}`, stored);
                    this.broadcastToTag("role:admin", {
                        type: "thread_updated",
                        thread: this.sanitizeThread(stored),
                    });
                    return;
                }

                if (payload.type === "delete_thread" && typeof payload.threadId === "string") {
                    await this.ctx.storage.delete([`thread:${payload.threadId}`, `messages:${payload.threadId}`]);
                    this.broadcastToTag("role:admin", {
                        type: "thread_deleted",
                        threadId: payload.threadId,
                    });
                    return;
                }
            }
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Realtime operation failed";
            this.sendEvent(ws, { type: "error", error: msg });
        }
    }

    async webSocketClose(ws: WebSocket, code: number, reason: string, _wasClean: boolean): Promise<void> {
        try {
            ws.close(code, reason);
        } catch {
            // Already closed
        }
        const attachment = ws.deserializeAttachment() as WsAttachment | null;
        if (attachment?.role === "admin") {
            const presence = await this.getPresenceState();
            this.broadcastAll({ type: "presence", presence });
        } else if (attachment?.threadId) {
            const stored = await this.ctx.storage.get<StoredThread>(`thread:${attachment.threadId}`);
            if (stored) {
                this.broadcastToTag("role:admin", {
                    type: "thread_updated",
                    thread: this.sanitizeThread(stored),
                });
            }
        }
    }

    async webSocketError(ws: WebSocket, _error: unknown): Promise<void> {
        try {
            ws.close(1011, "WebSocket Error");
        } catch {
            // Ignore
        }
    }
}
