import { createCookie } from "@remix-run/cloudflare";
import { generateToken, validateToken } from "./token.server";

export function createCsrfCookie(secret: string) {
  return createCookie("csrf-token", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    secrets: [secret],
    maxAge: 3600
  });
}

export async function createCsrfToken(request: Request, secret: string) {
  const csrfCookie = createCsrfCookie(secret);
  try {
    const existingToken = await csrfCookie.parse(request.headers.get("Cookie"));
    const token = existingToken || generateToken();
    const serialized = await csrfCookie.serialize(token);
    
    return { token, cookieHeader: serialized };
  } catch (error) {
    console.error("CSRF Token creation error:", error);
    const token = generateToken();
    const serialized = await csrfCookie.serialize(token);
    return { token, cookieHeader: serialized };
  }
}

export async function validateCsrfToken(request: Request, formToken: string, secret: string) {
  const csrfCookie = createCsrfCookie(secret);
  try {
    const cookieToken = await csrfCookie.parse(request.headers.get("Cookie"));
    
    if (!cookieToken || !formToken) {
      throw new Error("Missing CSRF token");
    }

    if (!validateToken(cookieToken, formToken)) {
      throw new Error("Invalid CSRF token");
    }
  } catch (error) {
    console.error("CSRF Validation error:", error);
    throw new Error("Invalid CSRF token");
  }
}