# Copilot Instructions for Remix Rage

## Architecture Overview

This is a **React Router v7** application (migrated from Remix v2) deployed on **Cloudflare Pages** with Functions, featuring a service business website. Key architectural decisions:

- **Runtime**: Cloudflare Workers (not Node.js) - use Web APIs, not Node.js APIs
- **Routing**: React Router v7 with file-based routing via `@react-router/fs-routes`
- **Styling**: Tailwind CSS v4 with centralized style objects in `app/styles/`
- **Forms**: Progressive enhancement with CSRF protection and Zod validation
- **Email**: Brevo API integration for contact forms with HTML templates
- **Assets**: Static files in `public/` served directly by Cloudflare
- **Security**: Comprehensive headers via `public/_headers` and CSRF tokens

## Critical Development Workflows

```bash
# Local development (Vite dev server)
pnpm run dev          # Starts on http://localhost:5173
# or
pnpm dev              # Shorthand

# Build and deploy
pnpm run build        # React Router build
pnpm run deploy       # Wrangler deploy after build
pnpm run preview      # Preview build locally

# Type checking
pnpm run typecheck    # TypeScript validation + Cloudflare types
pnpm run cf-typegen   # Generate Cloudflare Workers types
```

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

### Route Patterns
```tsx
// Standard route with CSRF protection (React Router v7)
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { useLoaderData, useActionData } from "react-router";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { token, cookieHeader } = await createCsrfToken(
    request, 
    context.cloudflare.env.CSRF_SECRET
  );
  return Response.json({ csrfToken: token }, {
    headers: { "Set-Cookie": cookieHeader }
  });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  await validateCsrfToken(request, formData.get("csrfToken"), context.cloudflare.env.CSRF_SECRET);
  // Process form data...
}
```

### Form Handling
- **CSRF protection**: All forms use `createCsrfToken()`/`validateCsrfToken()` with secure cookies
- **Validation**: Zod schemas in server utilities (`emailSchema` in `app/utils/email.server.ts`)
- **Progressive enhancement**: Forms work without JavaScript
- **Error handling**: Server-side validation with user-friendly error messages
- **Token flow**: Loader creates token, action validates it before processing

### Environment Variables
- **Access pattern**: `context.cloudflare.env.VARIABLE_NAME` in loaders/actions
- **Type safety**: Extend `Env` interface in `load-context.ts`
- **Local development**: Variables set in Wrangler, production in Cloudflare dashboard

### Cloudflare Specifics
- **Functions**: Single handler in `functions/[[path]].ts` routes all requests to React Router
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

## Key Files to Reference

- `vite.config.ts`: React Router v7 configuration with Vite
- `react-router.config.ts`: React Router specific configuration
- `app/routes.ts`: File-based routing configuration using `@react-router/fs-routes`
- `app/root.tsx`: Global layout with Header/Footer structure  
- `app/styles/`: Centralized Tailwind class organization (navigation, cards, form, footer)
- `functions/[[path]].ts`: Cloudflare Pages function entry point using `createPagesFunctionHandler`
- `public/_headers`: Security headers (CSP, HSTS, CORS) and caching configuration
- `load-context.ts`: TypeScript interface extensions for Cloudflare environment
- `app/utils/csrf.server.ts`: CSRF token generation and validation utilities
- `app/utils/email.server.ts`: Brevo API integration with Zod validation schemas