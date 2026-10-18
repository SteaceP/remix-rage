import { isRouteErrorResponse, Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import Header from "~/components/Header";
import Footer from "~/components/Footer";
import { ThemeProvider } from "~/context/ThemeContext";

import type { Route } from "./+types/root";
import "./tailwind.css";

export const links: Route.LinksFunction = () => [
    { rel: "manifest", href: "/manifest.webmanifest" },
    { rel: "apple-touch-icon", href: "/assets/logo/logo-light.png" },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
    },
];

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#020617" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="CR Inbox" />
                <Meta />
                <Links />
            </head>
            <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200">
                <ThemeProvider>
                    <Header />
                    <div className="flex-1 flex flex-col">{children}</div>
                    <Footer />
                </ThemeProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let status = "Error";
    let message = "Something went wrong";
    let details = "An unexpected error occurred while processing your request.";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        status = String(error.status);
        message = error.status === 404 ? "Page not found" : "Request error";
        details =
            error.status === 404
                ? "The page you are looking for doesn't exist or has been moved."
                : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="flex-1 flex items-center justify-center px-4 py-24">
            <div className="max-w-xl w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 md:p-12 text-center shadow-sm">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 mb-4">
                    Status // {status}
                </span>
                <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                    {message}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">{details}</p>
                {stack && (
                    <pre className="w-full p-4 mb-8 text-left text-xs font-mono bg-slate-950 text-slate-200 rounded-xl overflow-x-auto border border-slate-800">
                        <code>{stack}</code>
                    </pre>
                )}
                <Link
                    to="/"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors"
                >
                    Return to Homepage
                </Link>
            </div>
        </main>
    );
}

