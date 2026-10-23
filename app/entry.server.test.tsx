import { describe, expect, it, vi } from "vitest";
import type { EntryContext } from "react-router";

vi.mock("react-dom/server", () => ({
    renderToReadableStream: vi.fn().mockImplementation(() => {
        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(new TextEncoder().encode("<!DOCTYPE html><html><body>ok</body></html>"));
                controller.close();
            },
        });
        (stream as any).allReady = Promise.resolve();
        return Promise.resolve(stream);
    }),
}));

vi.mock("react-router", () => ({
    ServerRouter: vi.fn().mockReturnValue(null),
}));

import handleRequest from "./entry.server";

describe("entry.server handleRequest", () => {
    const mockEntryContext = {} as unknown as EntryContext;

    it("attaches required security headers to HTML response", async () => {
        const req = new Request("https://example.com/computer-repair");
        const headers = new Headers();
        const res = await handleRequest(req, 200, headers, mockEntryContext, {} as any);

        expect(res.status).toBe(200);
        expect(res.headers.get("Content-Type")).toBe("text/html");
        expect(res.headers.get("X-Frame-Options")).toBe("DENY");
        expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
        expect(res.headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
        expect(res.headers.get("Cross-Origin-Opener-Policy")).toBe("same-origin");
        expect(res.headers.get("Strict-Transport-Security")).toContain("max-age=63072000");
        expect(res.headers.get("Permissions-Policy")).toContain("camera=()");
        expect(res.headers.get("Content-Security-Policy")).toContain("default-src 'self'");
    });

    it("attaches Link headers for API catalog on root path", async () => {
        const reqRoot = new Request("https://example.com/");
        const resRoot = await handleRequest(reqRoot, 200, new Headers(), mockEntryContext, {} as any);
        expect(resRoot.headers.get("Link")).toBe(
            '</.well-known/api-catalog>; rel="api-catalog", </contact>; rel="service-doc"'
        );

        const reqOther = new Request("https://example.com/website-development");
        const resOther = await handleRequest(reqOther, 200, new Headers(), mockEntryContext, {} as any);
        expect(resOther.headers.get("Link")).toBeNull();
    });

    it("attaches noindex/noai X-Robots-Tag on /inbox and subpaths", async () => {
        const reqInbox = new Request("https://example.com/inbox");
        const resInbox = await handleRequest(reqInbox, 200, new Headers(), mockEntryContext, {} as any);
        expect(resInbox.headers.get("X-Robots-Tag")).toBe("noindex, nofollow, noai, noimageai");

        const reqInboxSub = new Request("https://example.com/inbox/thread-abc-123");
        const resInboxSub = await handleRequest(reqInboxSub, 200, new Headers(), mockEntryContext, {} as any);
        expect(resInboxSub.headers.get("X-Robots-Tag")).toBe("noindex, nofollow, noai, noimageai");

        const reqPublic = new Request("https://example.com/contact");
        const resPublic = await handleRequest(reqPublic, 200, new Headers(), mockEntryContext, {} as any);
        expect(resPublic.headers.get("X-Robots-Tag")).toBeNull();
    });

    it("handles bot requests by waiting for allReady stream resolution", async () => {
        const req = new Request("https://example.com/", {
            headers: {
                "User-Agent": "Googlebot/2.1 (+http://www.google.com/bot.html)",
            },
        });
        const res = await handleRequest(req, 200, new Headers(), mockEntryContext, {} as any);
        expect(res.status).toBe(200);
        expect(res.headers.get("Content-Type")).toBe("text/html");
    });
});
