import type { AdminPresence, ChatThread, PasskeyCredential } from "~/utils/dm-types";

export type PublicPasskey = Omit<PasskeyCredential, "publicKeySpki">;

export interface AdminInboxProps {
    initialAuthenticated: boolean;
    initialPresence: AdminPresence;
    initialThreads: ChatThread[];
    initialVapidPublicKey: string;
    initialPasskeys: PublicPasskey[];
    initialPushCount: number;
    passkeysCount: number;
    hasStoredPasscode: boolean;
    hasEnvPasscode: boolean;
}

export type InboxFilterTab = "open" | "archived";
