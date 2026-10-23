import { describe, expect, it } from "vitest";
import { cloudflareContext, getEnvFromContext } from "./context";

describe("context.ts getEnvFromContext", () => {
    it("returns empty object for null, undefined, or empty object", () => {
        expect(getEnvFromContext(null)).toEqual({});
        expect(getEnvFromContext(undefined)).toEqual({});
        expect(getEnvFromContext({})).toEqual({});
        expect(getEnvFromContext("string" as any)).toEqual({});
    });

    it("extracts env from modern router context provider with cloudflareContext", () => {
        const mockEnv = { ADMIN_SECRET: "test-secret" } as unknown as Env;
        const mockProvider = {
            get: (ctx: unknown) => {
                if (ctx === cloudflareContext) {
                    return { env: mockEnv, ctx: {} as ExecutionContext };
                }
                return undefined;
            },
        };

        const env = getEnvFromContext(mockProvider);
        expect(env).toBe(mockEnv);
    });

    it("falls back to legacy when router context provider throws or returns no env", () => {
        const mockEnv = { ADMIN_SECRET: "legacy-fallback" } as unknown as Env;
        const mockProvider = {
            get: () => {
                throw new Error("Context not found");
            },
            cloudflare: { env: mockEnv },
        };

        const env = getEnvFromContext(mockProvider);
        expect(env).toBe(mockEnv);
    });

    it("extracts env from legacy context.cloudflare.env", () => {
        const mockEnv = { DIRECT_MESSAGE_HUB: "mock-hub" } as unknown as Env;
        const context = {
            cloudflare: {
                env: mockEnv,
            },
        };
        expect(getEnvFromContext(context)).toBe(mockEnv);
    });

    it("extracts env from legacy context.env", () => {
        const mockEnv = { DIRECT_MESSAGE_HUB: "mock-hub-2" } as unknown as Env;
        const context = {
            env: mockEnv,
        };
        expect(getEnvFromContext(context)).toBe(mockEnv);
    });

    it("prefers cloudflare.env over env if both are present in legacy context", () => {
        const cfEnv = { val: "cf" } as unknown as Env;
        const rawEnv = { val: "raw" } as unknown as Env;
        const context = {
            cloudflare: { env: cfEnv },
            env: rawEnv,
        };
        expect(getEnvFromContext(context)).toBe(cfEnv);
    });
});
