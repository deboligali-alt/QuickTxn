"use client";

import { useRouter } from "next/navigation";

interface Props {
    fullName?: string;
    verified?: boolean;
    unreadCount?: number;
}

export default function DashboardHeader({
    fullName,
    verified,
}: Props) {
    const router = useRouter();

    const firstName = fullName?.split(" ")[0] || "User";

    const initials = fullName
        ? fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
        : "U";

    return (
        <header className="flex items-center justify-between">
            {/* Left */}
            <div>
                <p className="text-sm text-gray-500">Welcome back 👋</p>

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

            {/* Right Profile Image */}
            <button
                onClick={() => router.push("/profile")}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-emerald-500 text-lg font-bold text-white shadow-md transition hover:scale-105"
            >
                {initials}
            </button>
        </header>
    );
}