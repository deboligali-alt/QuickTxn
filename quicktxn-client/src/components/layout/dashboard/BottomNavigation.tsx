"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    House,
    Receipt,
    Bell,
    Settings,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const items = [
    { label: "Home", icon: House, path: "/dashboard" },
    { label: "History", icon: Receipt, path: "/transactions" },
    { label: "Alerts", icon: Bell, path: "/notifications" },
    { label: "Settings", icon: Settings, path: "/settings" },
];

export default function BottomNavigation() {
    const pathname = usePathname();
    const router = useRouter();

    const [unread, setUnread] = useState(0);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) return;

                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const unreadCount = res.data.data.filter(
                    (item: any) => !item.is_read
                ).length;

                setUnread(unreadCount);
            } catch (error) {
                console.error("Notification error:", error);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="fixed bottom-4 left-0 right-0 z-50 px-4">
            <nav className="mx-auto flex h-16 w-full max-w-md items-center justify-around rounded-3xl border border-gray-200 bg-white/95 shadow-2xl backdrop-blur">
                {items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname.startsWith(item.path);

                    return (
                        <button
                            key={item.label}
                            onClick={() => router.push(item.path)}
                            className="flex flex-col items-center gap-1"
                        >
                            <div className="relative">
                                <div
                                    className={`rounded-full p-2 transition ${active
                                            ? "bg-green-100 text-green-600"
                                            : "text-gray-400"
                                        }`}
                                >
                                    <Icon size={20} />
                                </div>

                                {item.label === "Alerts" && unread > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                        {unread > 9 ? "9+" : unread}
                                    </span>
                                )}
                            </div>

                            <span
                                className={`text-[11px] ${active
                                        ? "font-semibold text-green-600"
                                        : "text-gray-500"
                                    }`}
                            >
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}