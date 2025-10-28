# Remix Rage

A modern service business website built with **React Router v7** and deployed on **Cloudflare Pages**. Features a fully responsive design with dark mode support, progressive form enhancement, and comprehensive security measures.

## 🚀 Tech Stack

- **Framework**: [React Router v7](https://reactrouter.com) (migrated from Remix v2)
- **Runtime**: Cloudflare Workers (Web APIs, not Node.js)
- **Styling**: Tailwind CSS v4 with centralized style architecture
- **Forms**: Progressive enhancement with CSRF protection
- **Email**: Brevo API integration
- **Deployment**: Cloudflare Pages with Functions
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
node >= 18.0.0
npm >= 8.0.0
```

### Setup
```bash
# Install dependencies
npm install

# Generate Cloudflare types
npm run cf-typegen

# Start development server
npm run dev
```

The dev server will start at [http://localhost:5173](http://localhost:5173)

### Available Scripts

```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run deploy       # Deploy to Cloudflare Pages (after build)
npm run typecheck    # Run TypeScript validation
npm run cf-typegen   # Generate Cloudflare Workers types
```

## 📦 Project Structure

```
app/
├── routes/              # Page routes
│   ├── _index.tsx       # Homepage
│   ├── contact.tsx      # Contact form with CSRF
│   └── *.tsx            # Service pages
├── components/          # React components
│   ├── Header.tsx       # Navigation with scroll detection
│   ├── Footer.tsx       # Footer with links
│   └── ContactForm.tsx  # Reusable contact form
├── styles/              # Centralized Tailwind styles
│   ├── components.ts    # Component-specific styles
│   ├── layout.ts        # Layout styles
│   └── sections.ts      # Section styles
├── utils/               # Server utilities
│   ├── csrf.server.ts   # CSRF token handling
│   ├── email.server.ts  # Brevo email integration
│   └── token.server.ts  # Token utilities
├── hooks/               # Custom React hooks
└── root.tsx             # Root layout

functions/
└── [[path]].ts          # Cloudflare Pages function handler

public/
├── _headers             # Security headers configuration
└── assets/              # Static assets (images, logos)
```

## 🔒 Security

- **CSP**: Content Security Policy configured in `public/_headers`
- **CSRF**: Token-based protection on all forms
- **HSTS**: Strict-Transport-Security for HTTPS enforcement
- **Secure Cookies**: HttpOnly, Secure, SameSite=Strict
- **Input Validation**: Zod schemas on server-side

## 🌐 Deployment

### Cloudflare Pages

1. **Connect Repository**: Link your GitHub/GitLab repository to Cloudflare Pages
2. **Configure Build**:
   - Build command: `npm run build`
   - Build output directory: `build/client`
   - Root directory: `/`
3. **Environment Variables**: Set in Cloudflare dashboard:
   - `CSRF_SECRET`
   - `BREVO_API_KEY`
   - `FROM_EMAIL`
   - `TO_EMAIL`
4. **Deploy**: Push to main branch or use `npm run deploy`

### Manual Deployment
```bash
npm run build
npm run deploy
```

## 🎨 Style Guidelines

### Using Centralized Styles
```tsx
import { contactStyles as styles } from "~/styles/components";

export default function Component() {
  return <div className={styles.wrapper}>
    <h1 className={styles.title}>Title</h1>
  </div>;
}
```

### Dark Mode
All styles include dark mode variants:
```typescript
wrapper: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
```

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
- [Cloudflare Pages](https://developers.cloudflare.com/pages)
- [Cloudflare Workers](https://developers.cloudflare.com/workers)
- [Tailwind CSS](https://tailwindcss.com)
- [Brevo API](https://developers.brevo.com)

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Contact the owner for contribution guidelines.
