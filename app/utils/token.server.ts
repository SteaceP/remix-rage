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

    // Use constant-time comparison that does not leak length via early exit
    const encoder = new TextEncoder();
    const storedBytes = encoder.encode(storedToken);
    const incomingBytes = encoder.encode(incomingToken);

    const lenA = storedBytes.length;
    const lenB = incomingBytes.length;
    let result = lenA ^ lenB;

    for (let i = 0; i < lenA; i++) {
        result |= storedBytes[i] ^ incomingBytes[i % (lenB || 1)];
    }

    return result === 0;
}
