import { type LoaderFunctionArgs, type MetaFunction } from "react-router";
import { Link, useLoaderData } from "react-router";
import { FaBolt, FaCode, FaLock, FaMobileAlt, FaShieldAlt, FaTools } from "react-icons/fa";
import { DirectMessageChat } from "~/components/DirectMessageChat";
import { contactStyles as styles } from "~/styles/components";
import { getAdminSessionFromRequest, resolveSigningSecret } from "~/utils/auth.server";
import { fetchHubJson } from "~/utils/dm-hub.server";
import type { AdminPresence } from "~/utils/dm-types";

export const meta: MetaFunction = () => {
    return [
        { title: "Direct Message — Code Rage" },
        {
            name: "description",
            content:
                "Message Steace directly in real time for custom website development, cross-platform apps, computer repair, or family tech support.",
        },
    ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
    const env = (context.cloudflare?.env || context.env || {}) as Record<string, unknown>;
    const secret = resolveSigningSecret(env);
    const session = await getAdminSessionFromRequest(request, secret);

    let presence: AdminPresence = {
        available: true,
        adminConnected: false,
        statusText: "Available",
        updatedAt: Date.now(),
    };

    try {
        const status = await fetchHubJson<{ presence: AdminPresence }>(context, "/status");
        if (status?.presence) {
            presence = status.presence;
        }
    } catch {
        // Fallback if Durable Object is initializing
    }

    return Response.json({
        presence,
        isAdmin: Boolean(session),
    });
}

export default function Contact() {
    const { presence, isAdmin } = useLoaderData<typeof loader>() as {
        presence: AdminPresence;
        isAdmin: boolean;
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.bgGrid} />

            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Left Column: Real-Time Direct Message Context */}
                    <div className={styles.leftCol}>
                        <div
                            className={
                                presence.available ? styles.badgeAvailable : styles.badgeAway
                            }
                        >
                            <span
                                className={
                                    presence.available ? styles.dotAvailable : styles.dotAway
                                }
                            />
                            <span>
                                {presence.available
                                    ? "LIVE DIRECT MESSAGE // ONLINE"
                                    : `DIRECT MESSAGE // ${presence.statusText.toUpperCase()}`}
                            </span>
                        </div>

                        <h1 className={styles.title}>Direct Message</h1>
                        <p className={styles.subtitle}>
                            Skip the email forms. Send a real-time message directly to my phone and
                            let&apos;s talk about your software project, computer repair, or family tech
                            support needs right here.
                        </p>

                        <div className={styles.featureList}>
                            <div className={styles.featureCard}>
                                <div className={styles.featureIconWrap}>
                                    <FaBolt className={styles.featureIconSize} />
                                </div>
                                <div>
                                    <h2 className={styles.featureTitle}>
                                        Real-Time Cloudflare Durable Object Chat
                                    </h2>
                                    <p className={styles.featureDesc}>
                                        Messages ping my phone immediately via WebSockets &amp; Web Push—reply
                                        right from this tab as we talk.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIconWrap}>
                                    <FaCode className={styles.featureIconSize} />
                                </div>
                                <div>
                                    <h2 className={styles.featureTitle}>
                                        Web &amp; Cross-Platform Builds
                                    </h2>
                                    <p className={styles.featureDesc}>
                                        Free initial consultation and architecture scoping for new websites or
                                        multi-platform apps.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.featureCard}>
                                <div className={styles.featureIconWrap}>
                                    <FaTools className={styles.featureIconSize} />
                                </div>
                                <div>
                                    <h2 className={styles.featureTitle}>
                                        $29 PC Diagnostics (Waived w/ Repair)
                                    </h2>
                                    <p className={styles.featureDesc}>
                                        Honest hardware &amp; software evaluation before you commit to any
                                        repair work.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.securityNote}>
                            <FaShieldAlt className={styles.securityIcon} />
                            <span>
                                Powered by Cloudflare Edge Durable Objects • Session saved in your browser
                            </span>
                        </div>

                        <div>
                            <Link to="/inbox" className={styles.adminShortcutLink}>
                                <FaMobileAlt className={styles.featureIconSize} />
                                <span>
                                    {isAdmin
                                        ? "Open Admin Direct Inbox (Logged In) →"
                                        : "Owner Login // Mobile Inbox PWA →"}
                                </span>
                                <FaLock className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Real-Time Direct Message Chat Card */}
                    <div className={styles.rightCol}>
                        <DirectMessageChat initialPresence={presence} />
                    </div>
                </div>
            </div>
        </div>
    );
}
