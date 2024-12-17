import type { AppLoadContext } from "@remix-run/cloudflare";

export const CSRF_HEADER_NAME = 'X-CSRF-Token';
const CSRF_COOKIE_NAME = 'csrf-token';
const TOKEN_BYTES = 32;

declare global {
    interface Env {
        CSRF_SECRET: string;
    }
}

class CSRFProtection {
    private secret: string;

    constructor(env: Env) {
        this.secret = env.CSRF_SECRET || 'default-csrf-secret';
    }

    generateToken(): string {
        const array = new Uint8Array(TOKEN_BYTES);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    async createHash(token: string): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(token + this.secret);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    async validateToken(token: string, hash: string): Promise<boolean> {
        const computedHash = await this.createHash(token);
        return computedHash === hash;
    }

    getTokenFromRequest(request: Request): string | null {
        const cookie = request.headers.get('Cookie');
        if (!cookie) return null;

        const match = cookie.match(new RegExp(`${CSRF_COOKIE_NAME}=([^;]+)`));
        return match ? match[1] : null;
    }

    createCookieHeader(token: string): string {
        return `${CSRF_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Secure`;
    }
}

export function createCSRFProtection(context: AppLoadContext) {
    return new CSRFProtection(context.env as Env);
}

export type { CSRFProtection }; 