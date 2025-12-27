# Copilot Instructions for Remix Rage

## Architecture

**React Router v7** app on **Cloudflare Workers** (not Node.js - use Web APIs only).

| Layer | Tech | Key Files |
|-------|------|-----------|
| Runtime | Cloudflare Workers | [workers/app.ts](../workers/app.ts), [wrangler.jsonc](../wrangler.jsonc) |
| Routing | File-based via `@react-router/fs-routes` | [app/routes.ts](../app/routes.ts) |
| Styling | Tailwind CSS v4, centralized style objects | [app/styles/](../app/styles/) |
| Forms | CSRF + Zod validation + rate limiting | [app/utils/](../app/utils/) |

## Commands

```bash
pnpm dev              # Dev server at localhost:5173
pnpm run build        # Production build
pnpm run deploy       # Build + deploy to Cloudflare
pnpm run typecheck    # TypeScript + Cloudflare types
```

## Critical Patterns

### Environment Variables (dev vs prod)
```tsx
// Always use this pattern in loaders/actions:
const env = context.cloudflare?.env || context.env;
const secret = env?.CSRF_SECRET;
if (!secret) throw new Error("CSRF_SECRET not configured");
```

### Centralized Styles (not inline Tailwind)
```tsx
import { contactStyles as styles } from "~/styles/components";
export default function Page() {
  return <div className={styles.wrapper}>...</div>;
}
```

Style objects must include: `focus-visible:`, `motion-reduce:`, `dark:` variants.

### Form Security (see [contact.tsx](../app/routes/contact.tsx))
```tsx
// Loader: create CSRF token
const { token, cookieHeader } = await createCsrfToken(request, env.CSRF_SECRET);
return Response.json({ csrfToken: token }, { headers: { "Set-Cookie": cookieHeader } });

// Action: validate before processing
const rateLimit = checkRateLimit(getRateLimitKey(request), 3, 60000);
if (!rateLimit.allowed) return Response.json({ error: "Too many requests" }, { status: 429 });
await validateCsrfToken(request, formData.get("csrfToken"), env.CSRF_SECRET);
```

**Security layers:**
- **CSRF**: Secure HTTP-only cookies with `sameSite=strict`, Web Crypto for token generation
- **Rate limiting**: In-memory per-IP tracking in [rate-limit.server.ts](../app/utils/rate-limit.server.ts)
- **Validation**: Zod schemas with length limits + regex patterns (see `emailSchema`)
- **XSS**: HTML escaping for user input in emails
- **Headers**: CSP, HSTS, CORS in [public/_headers](../public/_headers)

### Route Structure
```tsx
import { type LoaderFunctionArgs, type ActionFunctionArgs } from "react-router";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Page - Code Rage" },
  { name: "description", content: "..." }
];

export async function loader({ request, context }: LoaderFunctionArgs) { ... }
export async function action({ request, context }: ActionFunctionArgs) { ... }
export default function Page() { ... }
```

## Gotchas

1. **No Node.js APIs** - use `fetch()`, `crypto`, `Request`/`Response` (Web APIs)
2. **Vite config uses `@cloudflare/vite-plugin`** - see [vite.config.ts](../vite.config.ts)
3. **Type extensions** live in [load-context.ts](../load-context.ts)
4. **Security headers** configured in [public/_headers](../public/_headers)
5. **State management** - use loaders/actions, avoid client-side state libraries

## Style Guidelines

- **200ms** for simple transitions (colors), **300ms** for complex (scale, shadows)
- All interactive elements need `focus-visible:ring-2` states
- All animations need `motion-reduce:transition-none` fallbacks
- Organize in: `components.ts` (UI), `layout.ts` (structure), `sections.ts` (page sections)

### Accessibility Checklist (WCAG 2.1 AA)

When adding/modifying styles, ensure:
- ✅ `focus-visible` states on all interactive elements (not just `focus`)
- ✅ `motion-reduce` variants for animations/transforms
- ✅ `dark:` variants for all colors (text, backgrounds, borders)
- ✅ Consistent transition durations (200ms simple, 300ms complex)
- ✅ `active:` states for buttons/links (hover → active → disabled)
- ✅ `disabled:opacity-50 disabled:cursor-not-allowed` for disabled states
- ✅ Ring offsets match background: `focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800`
- ✅ Hover states don't rely on color alone

## External Integrations

| Service | Purpose | Config Location |
|---------|---------|-----------------|
| **Brevo API** | Contact form emails | `BREVO_API_KEY` env var, [email.server.ts](../app/utils/email.server.ts) |
| **Google Fonts** | Inter font family | Preconnected in [root.tsx](../app/root.tsx) |
| **Cloudflare Workers** | Edge runtime | [workers/app.ts](../workers/app.ts), [wrangler.jsonc](../wrangler.jsonc) |

**Required env vars:** `CSRF_SECRET`, `BREVO_API_KEY` (set in `.env` locally, Cloudflare dashboard for prod)
