"use client";

import { useState } from "react";
import {
    User,
    Lock,
    Bell,
    ShieldCheck,
    LogOut,
    ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const router = useRouter();

    const [notifications, setNotifications] = useState(true);


    const logout = () => {
        localStorage.removeItem("token");
        sessionStorage.clear();
        router.replace("/login");
    };

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4 pb-24">
            <h1 className="mb-6 text-2xl font-bold">Settings</h1>

            {/* Account */}
            <div className="mb-6">
                <p className="mb-3 text-xs font-semibold uppercase text-gray-500">
                    Account
                </p>

                <div className="space-y-3">
                    <button
                        onClick={() => router.push("/profile")}
                        className="flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <User className="text-green-600" size={20} />
                            <span className="font-medium">Profile</span>
                        </div>
                        <ChevronRight size={18} className="text-gray-400" />
                    </button>

                    <button
                        onClick={() => router.push("/change-pin")}
                        className="flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <Lock className="text-green-600" size={20} />
                            <span className="font-medium">Transaction PIN</span>
                        </div>
                        <ChevronRight size={18} className="text-gray-400" />
                    </button>
                </div>
            </div>

            <button
                onClick={() => router.push("/set-pin")}
                className="flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
            >
                <div className="flex items-center gap-3">
                    <ShieldCheck className="text-green-600" size={20} />
                    <span className="font-medium">Create PIN</span>
                </div>

                <ChevronRight size={18} className="text-gray-400" />
            </button>

            {/* Preferences */}
            <div className="mb-6">
                <p className="mb-3 text-xs font-semibold uppercase text-gray-500">
                    Preferences
                </p>

                <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <Bell className="text-green-600" size={20} />
                            <span className="font-medium">Notifications</span>
                        </div>

                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`h-7 w-12 rounded-full transition ${notifications ? "bg-green-600" : "bg-gray-300"
                                }`}
                        >
                            <div
                                className={`h-5 w-5 rounded-full bg-white transition ${notifications ? "translate-x-6" : "translate-x-1"
                                    }`}
                            />
                        </button>
                    </div>


                </div>
            </div>

            {/* Logout */}
            <button
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-4 font-semibold text-white"
            >
                <LogOut size={18} />
                Logout
            </button>
        </main>
    );
}