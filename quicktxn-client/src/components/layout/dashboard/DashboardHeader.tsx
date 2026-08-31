"use client";

import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
    fullName?: string;
    verified?: boolean;
    unreadCount?: number;
}

export default function DashboardHeader({
    fullName,
    verified,
    unreadCount = 0,
}: Props) {
    const router = useRouter();

    const firstName = fullName?.split(" ")[0] || "User";

    return (
        <header className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">
                    Welcome back 👋
                </p>

                <div className="mt-1 flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {firstName}
                    </h1>

                    {verified && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                            Verified
                        </span>
                    )}
                </div>
            </div>

            {/* Notification Bell */}
            <div className="relative">
                <button
                    onClick={() => router.push("/notifications")}
                    className="relative rounded-full bg-white p-3 shadow-sm transition hover:shadow-md"
                >
                    <Bell size={22} className="text-gray-700" />
                </button>

                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </div>
        </header>
    );
}