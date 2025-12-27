# Security Best Practices

This document outlines the security measures implemented in this application.

## Authentication & Authorization

### CSRF Protection

- All forms use CSRF tokens with secure, HTTP-only cookies
- Tokens are 32 bytes of cryptographically secure random data
- Tokens expire after 1 hour
- Constant-time comparison prevents timing attacks
- SameSite=strict cookie attribute prevents CSRF

## Input Validation

### Contact Form

- All inputs validated with Zod schemas
- Name: 1-100 characters, alphanumeric + spaces/hyphens/apostrophes only
- Email: RFC 5321 compliant, max 254 characters
- Subject: 1-200 characters, trimmed
- Message: 10-5000 characters, trimmed
- HTML escaping prevents XSS in emails

### Rate Limiting of Contact Form

- 3 submissions per minute per IP address
- Returns 429 status with Retry-After header
- Uses Cloudflare CF-Connecting-IP header

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

### Email Security

- HTML escaping prevents XSS
- Sender/recipient addresses hardcoded (no user control)
- Reply-To address validated via Zod
- API keys never exposed to client

## Runtime Security

### Cloudflare Workers

- No Node.js APIs - only Web Standard APIs
- Isolated execution environment
- No file system access
- No persistent memory between requests

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
   - Test CSRF protection

5. **Backup Strategy**
   - Git repository is the source of truth
   - Cloudflare Workers maintains deployment history

## Security Checklist

- [x] CSRF protection on all forms
- [x] Input validation with strict schemas
- [x] HTML escaping to prevent XSS
- [x] Rate limiting on contact form
- [x] Secure HTTP headers
- [x] HTTPS-only cookies
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
