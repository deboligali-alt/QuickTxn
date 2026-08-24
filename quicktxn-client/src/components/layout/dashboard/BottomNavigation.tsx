"use client";

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

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white">
            <div className="mx-auto flex h-16 max-w-md items-center justify-around">
                {items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname.startsWith(item.path);

                    return (
                        <button
                            key={item.label}
                            onClick={() => router.push(item.path)}
                            className="flex flex-col items-center gap-1"
                        >
                            <Icon
                                size={22}
                                className={
                                    active ? "text-green-600" : "text-gray-400"
                                }
                            />

                            <span
                                className={`text-xs ${active
                                        ? "font-semibold text-green-600"
                                        : "text-gray-500"
                                    }`}
                            >
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}