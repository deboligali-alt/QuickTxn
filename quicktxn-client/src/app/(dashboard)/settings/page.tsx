"use client";

import {
    User,
    Shield,
    Bell,
    CircleHelp,
    ChevronRight,
    LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

const menus = [
    {
        title: "Profile",
        icon: User,
        path: "/profile",
    },
    {
        title: "Security",
        icon: Shield,
        path: "/settings/pin",
    },
    {
        title: "Notifications",
        icon: Bell,
        path: "/notifications",
    },
    {
        title: "Help & Support",
        icon: CircleHelp,
        path: "/support",
    },
];

export default function SettingsPage() {
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 px-4 py-6">

            <h1 className="mb-6 text-2xl font-bold">Settings</h1>

            <div className="space-y-3">
                {menus.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.title}
                            onClick={() => router.push(item.path)}
                            className="flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <Icon className="text-green-600" size={20} />
                                <span className="font-medium">{item.title}</span>
                            </div>

                            <ChevronRight size={18} className="text-gray-400" />
                        </button>
                    );
                })}
            </div>

            <button
                onClick={logout}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-4 font-semibold text-white"
            >
                <LogOut size={20} />
                Logout
            </button>

        </main>
    );
}