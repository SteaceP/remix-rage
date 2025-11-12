# Copilot Instructions for Remix Rage

## Architecture Overview

This is a **React Router v7** application (migrated from Remix v2) deployed on **Cloudflare Pages** with Functions, featuring a service business website. Key architectural decisions:

- **Runtime**: Cloudflare Workers (not Node.js) - use Web APIs, not Node.js APIs
- **Routing**: React Router v7 with file-based routing via `@react-router/fs-routes`
- **Styling**: Tailwind CSS v4 with centralized style objects in `app/styles/`
- **Forms**: Progressive enhancement with CSRF protection, Zod validation, and rate limiting
- **Email**: Brevo API integration with HTML sanitization to prevent XSS
- **Assets**: Static files in `public/` served directly by Cloudflare
- **Security**: Comprehensive security headers, CSRF tokens, rate limiting, and input validation (see SECURITY.md)

## Critical Development Workflows

```bash
# Local development
pnpm run dev          # Starts on http://localhost:5173
# or
pnpm dev              # Shorthand

# Build and deploy
pnpm run build        # React Router build
pnpm run deploy       # Wrangler deploy after build (direct to Workers)
pnpm run preview      # Preview build locally

# Type checking
pnpm run typecheck    # TypeScript validation + Cloudflare types
pnpm run cf-typegen   # Generate Cloudflare Workers types

# Note: cf-typegen runs automatically on postinstall
# Note: Environment variables loaded from .env file in development
```

## Chrome DevTools Integration

This project includes **Chrome Automatic Workspace Folders** (M-135+) for enhanced debugging:

- **Automatic workspace detection**: Chrome DevTools automatically connects to the project folder when accessing `http://localhost:5173`
- **Live editing capability**: Edit and save files directly from Chrome DevTools to the filesystem
- **Zero manual setup**: Works automatically without VS Code launch configuration
- **Configuration location**: `public/.well-known/appspecific/com.chrome.devtools.json`
- **Workspace UUID**: `b5982ef4-fde4-403a-9d95-9e2546ee6aff` (unique identifier for this project)

**Requirements:**

- Chrome M-136+ (enabled by default)
- Chrome M-135+ with feature flags enabled:
    - `chrome://flags#devtools-project-settings`
    - `chrome://flags#devtools-automatic-workspace-folders`
- **Alternative**: Launch Chrome with `--enable-features=DevToolsWellKnown,DevToolsAutomaticFileSystems`

**Benefits for development:**

- Breakpoints set in DevTools persist across page reloads
- Source maps automatically resolve to workspace files
- Changes made in DevTools Sources panel save directly to disk
- No manual folder mapping required in DevTools Workspace tab

## Project-Specific Patterns

### Style Architecture

- **Centralized styles**: Use objects from `app/styles/` instead of inline Tailwind
- **Pattern**: `import { contactStyles as styles } from "~/styles/components"` then `className={styles.wrapper}`
- **Dark mode**: All styles include dark: variants (e.g., `dark:bg-gray-800`)
- **Custom animations**: Defined in `tailwind.config.ts` (draw-arrow, marquee, marquee2)
- **Style categories**: `navigation`, `cards`, `form`, `footer`, `contactStyles` in components.ts
- **Consistent patterns**: Hover effects, transitions, focus states across all components

### React Router v7 Structure

- **File-based routing**: Uses `@react-router/fs-routes` with `app/routes.ts` config
- **Route exports**: `loader`, `action`, `default` component exports same as Remix
- **Loader pattern**: Use `LoaderFunctionArgs` with `context.cloudflare.env` for environment variables
- **Action pattern**: Form handling with CSRF validation via `app/utils/csrf.server.ts`

### Component Patterns

```tsx
// Standard component structure with styles import
import { contactStyles as styles } from "~/styles/components";

export default function Component() {
    return <div className={styles.wrapper}>...</div>;
}
```

**Note**: Some routes (like `_index.tsx`) define inline style objects at the component level when styles are unique to that page. Use `app/styles/` for shared/reusable styles.

### SEO Patterns

