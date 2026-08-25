"use client";

import { useEffect, useState } from "react";
import { House, Receipt, Bell, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

export default function BottomNavigation() {
    const pathname = usePathname();
    const router = useRouter();

    const [unread, setUnread] = useState(0);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const notifications = res.data.data || [];

                const count = notifications.filter(
                    (item: any) => item.is_read === false
                ).length;

                setUnread(count);
            } catch (error) {
                console.error(error);
            }
        };

        loadNotifications();
    }, []);

    const items = [
        { label: "Home", icon: House, path: "/dashboard" },
        { label: "History", icon: Receipt, path: "/transactions" },
        {
            label: "Alerts",
            icon: Bell,
            path: "/notifications",
            badge: unread,
        },
        { label: "Settings", icon: Settings, path: "/settings" },
    ];

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center">
            <div className="w-full max-w-md border-t border-gray-200 bg-white shadow-lg">
                <nav className="grid h-20 grid-cols-4">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const active = pathname.startsWith(item.path);

                        return (
                            <button
                                key={item.label}
                                onClick={() => router.push(item.path)}
                                className="relative flex flex-col items-center justify-center gap-1"
                            >
                                <div className="relative">
                                    <Icon
                                        size={22}
                                        className={
                                            active
                                                ? "text-green-600"
                                                : "text-gray-500"
                                        }
                                    />

                                    {item.badge && item.badge > 0 && (
                                        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                            {item.badge > 99 ? "99+" : item.badge}
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
        </div>
    );
}