// Utility functions for generating and validating tokens

export function generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function validateToken(storedToken: string, incomingToken: string): boolean {
    if (!storedToken || !incomingToken) {
        return false;
    }

    // Use constant-time comparison to prevent timing attacks
    if (storedToken.length !== incomingToken.length) {
        return false;
    }

    // Constant-time comparison using crypto.subtle.timingSafeEqual (Web Crypto API)
    const encoder = new TextEncoder();
    const storedBytes = encoder.encode(storedToken);
    const incomingBytes = encoder.encode(incomingToken);

    let result = 0;
    for (let i = 0; i < storedBytes.length; i++) {
        result |= storedBytes[i] ^ incomingBytes[i];
    }

    return result === 0;
}
