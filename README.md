# Remix Rage

A modern service business website built with **React Router v7** and deployed on **Cloudflare Workers**. Features a fully responsive design with dark mode support, progressive form enhancement, and comprehensive security measures.

## 🚀 Tech Stack

- **Framework**: [React Router v7](https://reactrouter.com) (migrated from Remix v2)
- **Runtime**: Cloudflare Workers (Web APIs, not Node.js)
- **Styling**: Tailwind CSS v4 with centralized style architecture
- **Forms**: Progressive enhancement with CSRF protection
- **Email**: Brevo API integration
- **Deployment**: Cloudflare Workers
- **Type Safety**: TypeScript with Cloudflare Workers types

## 📋 Features

- **Service Pages**: Computer Repair, Website Development, Cross-Platform Apps, Family Support
- **Contact Form**: CSRF-protected with Zod validation and HTML email templates
- **Security**: CSP headers, HSTS, CORS configuration via `public/_headers`
- **Dark Mode**: Comprehensive dark mode support across all components
- **Responsive**: Mobile-first design with smooth animations
- **SEO**: Meta tags and semantic HTML structure
- **Progressive Enhancement**: Forms work without JavaScript

## 🏗️ Architecture

### Routing

- File-based routing via `@react-router/fs-routes`
- Routes configured in `app/routes.ts`
- Server functions (loaders/actions) for data fetching and mutations

### Styling

- **Centralized styles**: Style objects in `app/styles/` directory
- **Pattern**: Import styles, use `className={styles.property}`
- **Categories**: `navigation`, `cards`, `form`, `footer`, `contactStyles`
- **Custom animations**: `draw-arrow`, `marquee`, defined in `tailwind.config.ts`

### Forms & Security

- **CSRF Protection**: Token generation and validation in `app/utils/csrf.server.ts`
- **Validation**: Zod schemas for server-side form validation
- **Email**: Brevo API with HTML templates in `app/utils/email.server.ts`

### Environment Variables

- Access via `context.cloudflare.env.VARIABLE_NAME` in loaders/actions
- Type-safe with extended `Env` interface in `load-context.ts`
- Required: `CSRF_SECRET`, `BREVO_API_KEY`, `FROM_EMAIL`, `TO_EMAIL`

## 🛠️ Development

### Prerequisites

```bash
node >= 22.12.0
pnpm >= 9.0.0
```

### Setup

```bash
# Install dependencies
pnpm install

# Generate Cloudflare types
pnpm run cf-typegen

# Start development server
pnpm run dev
# or
pnpm dev
```

The dev server will start at [http://localhost:5173](http://localhost:5173)

### Available Scripts

```bash
pnpm run dev         # Start Vite dev server (or: pnpm dev)
pnpm run build       # Build for production
pnpm run preview     # Preview production build locally
pnpm run deploy      # Deploy to Cloudflare Workers
pnpm run typecheck   # Run TypeScript validation
pnpm run cf-typegen  # Generate Cloudflare Workers types
```

## 📦 Project Structure

```text
app/
├── routes/                        # Page routes
│   ├── _index.tsx             # Homepage
│   ├── contact.tsx            # Contact form with CSRF
│   └── *.tsx                      # Service pages
├── components/               # React components
│   ├── Header.tsx             # Navigation with scroll detection
│   ├── Footer.tsx              # Footer with links
│   └── ContactForm.tsx   # Reusable contact form
├── styles/                          # Centralized Tailwind styles
│   ├── components.ts       # Component-specific styles
│   ├── layout.ts                 # Layout styles
│   └── sections.ts              # Section styles
├── utils/                             # Server utilities
│   ├── csrf.server.ts           # CSRF token handling
│   ├── email.server.ts        # Brevo email integration
│   └── token.server.ts        # Token utilities
├── hooks/                          # Custom React hooks
└── root.tsx                         # Root layout

workers/
└── app.ts                            # Cloudflare Workers entry point

public/
├── _headers                       # Security headers configuration
└── assets/                           # Static assets (images, logos)
```

## 🔒 Security

- **CSP**: Content Security Policy configured in `public/_headers`
- **CSRF**: Token-based protection on all forms
- **HSTS**: Strict-Transport-Security for HTTPS enforcement
- **Secure Cookies**: HttpOnly, Secure, SameSite=Strict
- **Input Validation**: Zod schemas on server-side

## 🌐 Deployment

### Cloudflare Workers

1. **Configure Wrangler**: Update `wrangler.jsonc` with your route and settings
2. **Environment Variables**: Set secrets via Wrangler CLI:
   ```bash
   wrangler secret put CSRF_SECRET
   wrangler secret put BREVO_API_KEY
   ```
3. **Deploy**: Push to main branch (CI) or run manually:
   ```bash
   pnpm run deploy
   ```

### Manual Deployment

```bash
pnpm run build
pnpm run deploy
```

## 🎨 Style Guidelines

### Centralized Style Architecture

All styles are organized in `app/styles/` for consistency and maintainability:

- **`components.ts`**: Navigation, cards, forms, footer, contact page styles
- **`layout.ts`**: Layout containers, headers, sections
- **`sections.ts`**: Hero, features, services, CTA, pricing components

### Using Centralized Styles

```tsx
import { contactStyles as styles } from "~/styles/components";

export default function Component() {
  return <div className={styles.wrapper}>
    <h1 className={styles.title}>Title</h1>
  </div>;
}
```

### Style Best Practices

#### 1. Accessibility Features

All interactive elements include proper focus states:

```typescript
// ✅ Good: Full accessibility support
button: "... focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ..."

// Navigation links with keyboard support
navLink: "... focus-visible:ring-2 focus-visible:ring-offset-2 ..."

// Form inputs with visible focus
input: "... focus:ring-4 focus:ring-blue-500/20 focus-visible:outline-none ..."
```

**Implemented:**

- ✅ `focus-visible` states on all interactive elements
- ✅ `focus-within` for card keyboard navigation
- ✅ Ring offsets for better contrast
- ✅ Disabled states with proper cursors
- ✅ WCAG 2.1 AA compliant

#### 2. Motion Preferences

Respects user's motion preferences with `prefers-reduced-motion`:

```typescript
// ✅ Good: Motion-safe animations
card: "... hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
button: "... transition-all duration-300 motion-reduce:transition-none"
```

**Applied to:**

- Hover scale effects
- Vertical translations
- All transform animations
- Smooth scrolling behaviors

#### 3. Interactive States

Consistent pattern across all interactive elements:

```typescript
// Button states: default → hover → active → disabled
button: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"

// Link states with proper transitions
link: "transition-colors duration-200 hover:text-blue-600"
```

**Includes:**

- ✅ Hover states (lighter/darker colors)
- ✅ Active states (pressed appearance)
- ✅ Focus-visible states (keyboard navigation)
- ✅ Disabled states (visual + functional)

#### 4. Transition Timing

Standardized durations for consistency:

```typescript
// Simple changes (colors, opacity): 200ms
"transition-colors duration-200"

// Complex animations (scale, transforms, shadows): 300ms
"transition-all duration-300"
```

#### 5. Dark Mode

All styles include dark mode variants:

```typescript
// ✅ Good: Comprehensive dark mode support
wrapper: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
border: "border-gray-200 dark:border-gray-700"
shadow: "shadow-lg dark:shadow-gray-900/50"
```

**Coverage:**

- ✅ All text colors
- ✅ All background colors
- ✅ All border colors
- ✅ Shadow adaptations
- ✅ Focus ring offsets

### Style Organization

```text
app/styles/
├── components.ts    # UI components (nav, cards, forms, footer)
├── layout.ts        # Page layouts and containers
└── sections.ts      # Page sections (hero, features, CTA)
```

**When to use each:**

- **components.ts**: Reusable UI components used across multiple pages
- **layout.ts**: Page structure and layout containers
- **sections.ts**: Specific page sections and templates
- **Inline styles**: Page-unique styles (e.g., `_index.tsx` hero badge)

## 📝 Route Patterns

### Standard Route with CSRF

```tsx
import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { createCsrfToken, validateCsrfToken } from "~/utils/csrf.server";

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
  await validateCsrfToken(
    request, 
    formData.get("csrfToken"), 
    context.cloudflare.env.CSRF_SECRET
  );
  // Process form...
}
```

## ⚠️ Common Gotchas

1. **Runtime**: Use Web APIs (`fetch`, `crypto`, `Request`/`Response`), not Node.js APIs
2. **Asset paths**: Use `/assets/` for public files
3. **Environment variables**: Access via `context.cloudflare.env` in server code
4. **TypeScript**: Use `@remix-run/cloudflare` types, not `@types/node`

## 📚 Resources

- [React Router Documentation](https://reactrouter.com)
- [Cloudflare Workers](https://developers.cloudflare.com/workers)
- [Tailwind CSS](https://tailwindcss.com)
- [Brevo API](https://developers.brevo.com)

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Contact the owner for contribution guidelines.
