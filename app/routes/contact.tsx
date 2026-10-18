import { type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from "react-router";
import { useLoaderData, useActionData } from "react-router";
import { FaCheckCircle, FaExclamationTriangle, FaClock, FaShieldAlt, FaCode, FaTools } from "react-icons/fa";
import { ContactForm } from "~/components/ContactForm";
import { createCsrfToken, validateCsrfToken } from "~/utils/csrf.server";
import { sendEmail, emailSchema } from "~/utils/email.server";
import { checkRateLimit, getRateLimitKey } from "~/utils/rate-limit.server";
import { contactStyles as styles } from "~/styles/components";

export const meta: MetaFunction = () => {
    return [
        { title: "Contact — Code Rage" },
        {
            name: "description",
            content:
                "Get in touch with Steace Paquette for custom website development, cross-platform apps, computer repair, or family tech support.",
        },
    ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
    // Handle both dev and production environment access
    const env = context.cloudflare?.env || context.env;
    const csrfSecret = env?.CSRF_SECRET;

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
        const csrfSecret = env?.CSRF_SECRET;
        const brevoApiKey = env?.BREVO_API_KEY;

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
            <div className="absolute inset-0 bg-grid-pattern mask-radial-fade pointer-events-none" />

            <div className={styles.container}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                    {/* Left Column: Direct Context & Expectations */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>DIRECT INBOX // STEACE PAQUETTE</span>
                        </div>

                        <h1 className={styles.title}>Get In Touch</h1>
                        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed">
                            Have a software project in mind, need a computer repaired, or looking for patient family
                            tech support? Send a message and let&apos;s talk about how I can help.
                        </p>

                        <div className="space-y-3.5 pt-2">
                            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-start gap-3.5">
                                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                                    <FaClock className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-display font-bold text-slate-900 dark:text-white">
                                        Fast Response Turnaround
                                    </h2>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                                        Inquiries are typically answered the same business day with clear next steps.
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-start gap-3.5">
                                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                                    <FaCode className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-display font-bold text-slate-900 dark:text-white">
                                        Web &amp; Cross-Platform Builds
                                    </h2>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                                        Free initial consultation and architecture scoping for new websites or apps.
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-start gap-3.5">
                                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                                    <FaTools className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-display font-bold text-slate-900 dark:text-white">
                                        $29 PC Diagnostics (Waived w/ Repair)
                                    </h2>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                                        Honest hardware &amp; software evaluation before you commit to any repair work.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 pt-2">
                            <FaShieldAlt className="text-emerald-500 shrink-0" />
                            <span>Protected by cryptographic CSRF tokens &amp; rate limiting</span>
                        </div>
                    </div>

                    {/* Right Column: Contact Form Card */}
                    <div className="lg:col-span-7">
                        <div className={styles.formCard}>
                            <div className={styles.formInner}>
                                {actionData?.error && (
                                    <div className={styles.errorAlert} role="alert">
                                        <p className={styles.errorText}>
                                            <FaExclamationTriangle className="shrink-0" />
                                            <span>{actionData.error}</span>
                                        </p>
                                    </div>
                                )}

                                {actionData?.success && (
                                    <div className={styles.successAlert} role="status">
                                        <p className={styles.successText}>
                                            <FaCheckCircle className="shrink-0" />
                                            <span>Message sent! I&apos;ll get back to you shortly.</span>
                                        </p>
                                    </div>
                                )}

                                <ContactForm csrfToken={csrfToken} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

