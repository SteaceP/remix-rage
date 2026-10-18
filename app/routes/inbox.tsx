import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";
import { AdminInbox } from "~/components/AdminInbox";
import { inboxStyles as styles } from "~/styles/components";
import { getAdminSessionFromRequest, resolveSigningSecret } from "~/utils/auth.server";
import { fetchHubJson } from "~/utils/dm-hub.server";
import { getEnvFromContext } from "~/context";
import type { AdminPresence, ChatThread, PasskeyCredential } from "~/utils/dm-types";

export const meta: MetaFunction = () => {
    return [
        { title: "Direct Inbox — Code Rage" },
        {
            name: "description",
            content: "Code Rage mobile direct message inbox and availability console.",
        },
        { name: "robots", content: "noindex, nofollow" },
    ];
};

type PublicPasskey = Omit<PasskeyCredential, "publicKeySpki">;

interface InboxLoaderData {
    authenticated: boolean;
    presence: AdminPresence;
    threads: ChatThread[];
    vapidPublicKey: string;
    passkeys: PublicPasskey[];
    pushCount: number;
    passkeysCount: number;
    hasStoredPasscode: boolean;
    hasEnvPasscode: boolean;
}

export async function loader({ request, context }: LoaderFunctionArgs) {
    const env = getEnvFromContext(context) as Record<string, unknown>;
    const secret = resolveSigningSecret(env);
    const session = await getAdminSessionFromRequest(request, secret);

    const defaultPresence: AdminPresence = {
        available: true,
        adminConnected: false,
        statusText: "Available",
        updatedAt: Date.now(),
    };

    if (session) {
        try {
            const bootstrap = await fetchHubJson<{
                presence: AdminPresence;
                threads: ChatThread[];
                vapidPublicKey: string;
                passkeys: PublicPasskey[];
                pushCount: number;
            }>(context, "/admin/bootstrap");

            return Response.json({
                authenticated: true,
                presence: bootstrap.presence,
                threads: bootstrap.threads,
                vapidPublicKey: bootstrap.vapidPublicKey,
                passkeys: bootstrap.passkeys,
                pushCount: bootstrap.pushCount,
                passkeysCount: bootstrap.passkeys.length,
                hasStoredPasscode: true,
                hasEnvPasscode: Boolean(env.ADMIN_SECRET),
            } satisfies InboxLoaderData);
        } catch {
            return Response.json({
                authenticated: true,
                presence: defaultPresence,
                threads: [],
                vapidPublicKey: "",
                passkeys: [],
                pushCount: 0,
                passkeysCount: 0,
                hasStoredPasscode: true,
                hasEnvPasscode: Boolean(env.ADMIN_SECRET),
            } satisfies InboxLoaderData);
        }
    }

    try {
        const status = await fetchHubJson<{
            presence: AdminPresence;
            passkeysCount: number;
            hasStoredPasscode: boolean;
            vapidPublicKey: string;
        }>(context, "/status");

        return Response.json({
            authenticated: false,
            presence: status.presence,
            threads: [],
            vapidPublicKey: status.vapidPublicKey,
            passkeys: [],
            pushCount: 0,
            passkeysCount: status.passkeysCount,
            hasStoredPasscode: status.hasStoredPasscode,
            hasEnvPasscode: Boolean(env.ADMIN_SECRET),
        } satisfies InboxLoaderData);
    } catch {
        return Response.json({
            authenticated: false,
            presence: defaultPresence,
            threads: [],
            vapidPublicKey: "",
            passkeys: [],
            pushCount: 0,
            passkeysCount: 0,
            hasStoredPasscode: false,
            hasEnvPasscode: Boolean(env.ADMIN_SECRET),
        } satisfies InboxLoaderData);
    }
}

export default function InboxRoute() {
    const data = useLoaderData<typeof loader>() as InboxLoaderData;

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                <AdminInbox
                    initialAuthenticated={data.authenticated}
                    initialPresence={data.presence}
                    initialThreads={data.threads}
                    initialVapidPublicKey={data.vapidPublicKey}
                    initialPasskeys={data.passkeys}
                    initialPushCount={data.pushCount}
                    passkeysCount={data.passkeysCount}
                    hasStoredPasscode={data.hasStoredPasscode}
                    hasEnvPasscode={data.hasEnvPasscode}
                />
            </div>
        </div>
    );
}
