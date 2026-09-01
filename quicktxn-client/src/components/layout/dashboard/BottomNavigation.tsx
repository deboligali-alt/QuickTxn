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

    const loadUnreadCount = async () => {
        try {
            const res = await api.get("/notifications/unread-count");
            setUnread(res.data.count || 0);
        } catch (error) {
            console.error("Failed to load unread count:", error);
        }
    };

    useEffect(() => {
        loadUnreadCount();

        const refresh = () => loadUnreadCount();

        window.addEventListener("focus", refresh);

        return () => {
            window.removeEventListener("focus", refresh);
        };
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
        <div className="fixed inset-x-0 bottom-3 z-50 px-3 lg:hidden">
            <div className="mx-auto max-w-md">
                <nav className="flex items-center rounded-2xl border border-gray-200 bg-white/95 p-2 shadow-2xl backdrop-blur">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const active =
                            item.path === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname.startsWith(item.path);

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
                                        <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
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
        </div>
    );
}