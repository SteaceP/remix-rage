# Code Rage (remix-rage)

A modern technology services website and direct messaging platform built with **React Router v7** and deployed globally on **Cloudflare Workers** with **Cloudflare Durable Objects**.

Features an architectural dark/light mode aesthetic, real-time WebSocket communication, administrative inbox with WebAuthn/passkey authentication and Web Push notifications, comprehensive edge security, and full TypeScript type safety.

## 🚀 Tech Stack

- **Framework**: [React Router v7](https://reactrouter.com) (SSR on Cloudflare Workers)
- **Runtime**: Cloudflare Workers (`nodejs_compat` enabled, Web Standards APIs)
- **Real-Time & State**: Cloudflare Durable Objects (`DirectMessageHub` with SQLite storage)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) via `@tailwindcss/vite` with centralized style architecture
- **Real-Time Communication**: WebSockets & SSE fallback for visitor messaging and operator dashboard
- **Admin Auth & Notifications**: WebAuthn / Passkeys, HMAC session tokens, and Web Push notifications (VAPID)
- **Testing & Tooling**: Vitest, Prettier, TypeScript, Wrangler

## 📋 Features

- **Service Pages**: Computer Repair, Website Development, Cross-Platform Apps, and Family Support
- **Direct Messaging System**:
    - Live visitor-to-operator chat backed by Cloudflare Durable Objects
    - Persistent message history stored in SQLite within Durable Objects
    - Real-time presence and operator availability status
    - Rate limiting, token-based session persistence, and message encryption helpers
- **Operator Inbox (`/inbox`)**:
    - Mobile-first, responsive direct messaging console
    - Secure authentication via Passkeys / WebAuthn and passcodes
    - Web Push notifications for inbound messages
- **Modern Architectural UI**:
    - Cohesive architectural typography and responsive layouts
    - Seamless dark and light mode support
    - Accessible focus states and motion-safe animations (`prefers-reduced-motion`)
- **Security & Performance**:
    - CSP headers, HSTS, CORS configuration via `public/_headers`
    - CSRF token utilities and server-side request verification
    - Edge caching and minimal cold starts on Cloudflare Workers

## 🏗️ Architecture

### Routing

- File-based routing via `@react-router/fs-routes` configured in `app/routes.ts`
- Routes include:
    - `app/routes/_index.tsx`: Homepage with architectural hero and service overview
    - `app/routes/contact.tsx`: Live direct message portal with operator presence
    - `app/routes/inbox.tsx`: Operator administration console
    - `app/routes/api.dm.$action.ts`: Direct messaging API and WebSocket upgrade endpoint
    - `app/routes/*.tsx`: Individual service offerings

### Real-Time Direct Message Hub (Durable Object)

- Defined in `workers/chat.do.ts` as `DirectMessageHub`
- Manages thread persistence with SQLite on Durable Objects
- Handles real-time WebSocket connections for both visitors and operators
- Dispatches Web Push notifications to subscribed operator devices

### Styling

- **Centralized styles**: Style objects located in `app/styles/` (`components.ts`, `layout.ts`, `sections.ts`)
- **Tailwind CSS v4**: Imported in `app/tailwind.css` and compiled via Vite plugin

### Environment & Secrets

- Production variables are bound via Cloudflare context (`context.cloudflare.env` or `load-context.ts`)
- Configured secrets:
    - `CSRF_SECRET`: Secret used for signing CSRF tokens
    - `ADMIN_SECRET`: Secret used for authenticating admin sessions and WebAuthn challenges

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

# Generate Cloudflare worker types
pnpm run cf-typegen

# Start Vite development server
pnpm run dev
# or
pnpm dev
```

The dev server will start at [http://localhost:5173](http://localhost:5173).

### Available Scripts

```bash
pnpm run dev            # Start React Router Vite dev server
pnpm run build          # Build production client and server bundles
pnpm run preview        # Preview production build locally
pnpm run deploy         # Build and deploy to Cloudflare Workers via Wrangler
pnpm run test           # Run Vitest test suite
pnpm run test:watch     # Run Vitest in interactive watch mode
pnpm run test:coverage  # Run Vitest test coverage report
pnpm run typecheck      # Validate TypeScript types and Cloudflare types
pnpm run cf-typegen     # Generate Cloudflare Workers types via Wrangler
pnpm run format         # Format codebase with Prettier
pnpm run format:check   # Check codebase formatting with Prettier
```

## 📦 Project Structure

```text
app/
├── components/               # React components (Header, Footer, DirectMessageChat, AdminInbox)
├── context/                  # Client contexts (e.g. ThemeContext)
├── routes/                   # File-based routes (homepage, services, contact, inbox, API)
├── styles/                   # Centralized Tailwind style definitions
├── utils/                    # Utilities (auth, CSRF, WebAuthn, Web Push, crypto, rate limiting)
├── root.tsx                  # Root HTML layout and providers
└── tailwind.css              # Tailwind CSS v4 entrypoint

workers/
├── app.ts                    # Cloudflare Workers entry point
└── chat.do.ts                # Cloudflare Durable Object for direct messaging

public/
├── _headers                  # Edge security headers (CSP, HSTS, CORS)
├── manifest.webmanifest      # PWA manifest
├── sw.js                     # Service Worker for Web Push notifications
└── assets/                   # Static assets, logos, and images
```

## 🔒 Security

- **Content Security Policy (CSP)**: Strict headers configured in `public/_headers`
- **CSRF Protection**: Token generation and validation helpers in `app/utils/csrf.server.ts`
- **Operator Authentication**: Passkey / WebAuthn biometric security and HMAC-signed session cookies
- **Rate Limiting**: In-memory and DO-level rate limiting on messaging endpoints
- **Input Sanitization**: Structured validation on all inbound WebSocket and API payloads

## 🌐 Deployment

### Cloudflare Workers

1. **Configure Wrangler**: Verify route patterns and Durable Object migrations in `wrangler.jsonc`
2. **Set Secrets via CLI**:
    ```bash
    wrangler secret put CSRF_SECRET
    wrangler secret put ADMIN_SECRET
    ```
3. **Deploy**:
    ```bash
    pnpm run deploy
    ```

## 📄 License

This project is private and proprietary.
