"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Wallet,
    ArrowLeftRight,
    Smartphone,
    Wifi,
    Bell,
    Users,
    History,
    Repeat,
    Settings,
    LogOut,
    User,
    Lock,
} from "lucide-react";
import { toast } from "sonner";

const menu = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Wallet", href: "/wallet", icon: Wallet },
    { name: "Transfer", href: "/transfer", icon: ArrowLeftRight },
    { name: "Transactions", href: "/transactions", icon: History },
    { name: "Airtime", href: "/airtime", icon: Smartphone },
    { name: "Data", href: "/data", icon: Wifi },
    { name: "Airtime Swap", href: "/airtime-swap", icon: Repeat },
    { name: "Beneficiaries", href: "/beneficiaries", icon: Users },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Transaction PIN", href: "/settings/pin", icon: Lock },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const [showLogout, setShowLogout] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const logout = () => {
        if (loggingOut) return;

        try {
            setLoggingOut(true);

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            sessionStorage.clear();

            toast.success("Logged out successfully.");
            router.replace("/login");
        } finally {
            setShowLogout(false);
            setLoggingOut(false);
        }
    };

    return (
        <>
            <aside className="sticky top-0 hidden h-screen w-72 flex-col bg-green-700 text-white shadow-xl lg:flex">
                <div className="border-b border-green-600 p-6">
                    <h1 className="text-3xl font-bold">QuickTxn</h1>
                    <p className="mt-1 text-sm text-green-100">
                        Digital Wallet
                    </p>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto p-4">
                    {menu.map((item) => {
                        const Icon = item.icon;
                        const active =
                            pathname === item.href ||
                            pathname.startsWith(item.href + "/");

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${active
                                        ? "bg-white text-green-700 font-semibold shadow"
                                        : "hover:bg-green-600"
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-green-600 p-4">
                    <button
                        onClick={() => setShowLogout(true)}
                        className="flex w-full items-center gap-3 rounded-xl bg-red-500 px-4 py-3 hover:bg-red-600"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {showLogout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6">
                        <h2 className="text-xl font-bold">Logout</h2>
                        <p className="mt-2 text-gray-600">
                            Are you sure you want to logout?
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setShowLogout(false)}
                                className="rounded-lg border px-4 py-2"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={logout}
                                className="rounded-lg bg-red-600 px-4 py-2 text-white"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}