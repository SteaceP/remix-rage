import { type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import { useLoaderData, useActionData } from "react-router";
import { ContactForm } from "~/components/ContactForm";
import { createCsrfToken, validateCsrfToken } from "~/utils/csrf.server";
import { sendEmail, emailSchema } from "~/utils/email.server";
import { checkRateLimit, getRateLimitKey } from "~/utils/rate-limit.server";
import { contactStyles as styles } from "~/styles/components";

export async function loader({ request, context }: LoaderFunctionArgs) {
    // Handle both dev and production environment access
    const env = context.cloudflare?.env || context.env;
    // In development, fall back to import.meta.env
    const csrfSecret = env?.CSRF_SECRET || import.meta.env.CSRF_SECRET;

    if (!csrfSecret) {
        throw new Error("CSRF_SECRET is not configured");
    }

    const { token, cookieHeader } = await createCsrfToken(request, csrfSecret);

    return Response.json(
        { csrfToken: token },
        {
            headers: {
                "Set-Cookie": cookieHeader,
            },
        }
    );
}

export async function action({ request, context }: ActionFunctionArgs) {
    // Check rate limit first
    const rateLimitKey = getRateLimitKey(request);
    const rateLimit = checkRateLimit(rateLimitKey, 3, 60000); // 3 requests per minute

    if (!rateLimit.allowed) {
        return Response.json(
            { error: "Too many requests. Please try again later." },
            {
                status: 429,
                headers: {
                    "Retry-After": Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString(),
                },
            }
        );
    }

    const formData = await request.formData();
    const csrfToken = formData.get("csrfToken");

    if (typeof csrfToken !== "string") {
        return Response.json({ error: "Missing CSRF token" }, { status: 400 });
    }

    try {
        // Handle both dev and production environment access
        const env = context.cloudflare?.env || context.env;
        // In development, fall back to import.meta.env
        const csrfSecret = env?.CSRF_SECRET || import.meta.env.CSRF_SECRET;
        const brevoApiKey = env?.BREVO_API_KEY || import.meta.env.BREVO_API_KEY;

        if (!csrfSecret) {
            throw new Error("CSRF_SECRET is not configured");
        }

        if (!brevoApiKey) {
            throw new Error("BREVO_API_KEY is not configured");
        }

        await validateCsrfToken(request, csrfToken, csrfSecret);

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const subject = formData.get("subject") as string;
        const message = formData.get("message") as string;

        const data = {
            name,
            email,
            subject,
            message,
        };

        // Validate form data
        const validated = emailSchema.parse(data);

        await sendEmail(validated, { BREVO_API_KEY: brevoApiKey });
        return Response.json({ success: true });
    } catch (error) {
        if (error instanceof Error) {
            return Response.json({ error: error.message }, { status: 400 });
        }
        return Response.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
}

export default function Contact() {
    const { csrfToken } = useLoaderData<typeof loader>() as { csrfToken: string };
    const actionData = useActionData<typeof action>() as { error?: string; success?: boolean } | undefined;

    return (
        <div className={styles.wrapper}>
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl" />
            </div>

            <div className={styles.container}>
                <div className={styles.formCard}>
                    <div className={styles.formInner}>
                        <h1 className={styles.title}>Get In Touch</h1>
                        <p className={styles.subtitle}>
                            Have a project in mind or need technical support? Let&apos;s chat about how I can help bring
                            your ideas to life.
                        </p>

                        {actionData?.error && (
                            <div className={styles.errorAlert}>
                                <p className={styles.errorText}>⚠️ {actionData.error}</p>
                            </div>
                        )}

                        {actionData?.success && (
                            <div className={styles.successAlert}>
                                <p className={styles.successText}>
                                    ✓ Message sent successfully! I&apos;ll get back to you soon.
                                </p>
                            </div>
                        )}

                        <ContactForm csrfToken={csrfToken} />
                    </div>
                </div>
            </div>
        </div>
    );
}
