type RateLimitEntry = {
    count: number;
    firstAttempt: number;
};

const RATE_LIMIT_DURATION = 3600000; // 1 hour in milliseconds
const MAX_ATTEMPTS = 3; // Maximum attempts per hour

class RateLimiter {
    private attempts = new Map<string, RateLimitEntry>();

    isRateLimited(identifier: string): boolean {
        const now = Date.now();
        const entry = this.attempts.get(identifier);

        if (!entry) {
            this.attempts.set(identifier, { count: 1, firstAttempt: now });
            return false;
        }

        // Reset if the duration has passed
        if (now - entry.firstAttempt > RATE_LIMIT_DURATION) {
            this.attempts.set(identifier, { count: 1, firstAttempt: now });
            return false;
        }

        // Increment attempt count
        entry.count += 1;
        this.attempts.set(identifier, entry);

        return entry.count > MAX_ATTEMPTS;
    }

    getRemainingAttempts(identifier: string): number {
        const entry = this.attempts.get(identifier);
        if (!entry) return MAX_ATTEMPTS;

        const remaining = MAX_ATTEMPTS - entry.count;
        return remaining > 0 ? remaining : 0;
    }

    // Clean up old entries periodically
    cleanup(): void {
        const now = Date.now();
        for (const [key, entry] of this.attempts.entries()) {
            if (now - entry.firstAttempt > RATE_LIMIT_DURATION) {
                this.attempts.delete(key);
            }
        }
    }
}

export const rateLimiter = new RateLimiter();

// Run cleanup every hour
setInterval(() => rateLimiter.cleanup(), RATE_LIMIT_DURATION); 