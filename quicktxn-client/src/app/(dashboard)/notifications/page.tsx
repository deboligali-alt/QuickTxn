"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
    Bell,
    Check,
    CheckCheck,
    Search,
    ArrowLeft,
    Clock3,
    Info,
    AlertTriangle,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import {
    getNotifications,
    markNotificationAsRead,
} from "@/services/dashboard.service";

interface Notification {
    id: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
    type?: string;
}

export default function NotificationsPage() {
    const router = useRouter();

    const [notifications, setNotifications] =
        useState<Notification[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [filter, setFilter] =
        useState<"all" | "unread" | "read">("all");

    const loadNotifications = useCallback(
        async () => {
            try {
                setLoading(true);

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    router.replace("/login");
                    return;
                }

                const response =
                    await getNotifications(token);

                setNotifications(
                    response.data || []
                );
            } catch (error) {
                console.error(error);

                if (
                    axios.isAxiosError(error)
                ) {
                    toast.error(
                        error.response?.data
                            ?.message ||
                        "Unable to load notifications."
                    );
                } else {
                    toast.error(
                        "Unable to load notifications."
                    );
                }
            } finally {
                setLoading(false);
            }
        },
        [router]
    );

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.is_read
        ).length;

    const readCount =
        notifications.filter(
            (notification) =>
                notification.is_read
        ).length;

    const filteredNotifications =
        useMemo(() => {
            return notifications.filter(
                (notification) => {
                    const query =
                        search
                            .toLowerCase()
                            .trim();

                    const matchesSearch =
                        !query ||
                        notification.title
                            ?.toLowerCase()
                            .includes(query) ||
                        notification.message
                            ?.toLowerCase()
                            .includes(query);

                    const matchesFilter =
                        filter === "all" ||
                        (filter === "unread" &&
                            !notification.is_read) ||
                        (filter === "read" &&
                            notification.is_read);

                    return (
                        matchesSearch &&
                        matchesFilter
                    );
                }
            );
        }, [
            notifications,
            search,
            filter,
        ]);

    const handleMarkAsRead = async (
        id: string
    ) => {
        const token =
            localStorage.getItem("token");

        if (!token) {
            router.replace("/login");
            return;
        }

        try {
            await markNotificationAsRead(
                token,
                id
            );

            setNotifications(
                (current) =>
                    current.map(
                        (notification) =>
                            notification.id ===
                                id
                                ? {
                                    ...notification,
                                    is_read: true,
                                }
                                : notification
                    )
            );

            toast.success(
                "Notification marked as read."
            );
        } catch (error) {
            console.error(error);

            if (
                axios.isAxiosError(error)
            ) {
                toast.error(
                    error.response?.data
                        ?.message ||
                    "Unable to update notification."
                );
            } else {
                toast.error(
                    "Unable to update notification."
                );
            }
        }
    };

    const formatDate = (
        date: string
    ) => {
        if (!date) return "";

        return new Date(date).toLocaleString(
            "en-NG",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const getNotificationIcon = (
        notification: Notification
    ) => {
        const text =
            `${notification.title} ${notification.message}`
                .toLowerCase();

        if (
            text.includes("success") ||
            text.includes("completed") ||
            text.includes("successful")
        ) {
            return {
                icon: CheckCircle2,
                wrapper:
                    "bg-green-100 text-green-600",
            };
        }

        if (
            text.includes("failed") ||
            text.includes("error") ||
            text.includes("declined")
        ) {
            return {
                icon: XCircle,
                wrapper:
                    "bg-red-100 text-red-600",
            };
        }

        if (
            text.includes("warning") ||
            text.includes("pending")
        ) {
            return {
                icon: AlertTriangle,
                wrapper:
                    "bg-yellow-100 text-yellow-600",
            };
        }

        if (
            text.includes("info") ||
            text.includes("announcement")
        ) {
            return {
                icon: Info,
                wrapper:
                    "bg-blue-100 text-blue-600",
            };
        }

        return {
            icon: Bell,
            wrapper:
                "bg-green-100 text-green-600",
        };
    };

    return (
        <main className="min-h-full bg-slate-50">

            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

                {/* BACK */}

                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-green-600"
                >
                    <ArrowLeft size={17} />
                    Back
                </button>

                {/* HEADER */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div className="flex items-center gap-4">

                        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600">

                            <Bell size={28} />

                            {unreadCount > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                                    {unreadCount >
                                        99
                                        ? "99+"
                                        : unreadCount}
                                </span>
                            )}

                        </div>

                        <div>

                            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                                Notifications
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 sm:text-base">
                                Stay updated with your
                                QuickTxn account.
                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-3">

                        <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">

                            <p className="text-xs text-slate-500">
                                Unread
                            </p>

                            <p className="text-xl font-extrabold text-green-600">
                                {unreadCount}
                            </p>

                        </div>

                        <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">

                            <p className="text-xs text-slate-500">
                                Read
                            </p>

                            <p className="text-xl font-extrabold text-slate-700">
                                {readCount}
                            </p>

                        </div>

                    </div>
                </motion.div>

                {/* SEARCH + FILTER */}

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                    <div className="flex flex-col gap-4 sm:flex-row">

                        <div className="relative flex-1">

                            <Search
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                placeholder="Search notifications..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                            />

                        </div>

                        <div className="flex rounded-xl bg-slate-100 p-1">

                            <button
                                type="button"
                                onClick={() =>
                                    setFilter(
                                        "all"
                                    )
                                }
                                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${filter ===
                                        "all"
                                        ? "bg-white text-green-600 shadow-sm"
                                        : "text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                All
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setFilter(
                                        "unread"
                                    )
                                }
                                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${filter ===
                                        "unread"
                                        ? "bg-white text-green-600 shadow-sm"
                                        : "text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                Unread
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setFilter(
                                        "read"
                                    )
                                }
                                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${filter ===
                                        "read"
                                        ? "bg-white text-green-600 shadow-sm"
                                        : "text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                Read
                            </button>

                        </div>

                    </div>

                </div>

                {/* NOTIFICATIONS */}

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                    {/* LOADING */}

                    {loading ? (
                        <div className="divide-y divide-slate-100">

                            {[1, 2, 3, 4, 5].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="animate-pulse p-6"
                                    >

                                        <div className="flex gap-4">

                                            <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-200" />

                                            <div className="flex-1">

                                                <div className="h-5 w-1/3 rounded bg-slate-200" />

                                                <div className="mt-3 h-4 w-3/4 rounded bg-slate-200" />

                                                <div className="mt-2 h-3 w-1/4 rounded bg-slate-200" />

                                            </div>

                                        </div>

                                    </div>
                                )
                            )}

                        </div>
                    ) : filteredNotifications.length ===
                        0 ? (
                        <div className="px-6 py-16 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">

                                <Bell size={28} />

                            </div>

                            <h2 className="mt-5 text-lg font-bold text-slate-900">
                                No notifications
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                {search ||
                                    filter !==
                                    "all"
                                    ? "Try changing your search or filter."
                                    : "You're all caught up. New notifications will appear here."}
                            </p>

                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">

                            {filteredNotifications.map(
                                (
                                    notification,
                                    index
                                ) => {
                                    const notificationIcon =
                                        getNotificationIcon(
                                            notification
                                        );

                                    const Icon =
                                        notificationIcon.icon;

                                    return (
                                        <motion.div
                                            key={
                                                notification.id
                                            }
                                            initial={{
                                                opacity: 0,
                                                y: 10,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            transition={{
                                                delay:
                                                    index *
                                                    0.03,
                                            }}
                                            className={`relative p-5 transition sm:p-6 ${notification.is_read
                                                    ? "bg-white hover:bg-slate-50"
                                                    : "bg-green-50/50 hover:bg-green-50"
                                                }`}
                                        >

                                            {!notification.is_read && (
                                                <span className="absolute left-0 top-0 h-full w-1 bg-green-600" />
                                            )}

                                            <div className="flex items-start gap-4">

                                                <div
                                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${notificationIcon.wrapper}`}
                                                >
                                                    <Icon
                                                        size={
                                                            22
                                                        }
                                                    />
                                                </div>

                                                <div className="min-w-0 flex-1">

                                                    <div className="flex flex-col justify-between gap-2 sm:flex-row">

                                                        <div className="flex items-center gap-2">

                                                            <h2
                                                                className={`text-base ${notification.is_read
                                                                        ? "font-semibold text-slate-800"
                                                                        : "font-extrabold text-slate-900"
                                                                    }`}
                                                            >
                                                                {
                                                                    notification.title
                                                                }
                                                            </h2>

                                                            {!notification.is_read && (
                                                                <span className="rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                                                                    New
                                                                </span>
                                                            )}

                                                        </div>

                                                        <div className="flex shrink-0 items-center gap-1.5 text-xs text-slate-400">

                                                            <Clock3
                                                                size={
                                                                    13
                                                                }
                                                            />

                                                            {
                                                                formatDate(
                                                                    notification.created_at
                                                                )
                                                            }

                                                        </div>

                                                    </div>

                                                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                                                        {
                                                            notification.message
                                                        }
                                                    </p>

                                                    <div className="mt-4">

                                                        {!notification.is_read ? (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleMarkAsRead(
                                                                        notification.id
                                                                    )
                                                                }
                                                                className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-50"
                                                            >
                                                                <Check
                                                                    size={
                                                                        15
                                                                    }
                                                                />
                                                                Mark as read
                                                            </button>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-400">
                                                                <CheckCheck
                                                                    size={
                                                                        15
                                                                    }
                                                                />
                                                                Read
                                                            </span>
                                                        )}

                                                    </div>

                                                </div>

                                            </div>

                                        </motion.div>
                                    );
                                }
                            )}

                        </div>
                    )}

                </div>

                {!loading &&
                    filteredNotifications.length >
                    0 && (
                        <p className="mt-4 text-sm text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {
                                    filteredNotifications.length
                                }
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-700">
                                {
                                    notifications.length
                                }
                            </span>{" "}
                            notifications
                        </p>
                    )}

            </div>

        </main>
    );
}