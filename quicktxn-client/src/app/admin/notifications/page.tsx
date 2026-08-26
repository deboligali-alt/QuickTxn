"use client";

import { useEffect, useState } from "react";
import {
    Bell,
    CheckCircle2,
    Clock3,
    RefreshCw,
    Send,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";

interface Notification {
    id: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const loadNotifications = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await api.get("/notifications", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setNotifications(res.data.data || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const sendBroadcast = async () => {
        if (!title.trim() || !message.trim()) {
            toast.error("Please enter a title and message.");
            return;
        }

        try {
            setSending(true);

            const token = localStorage.getItem("token");

            await api.post(
                "/admin/broadcast",
                { title, message },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Broadcast sent successfully!");

            setTitle("");
            setMessage("");

            loadNotifications();
        } catch (error) {
            console.error(error);
            toast.error("Unable to send broadcast.");
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    return (
        <main className="mx-auto max-w-5xl space-y-8 p-8">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-4xl font-bold">
                        Notifications
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Send announcements and monitor platform alerts.
                    </p>
                </div>

                <button
                    onClick={loadNotifications}
                    className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                >
                    <RefreshCw size={18} />
                    Refresh
                </button>

            </div>

            {/* Broadcast Card */}

            <div className="rounded-3xl bg-white p-8 shadow space-y-5">

                <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-green-100 p-3">
                        <Bell
                            className="text-green-700"
                            size={24}
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold">
                            Broadcast Notification
                        </h2>
                        <p className="text-sm text-slate-500">
                            Instantly notify every QuickTxn user.
                        </p>
                    </div>

                </div>

                <div>

                    <label className="mb-2 block font-medium">
                        Title
                    </label>

                    <input
                        type="text"
                        placeholder="System Maintenance"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-green-600"
                    />

                </div>

                <div>

                    <label className="mb-2 block font-medium">
                        Message
                    </label>

                    <textarea
                        rows={5}
                        placeholder="QuickTxn will be unavailable from 12:00 AM to 12:30 AM."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-green-600"
                    />

                </div>

                <button
                    onClick={sendBroadcast}
                    disabled={sending}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                >
                    <Send size={18} />
                    {sending
                        ? "Sending Broadcast..."
                        : "Send Broadcast"}
                </button>

            </div>

            {/* Notification History */}

            <div className="rounded-3xl bg-white shadow">

                <div className="border-b p-6">
                    <h2 className="text-xl font-bold">
                        Notification History
                    </h2>
                </div>

                {loading ? (

                    <div className="py-20 text-center">
                        Loading notifications...
                    </div>

                ) : notifications.length === 0 ? (

                    <div className="py-20 text-center text-slate-500">
                        No notifications available.
                    </div>

                ) : (

                    notifications.map((item) => (

                        <div
                            key={item.id}
                            className="flex items-start gap-4 border-b p-6 last:border-none"
                        >

                            <div
                                className={`rounded-full p-3 ${item.is_read
                                        ? "bg-green-100"
                                        : "bg-yellow-100"
                                    }`}
                            >

                                {item.is_read ? (
                                    <CheckCircle2
                                        className="text-green-600"
                                        size={22}
                                    />
                                ) : (
                                    <Bell
                                        className="text-yellow-600"
                                        size={22}
                                    />
                                )}

                            </div>

                            <div className="flex-1">

                                <div className="flex items-center justify-between">

                                    <h3 className="font-bold">
                                        {item.title}
                                    </h3>

                                    <span className="text-sm text-slate-500">
                                        {new Date(
                                            item.created_at
                                        ).toLocaleString("en-NG")}
                                    </span>

                                </div>

                                <p className="mt-2 text-slate-600">
                                    {item.message}
                                </p>

                                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">

                                    <Clock3 size={14} />

                                    {item.is_read ? "Read" : "Unread"}

                                </div>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </main>
    );
}