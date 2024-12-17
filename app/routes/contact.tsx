import { json } from "@remix-run/cloudflare";
import type { MetaFunction, ActionFunction, ActionFunctionArgs, LoaderFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { ContactForm } from "~/components/ContactForm";
import { sendContactEmail, emailSchema } from "~/utils/email.server";
import { rateLimiter } from "~/utils/rateLimiter.server";
import { createCSRFProtection, CSRF_HEADER_NAME } from "~/utils/csrf.server";

type LoaderData = {
    csrfToken: string;
};

export const loader: LoaderFunction = async ({ context }: LoaderFunctionArgs) => {
    const csrf = createCSRFProtection(context);
    const token = csrf.generateToken();
    const hash = await csrf.createHash(token);
    const cookieHeader = csrf.createCookieHeader(hash);
    
    return json(
        { csrfToken: token },
        {
            headers: {
                "Set-Cookie": cookieHeader
            }
        }
    );
};

export const action: ActionFunction = async ({ request, context }: ActionFunctionArgs) => {
    const csrf = createCSRFProtection(context);
    
    // Validate CSRF token
    const storedHash = csrf.getTokenFromRequest(request);
    const headerToken = request.headers.get(CSRF_HEADER_NAME);

    if (!storedHash || !headerToken || !await csrf.validateToken(headerToken, storedHash)) {
        return json(
            { 
                errors: { 
                    _form: "Invalid CSRF token. Please refresh the page and try again." 
                } 
            },
            { status: 403 }
        );
    }

    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    
    // Get IP address or some unique identifier
    const identifier = request.headers.get("CF-Connecting-IP") || "unknown";
    
    // Check rate limit
    if (rateLimiter.isRateLimited(identifier)) {
        const remainingTime = Math.ceil(3600 - (Date.now() % 3600000) / 1000 / 60);
        return json(
            {
                errors: {
                    _form: `Too many attempts. Please try again in ${remainingTime} minutes.`
                }
            },
            { status: 429 }
        );
    }

    // Use Zod validation
    const result = emailSchema.safeParse(data);
    
    if (!result.success) {
        return json(
            { errors: result.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    try {
        await sendContactEmail(result.data);
        return json({ 
            success: true,
            remainingAttempts: rateLimiter.getRemainingAttempts(identifier)
        });
    } catch (error) {
        console.error("Failed to send message:", error);
        return json(
            { 
                errors: { 
                    _form: error instanceof Error 
                        ? error.message 
                        : "Failed to send message. Please try again." 
                },
                remainingAttempts: rateLimiter.getRemainingAttempts(identifier)
            }, 
            { status: 500 }
        );
    }
};

export const meta: MetaFunction = () => {
    return [
        { title: "Contact - Code Rage" },
        {
            name: "description",
            content:
                "Get in touch with Code Rage for your tech needs. Professional computer repair and web development services.",
        },
    ];
};

const styles = {
    container: "flex-grow flex flex-col w-full py-16 px-4",
    content: "w-full max-w-4xl mx-auto",
    headerSection: "text-center mb-12",
    title: "text-4xl font-bold text-gray-900 dark:text-white mb-4",
    subtitle: "text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto",
};

export default function Contact() {
    const { csrfToken } = useLoaderData<LoaderData>();
    
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.headerSection}>
                    <h1 className={styles.title}>Get in Touch</h1>
                    <p className={styles.subtitle}>
                        Have a question or ready to start a project? I&apos;m here to help! Fill out the form below and
                        I&apos;ll get back to you as soon as possible.
                    </p>
                </div>
                <ContactForm csrfToken={csrfToken} />
            </div>
        </div>
    );
}
