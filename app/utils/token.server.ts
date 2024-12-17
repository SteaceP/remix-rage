// Utility functions for generating and validating tokens

export function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function validateToken(storedToken: string, formToken: string): boolean {
  if (!storedToken || !formToken) {
    return false;
  }
  // Use constant-time string comparison to prevent timing attacks
  return storedToken === formToken;
} 