"use client";

import { useEffect, useState } from "react";
import { House, Receipt, Bell, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import api from "@/lib/api";
interface NavItem {
    label: string;
    icon: any;
    path: string;
    badge?: number;
}
export default function BottomNavigation() {
    const pathname = usePathname();
    const router = useRouter();

    const [unread, setUnread] = useState(0);

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const res = await api.get("/notifications");

                const notifications = res.data.data || [];

                const count = notifications.filter(
                    (item: any) => item.is_read === false
                ).length;

                setUnread(count);
            } catch (error) {
                console.error("Failed to load notifications:", error);
            }
        };

        loadNotifications();
    }, []);

    const items: NavItem[] = [
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
        <div className="fixed inset-x-0 bottom-3 z-50 flex justify-center lg:hidden px-3">
            <nav className="flex w-full max-w-md items-center rounded-2xl border border-gray-200 bg-white/95 p-2 shadow-2xl backdrop-blur">
                {items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname.startsWith(item.path);

                    return (
                        <button
                            key={item.label}
                            onClick={() => router.push(item.path)}
                            className={`relative flex flex-1 flex-col items-center justify-center rounded-xl py-2 transition ${active
                                ? "bg-green-600 text-white"
                                : "text-gray-500 hover:bg-gray-100"
                                }`}
                        >
                            <div className="relative">
                                <Icon size={20} />

                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                        {item.badge > 99 ? "99+" : item.badge}
                                    </span>
                                )}
                            </div>

                            <span className="mt-1 text-[10px] font-medium">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}