"use client";

import { Bell, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Notification {
    id: string;
    title: string;
    message: string;
    is_read?: boolean;
    created_at?: string;
}

interface NotificationCardProps {
    notifications: Notification[];
}

export default function NotificationCard({
    notifications,
}: NotificationCardProps) {

    const router = useRouter();

    const unreadCount = notifications.filter(
        (notification) => !notification.is_read
    ).length;

    const formatDate = (date?: string) => {
        if (!date) {
            return "";
        }

        return new Date(date).toLocaleString(
            "en-NG",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };

    const handleViewAll = () => {
        router.push("/notifications");
    };

    const handleNotificationClick = () => {
        router.push("/notifications");
    };

    return (
        <div className="rounded-2xl bg-white p-6 shadow-lg">

            {/* HEADER */}

            <div className="mb-6 flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">

                        <Bell size={22} />

                        {unreadCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                {unreadCount > 9
                                    ? "9+"
                                    : unreadCount}
                            </span>
                        )}

                    </div>

                    <div>

                        <h2 className="text-xl font-bold text-slate-900">
                            Notifications
                        </h2>

                        {unreadCount > 0 ? (
                            <p className="text-xs text-green-600">
                                {unreadCount} unread
                            </p>
                        ) : (
                            <p className="text-xs text-slate-400">
                                You're all caught up
                            </p>
                        )}

                    </div>

                </div>

                <button
                    type="button"
                    onClick={handleViewAll}
                    className="flex items-center gap-1 text-sm font-semibold text-green-600 transition hover:text-green-700"
                >
                    View All

                    <ChevronRight size={16} />
                </button>

            </div>

            {/* NOTIFICATIONS */}

            <div className="space-y-4">

                {notifications.length === 0 ? (

                    <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">

                        <Bell
                            className="mx-auto mb-3 text-slate-300"
                            size={28}
                        />

                        <p className="text-sm text-slate-500">
                            No notifications available.
                        </p>

                    </div>

                ) : (

                    notifications
                        .slice(0, 5)
                        .map((notification) => {

                            const unread =
                                !notification.is_read;

                            return (
                                <button
                                    type="button"
                                    key={notification.id}
                                    onClick={
                                        handleNotificationClick
                                    }
                                    className={`w-full rounded-xl border p-4 text-left transition ${unread
                                            ? "border-green-100 bg-green-50/50 hover:bg-green-50"
                                            : "border-slate-200 bg-white hover:bg-slate-50"
                                        }`}
                                >

                                    <div className="flex items-start gap-3">

                                        {/* ICON */}

                                        <div
                                            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${unread
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-slate-100 text-slate-400"
                                                }`}
                                        >

                                            <Bell size={17} />

                                        </div>

                                        {/* CONTENT */}

                                        <div className="min-w-0 flex-1">

                                            <div className="flex items-start justify-between gap-3">

                                                <div className="flex min-w-0 items-center gap-2">

                                                    <h3
                                                        className={`truncate text-sm ${unread
                                                                ? "font-bold text-slate-900"
                                                                : "font-semibold text-slate-800"
                                                            }`}
                                                    >
                                                        {
                                                            notification.title
                                                        }
                                                    </h3>

                                                    {unread && (
                                                        <span className="h-2 w-2 shrink-0 rounded-full bg-green-600" />
                                                    )}

                                                </div>

                                                <ChevronRight
                                                    size={16}
                                                    className="shrink-0 text-slate-400"
                                                />

                                            </div>

                                            <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">
                                                {
                                                    notification.message
                                                }
                                            </p>

                                            {notification.created_at && (
                                                <p className="mt-2 text-xs text-slate-400">
                                                    {formatDate(
                                                        notification.created_at
                                                    )}
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                </button>
                            );
                        })

                )}

            </div>

            {/* VIEW ALL */}

            {notifications.length > 0 && (
                <button
                    type="button"
                    onClick={handleViewAll}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-600"
                >
                    View all notifications

                    <ChevronRight size={16} />
                </button>
            )}

        </div>
    );
}