# Security Best Practices

This document outlines the security measures implemented in this application.

## Authentication & Authorization

### Session & Operator Authentication

- Constant-time comparison prevents timing attacks on token verification
- HMAC-signed session cookies for operator administration
- Passkey (WebAuthn) biometric authentication supported for passwordless admin login
- SameSite=strict, Secure, HttpOnly cookie attributes prevent cross-site request attacks

## Input Validation

### Direct Messaging & API Endpoints

- All inputs validated with Zod schemas
- Visitor name: trimmed string up to 100 characters
- Message body: trimmed text up to 2000 characters
- Contact info: optional phone/email string up to 160 characters
- Structured JSON and WebSocket frame validation prevents injection attacks

### API & WebSocket Rate Limiting

- IP-based rate limiting on visitor messaging and passcode login attempts
- Returns 429 status when limit is exceeded
- Cloudflare CF-Connecting-IP / X-Forwarded-For header identification

## Security Headers

### Content Security Policy (CSP)

- `default-src 'self'` - Only load resources from same origin
- `script-src 'self'` - No inline scripts, self-hosted only
- `style-src 'self' 'unsafe-inline'` - Allow inline styles for Tailwind
- `img-src 'self' data: https:` - Images from self and data URIs
- `connect-src 'self' wss: ws:` - API and WebSocket connections
- `frame-ancestors 'none'` - Prevent clickjacking
- `upgrade-insecure-requests` - Force HTTPS
- `block-all-mixed-content` - No HTTP on HTTPS pages

### HTTP Strict Transport Security (HSTS)

- 2-year max-age with includeSubDomains and preload
- Forces HTTPS for all connections

### Cross-Origin Policies

- `Cross-Origin-Opener-Policy: same-origin` - Isolate browsing context
- `Cross-Origin-Embedder-Policy: require-corp` - Require CORP for cross-origin resources
- `Cross-Origin-Resource-Policy: same-origin` - Prevent cross-origin access

### Additional Headers

- `X-Frame-Options: DENY` - Prevent clickjacking (legacy)
- `X-Content-Type-Options: nosniff` - Prevent MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Legacy XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin` - Privacy-conscious referrer

## Data Protection

### Environment Variables

- All secrets stored in Cloudflare environment variables
- Never committed to git (.env in .gitignore)
- Example file provided (.env.example)

### Message & Persistent Data Protection

- Direct messaging threads stored in SQLite within isolated Cloudflare Durable Objects
- Visitor session tokens securely stored in browser localStorage
- Operator credentials and WebAuthn challenges validated server-side
- Push notification payloads transmitted via encrypted Web Push (VAPID)

## Runtime Security

### Cloudflare Workers & Durable Objects

- No Node.js APIs - only Web Standard APIs
- Isolated execution environment
- No file system access
- Encrypted state storage

## Logging & Monitoring

### Error Handling

- Detailed errors logged server-side only
- Generic error messages sent to client
- No stack traces or sensitive data in responses

## Recommendations for Production

1. **Enable Cloudflare Bot Protection**
    - Protects against automated attacks
    - Free tier available

2. **Set up Cloudflare Rate Limiting Rules**
    - More robust than in-memory rate limiting
    - Persists across Workers

3. **Monitor Logs**
    - Set up Cloudflare Logs or external logging
    - Monitor for suspicious activity

4. **Regular Security Audits**
    - Update dependencies regularly (Dependabot configured)
    - Review security headers annually

5. **Backup Strategy**
    - Git repository is the source of truth
    - Cloudflare Workers maintains deployment history

## Security Checklist

- [x] Input validation with strict schemas
- [x] Rate limiting on messaging endpoints
- [x] Secure HTTP & WebSocket headers
- [x] HTTPS-only session cookies
- [x] Environment variables for secrets
- [x] No sensitive data in logs
- [x] Dependabot for dependency updates
- [x] .gitignore for sensitive files
- [ ] Cloudflare Bot Protection (recommended)
- [ ] External logging service (recommended)
- [ ] Security monitoring alerts (recommended)

## Reporting Security Issues

If you discover a security vulnerability, please email: <steace@coderage.pro>

Do NOT create a public GitHub issue for security vulnerabilities.
