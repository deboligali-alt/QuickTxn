"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Bell, CheckCircle2 } from "lucide-react";

interface Notification {
    id: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get("/notifications");
                setNotifications(res.data.data);
            } catch (error) {
                console.error("Notification fetch failed:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const today = new Date().toDateString();

    const todayItems = notifications.filter(
        (n) => new Date(n.created_at).toDateString() === today
    );

    const earlierItems = notifications.filter(
        (n) => new Date(n.created_at).toDateString() !== today
    );

    if (loading) {
        return (
            <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4">
                <p className="text-gray-500">Loading...</p>
            </main>
        );
    }

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4 pb-24">
            <h1 className="mb-6 text-2xl font-bold">Notifications</h1>

            {todayItems.length > 0 && (
                <>
                    <h2 className="mb-3 text-sm font-semibold text-gray-500">TODAY</h2>
                    <div className="space-y-3">
                        {todayItems.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-2xl bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="rounded-full bg-green-100 p-2">
                                        <Bell className="text-green-600" size={18} />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {item.message}
                                        </p>

                                        <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                                            <CheckCircle2 size={14} />
                                            {item.is_read ? "Read" : "Unread"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {earlierItems.length > 0 && (
                <>
                    <h2 className="mb-3 mt-6 text-sm font-semibold text-gray-500">
                        EARLIER
                    </h2>

                    <div className="space-y-3">
                        {earlierItems.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-2xl bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="rounded-full bg-gray-100 p-2">
                                        <Bell className="text-gray-600" size={18} />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.title}</h3>

                                        <p className="mt-1 text-sm text-gray-600">
                                            {item.message}
                                        </p>

                                        <p className="mt-2 text-xs text-gray-400">
                                            {new Date(item.created_at).toLocaleDateString("en-NG", {
                                                day: "numeric",
                                                month: "short",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </main>
    );
}