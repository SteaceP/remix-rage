import type { LinksFunction, MetaFunction } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import Header from "~/components/Header";
import Footer from "~/components/Footer";

import "./tailwind.css";

export const links: LinksFunction = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    },
];

export const meta: MetaFunction = () => {
    return [
        { title: "Code Rage" },
        {
            name: "description",
            content: "Welcome to Code Rage! The website is going for a overhaul! Please be patient.",
        },
    ];
};

export default function App() {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body className="min-h-screen bg-white dark:bg-gray-900">
                <Header />
                <Outlet />
                <Footer />
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}