```tsx
// Every route should export meta for SEO
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
    return [{ title: "Page Title - Code Rage" }, { name: "description", content: "Page description..." }];
};
```

### Route Patterns

```tsx
// Standard route with CSRF protection (React Router v7)
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { useLoaderData, useActionData } from "react-router";

export async function loader({ request, context }: LoaderFunctionArgs) {
    const { token, cookieHeader } = await createCsrfToken(request, context.cloudflare.env.CSRF_SECRET);
    return Response.json(
        { csrfToken: token },
        {
            headers: { "Set-Cookie": cookieHeader },
        }
    );
}

export async function action({ request, context }: ActionFunctionArgs) {
    const formData = await request.formData();
    await validateCsrfToken(request, formData.get("csrfToken"), context.cloudflare.env.CSRF_SECRET);
    // Process form data...
}
```

### Form Handling & Security

- **CSRF protection**: All forms use `createCsrfToken()`/`validateCsrfToken()` with secure, HTTP-only cookies (sameSite=strict)
- **Token generation**: Uses Web Crypto API (`crypto.getRandomValues()`) with constant-time comparison in `app/utils/token.server.ts`
- **Rate limiting**: Contact form limited to 3 requests/minute per IP via `app/utils/rate-limit.server.ts`
- **Input validation**: Strict Zod schemas with length limits and regex patterns (see `emailSchema` in `app/utils/email.server.ts`)
- **XSS prevention**: HTML escaping for all user input in emails
- **Progressive enhancement**: Forms work without JavaScript
- **Error handling**: Detailed errors logged server-side, generic messages to client
- **Token flow**: Loader creates token, action validates + rate limits before processing

### Environment Variables

- **Access pattern**: Use `context.cloudflare?.env || context.env` to support both dev and production
    - Production: `context.cloudflare.env.VARIABLE_NAME`
    - Development: `context.env.VARIABLE_NAME` (loaded from process.env via .env file)
- **Type safety**: Extend `Env` interface in `load-context.ts`
- **Local development**: Variables in `.env` file (gitignored, copy from `.env.example`)
- **Production**: Set in Cloudflare Pages dashboard
- **Always check**: `if (!env?.VARIABLE_NAME) throw new Error("Not configured")`### Cloudflare Specifics

- **Workers**: Single handler in `workers/app.ts` using `createRequestHandler` from React Router
- **Deployment**: Direct Cloudflare Workers deployment (not Pages) via `wrangler deploy`
- **Headers**: Security headers configured in `public/_headers`
- **Build output**: `build/client` for static assets, `build/server` for server code

## Integration Points

### External Services

- **Brevo Email API**: Contact form integration with HTML email templates in `app/utils/email.server.ts`
- **Google Fonts**: Inter and Permanent Marker fonts preconnected for performance
- **React Icons**: Consistent icon library across components
- **Security**: CSP headers configured in `public/_headers` with specific service allowlists

### State Management

- **React Router-first**: Use loaders/actions for data, avoid client-side state libraries
- **Local state**: React hooks for UI interactions (see `useScrollDirection`)
- **Form state**: HTML forms with progressive enhancement

## Common Gotchas

1. **Runtime environment**: Use `fetch()`, `crypto`, `Request`/`Response` - avoid Node.js APIs
2. **Asset paths**: Use `/assets/` for public files, not relative paths
3. **Environment variables**: Must be accessed via `context.cloudflare.env` in server code
4. **TypeScript**: Use `@remix-run/cloudflare` types, not Node.js types
5. **Deployment**: Cloudflare Pages handles routing; React Router handles app logic
6. **DO NOT use @cloudflare/vite-plugin**: This plugin causes 404 errors in development with React Router v7. The app deploys to Cloudflare Pages without it.

## Styling Best Practices

All styles follow modern best practices for accessibility, performance, and user experience:

### 1. Accessibility Standards (WCAG 2.1 AA)

**Focus Management:**

