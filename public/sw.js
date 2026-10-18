self.addEventListener("install", () => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
    let data = {
        title: "New Direct Message • Code Rage",
        body: "Tap to view and reply in real time.",
        url: "/inbox",
        threadId: "",
        unreadCount: 1,
    };

    if (event.data) {
        try {
            const parsed = event.data.json();
            data = {
                ...data,
                ...parsed,
            };
        } catch {
            try {
                data.body = event.data.text() || data.body;
            } catch {
                // Keep default
            }
        }
    }

    if ("setAppBadge" in self.navigator && typeof data.unreadCount === "number") {
        try {
            self.navigator.setAppBadge(data.unreadCount);
        } catch {
            // Ignore badge errors
        }
    }

    const notifyPromise = self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/assets/logo/pwa-icon.svg",
        badge: "/assets/logo/pwa-icon.svg",
        tag: data.threadId ? `cr-dm-${data.threadId}` : "cr-dm-general",
        renotify: true,
        data: {
            url: data.url || "/inbox",
        },
    });

    event.waitUntil(notifyPromise);
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const targetUrl = (event.notification.data && event.notification.data.url) || "/inbox";

    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if ("focus" in client) {
                    client.navigate(targetUrl);
                    return client.focus();
                }
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow(targetUrl);
            }
            return undefined;
        })
    );
});
