import { useEffect, useState } from "react";
import { fromBase64UrlClient } from "./utils";

export interface UseAdminPushOptions {
    vapidPublicKey: string;
    initialPushCount: number;
}

export function useAdminPush({ vapidPublicKey, initialPushCount }: UseAdminPushOptions) {
    const [pushCount, setPushCount] = useState(initialPushCount);
    const [pushEnabledOnDevice, setPushEnabledOnDevice] = useState(false);

    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then(async (reg) => {
                    const sub = await reg.pushManager.getSubscription();
                    setPushEnabledOnDevice(Boolean(sub));
                })
                .catch(() => {
                    // Ignore SW registration failure in unsupported contexts
                });
        }
    }, []);

    async function handleTogglePush(onSuccess: (msg: string) => void, onError: (err: string) => void) {
        try {
            if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
                throw new Error(
                    "Web Push requires installing this page to your Home Screen (iOS 16.4+) or using a supported mobile browser."
                );
            }

            const reg = await navigator.serviceWorker.ready;
            const existing = await reg.pushManager.getSubscription();

            if (existing) {
                await fetch("/api/dm/push-unsubscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ endpoint: existing.endpoint }),
                });
                await existing.unsubscribe();
                setPushEnabledOnDevice(false);
                setPushCount((c) => Math.max(0, c - 1));
                onSuccess("Push notifications disabled on this device.");
                return;
            }

            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                throw new Error("Notification permission was not granted.");
            }

            if (!vapidPublicKey) {
                throw new Error("VAPID key is still initializing. Refresh and try again.");
            }

            const sub = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: fromBase64UrlClient(vapidPublicKey).buffer as ArrayBuffer,
            });

            const subJson = sub.toJSON();
            const res = await fetch("/api/dm/push-subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subscription: {
                        endpoint: sub.endpoint,
                        expirationTime: sub.expirationTime,
                        keys: subJson.keys,
                        deviceLabel: navigator.userAgent.slice(0, 80),
                    },
                }),
            });
            const data = (await res.json()) as { ok?: boolean; pushCount?: number; error?: string };
            if (!res.ok || !data.ok) {
                throw new Error(data.error || "Failed to save Push subscription");
            }

            setPushEnabledOnDevice(true);
            if (typeof data.pushCount === "number") {
                setPushCount(data.pushCount);
            }
            onSuccess("Phone Web Push notifications enabled!");
        } catch (err) {
            onError(err instanceof Error ? err.message : "Push setup error");
        }
    }

    async function handleTestPush(onSuccess: (msg: string) => void, onError: (err: string) => void) {
        try {
            const res = await fetch("/api/dm/push-test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });
            const data = (await res.json()) as { delivered?: number; total?: number };
            onSuccess(`Sent test notification (${data.delivered ?? 0}/${data.total ?? 0} devices).`);
        } catch {
            onError("Failed to send test push notification");
        }
    }

    return {
        pushCount,
        setPushCount,
        pushEnabledOnDevice,
        handleTogglePush,
        handleTestPush,
    };
}
