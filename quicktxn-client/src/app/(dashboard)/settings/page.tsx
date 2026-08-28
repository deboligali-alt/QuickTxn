"use client";

import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    User,
    Shield,
    Bell,
    Lock,
    ChevronRight,
    LogOut,
} from "lucide-react";

const menus = [
    {
        title: "Profile",
        icon: User,
        path: "/profile",
    },
    {
        title: "Transaction PIN",
        icon: Shield,
        path: "/settings/pin",
    },
    {
        title: "Notifications",
        icon: Bell,
        path: "/notifications",
    },
    {
        title: "Security",
        icon: Lock,
        path: "/settings/security",
    },
];

export default function SettingsPage() {
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();
        router.replace("/login");
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 lg:px-8">
                <button
                    onClick={() => router.back()}
                    className="mb-5 flex items-center gap-2 text-gray-700"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <h1 className="mb-6 text-3xl font-bold">Settings</h1>

                <div className="space-y-4">
                    {menus.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.title}
                                onClick={() => router.push(item.path)}
                                className="flex w-full items-center justify-between rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="rounded-xl bg-green-100 p-3 text-green-600">
                                        <Icon size={22} />
                                    </div>

                                    <span className="font-semibold">
                                        {item.title}
                                    </span>
                                </div>

                                <ChevronRight
                                    size={20}
                                    className="text-gray-400"
                                />
                            </button>
                        );
                    })}

                    <button
                        onClick={logout}
                        className="flex w-full items-center justify-between rounded-2xl bg-red-50 p-5 text-red-600 shadow-sm transition hover:bg-red-100"
                    >
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-red-100 p-3">
                                <LogOut size={22} />
                            </div>

                            <span className="font-semibold">
                                Logout
                            </span>
                        </div>

                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </main>
    );
}