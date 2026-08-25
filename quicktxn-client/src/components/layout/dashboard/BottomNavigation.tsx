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
        <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center">
            <div className="w-full max-w-md border-t border-gray-200 bg-white/95 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
                <nav
                    className="grid h-20 grid-cols-4 px-2"
                    style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
                >
                    {items.map((item) => {
                        const Icon = item.icon;
                        const active = pathname.startsWith(item.path);

                        return (
                            <button
                                key={item.label}
                                onClick={() => router.push(item.path)}
                                className="flex flex-col items-center justify-center gap-1 active:scale-95 transition"
                            >
                                <div
                                    className={`rounded-full p-2 ${active
                                            ? "bg-green-100 text-green-600"
                                            : "text-gray-400"
                                        }`}
                                >
                                    <Icon size={22} strokeWidth={2.2} />
                                </div>

                                <span
                                    className={`text-[11px] font-medium ${active
                                            ? "text-green-600"
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