```typescript
// ✅ All interactive elements have focus-visible states
navLink: "... focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ...";
button: "... focus-visible:ring-2 focus-visible:ring-offset-2 ...";
input: "... focus:ring-4 focus:ring-blue-500/20 focus-visible:outline-none ...";
```

**Implemented:**

- `focus-visible` for keyboard navigation (not mouse clicks)
- `focus-within` for card containers with interactive children
- Ring offsets for contrast on different backgrounds
- Proper disabled states with cursor indicators

### 2. Motion Preferences

Respects `prefers-reduced-motion` media query:

```typescript
// ✅ All animations are motion-safe
card: "... hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100";
button: "... transition-all duration-300 motion-reduce:transition-none";
```

Applied to: scale transforms, translations, all transitions, smooth scrolling

### 3. Interactive State Patterns

**Consistent progression:** default → hover → active → disabled

```typescript
// Buttons
button: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed";

// Links
link: "text-blue-600 hover:text-blue-700 active:text-blue-800 transition-colors duration-200";
```

### 4. Transition Timing Standards

- **200ms**: Simple state changes (colors, opacity, border-colors)
- **300ms**: Complex animations (scale, transforms, shadows, multiple properties)

```typescript
// Simple
"transition-colors duration-200";

// Complex
"transition-all duration-300";
```

### 5. Dark Mode Coverage

Every style includes dark: variants:

```typescript
// Text, backgrounds, borders, shadows
"bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700";

// Focus rings need offset adjustments
"focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800";
```

### 6. Style Organization

```
app/styles/
├── components.ts    # Navigation, cards, forms, footer, contact page
├── layout.ts        # Page layouts, headers, containers
└── sections.ts      # Hero, features, services, CTA, pricing
```

**When to add styles:**

- **components.ts**: Reusable UI components (navigation, cards, forms)
- **layout.ts**: Page structure and layout wrappers
- **sections.ts**: Specific page sections (hero, pricing, CTA)
- **Inline (route level)**: Page-unique styles (e.g., `_index.tsx` badge animation)

**Pattern to follow:**

```typescript
// In app/styles/components.ts
export const myComponent = {
    wrapper: "... focus-visible:... motion-reduce:... dark:...",
    button: "... hover:... active:... disabled:... transition-colors duration-200",
    // Always include: focus states, motion-reduce, dark mode, proper transitions
} as const;
```

### 7. Accessibility Checklist

When adding/modifying styles, ensure:

- ✅ `focus-visible` states on all interactive elements
- ✅ `motion-reduce` variants for animations/transforms
- ✅ `dark:` variants for all colors
- ✅ Consistent transition durations (200ms or 300ms)
- ✅ `active:` states for buttons/links
- ✅ `disabled:` states with opacity + cursor
- ✅ Ring offsets match background context
- ✅ Hover states don't rely on color alone

## Key Files to Reference

- `vite.config.ts`: React Router v7 configuration with Vite (simple setup - no Cloudflare Vite plugin needed)
- `react-router.config.ts`: React Router specific configuration with SSR enabled
- `app/routes.ts`: File-based routing configuration using `@react-router/fs-routes`
- `app/root.tsx`: Global layout with Header/Footer structure
- `app/styles/`: Centralized Tailwind class organization with accessibility best practices
    - `components.ts`: Navigation, cards, forms, footer styles (all with focus-visible, motion-reduce, dark mode)
    - `layout.ts`: Layout containers and page structures
    - `sections.ts`: Hero, features, services, CTA, pricing sections
- `functions/[[path]].ts`: Cloudflare Pages function entry point using `createPagesFunctionHandler`
- `public/_headers`: Security headers (CSP, HSTS, CORS) and caching configuration
- `load-context.ts`: TypeScript interface extensions for Cloudflare environment
- `app/utils/csrf.server.ts`: CSRF token generation and validation utilities
- `app/utils/email.server.ts`: Brevo API integration with Zod validation schemas
- `app/utils/rate-limit.server.ts`: In-memory rate limiting for form submissions
- `app/utils/token.server.ts`: Cryptographically secure token generation with timing-safe comparison
- `SECURITY.md`: Comprehensive security documentation and best practices
