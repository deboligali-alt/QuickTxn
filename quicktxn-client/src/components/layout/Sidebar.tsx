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
    Landmark,
    Repeat,
    Settings,
    LogOut,
    User,
    Lock,
} from "lucide-react";
import { toast } from "sonner";

const menu = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Wallet",
        href: "/wallet",
        icon: Wallet,
    },
    {
        name: "Transfer",
        href: "/transfer",
        icon: ArrowLeftRight,
    },
    {
        name: "Transactions",
        href: "/transactions",
        icon: History,
    },
    {
        name: "Airtime",
        href: "/airtime",
        icon: Smartphone,
    },
    {
        name: "Data",
        href: "/data",
        icon: Wifi,
    },
    {
        name: "Airtime Swap",
        href: "/airtime-swap",
        icon: Repeat,
    },
    {
        name: "Beneficiaries",
        href: "/beneficiaries",
        icon: Users,
    },
    {
        name: "Bank Transfer",
        href: "/bank-transfer",
        icon: Landmark,
    },
    {
        name: "Notifications",
        href: "/notifications",
        icon: Bell,
    },
    {
        name: "Profile",
        href: "/profile",
        icon: User,
    },
    {
        name: "Settings",
        href: "/settings",
        icon: Settings,
    },
    {
        name: "Transaction PIN",
        href: "/settings/pin",
        icon: Lock,
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const [showLogout, setShowLogout] =
        useState(false);

    const [loggingOut, setLoggingOut] =
        useState(false);

    // ========================================
    // LOGOUT
    // ========================================

    const logout = () => {
        if (loggingOut) {
            return;
        }

        try {
            setLoggingOut(true);

            // Clear authentication/session data
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Clear any cached QuickTxn data
            sessionStorage.clear();

            toast.success(
                "Logged out successfully."
            );

            // Replace current route so the user
            // cannot simply navigate back through
            // browser history.
            router.replace("/login");

        } catch (error) {
            console.error(
                "Logout error:",
                error
            );

            // Even if something unexpected happens,
            // remove authentication data and redirect.
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            router.replace("/login");

        } finally {
            setShowLogout(false);
            setLoggingOut(false);
        }
    };

    return (
        <>
            <aside className="flex h-screen w-72 flex-col bg-green-700 text-white shadow-xl">

                {/* ========================================
                    LOGO
                ======================================== */}

                <div className="border-b border-green-600 p-6">

                    <h1 className="text-3xl font-bold">
                        QuickTxn
                    </h1>

                    <p className="mt-1 text-sm text-green-100">
                        Digital Wallet
                    </p>

                </div>

                {/* ========================================
                    NAVIGATION
                ======================================== */}

                <nav className="flex-1 space-y-2 overflow-y-auto p-4">

                    {menu.map((item) => {
                        const Icon = item.icon;

                        const active =
                            pathname === item.href ||
                            pathname.startsWith(
                                item.href + "/"
                            );

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${active
                                        ? "bg-white font-semibold text-green-700 shadow"
                                        : "hover:bg-green-600"
                                    }`}
                            >

                                <Icon size={20} />

                                <span>
                                    {item.name}
                                </span>

                            </Link>
                        );
                    })}

                </nav>

                {/* ========================================
                    LOGOUT
                ======================================== */}

                <div className="border-t border-green-600 p-4">

                    <button
                        type="button"
                        onClick={() =>
                            setShowLogout(true)
                        }
                        disabled={loggingOut}
                        className="flex w-full items-center gap-3 rounded-xl bg-red-500 px-4 py-3 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        <LogOut size={20} />

                        {loggingOut
                            ? "Logging out..."
                            : "Logout"}

                    </button>

                </div>

            </aside>

            {/* ========================================
                LOGOUT CONFIRMATION MODAL
            ======================================== */}

            {showLogout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
                            <LogOut size={22} />
                        </div>

                        <h2 className="mt-5 text-2xl font-bold text-slate-900">
                            Logout
                        </h2>

                        <p className="mt-3 text-slate-600">
                            Are you sure you want to
                            logout from your account?
                        </p>

                        <div className="mt-8 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setShowLogout(false)
                                }
                                disabled={loggingOut}
                                className="rounded-lg border border-slate-300 px-5 py-2 font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={logout}
                                disabled={loggingOut}
                                className="rounded-lg bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loggingOut
                                    ? "Logging out..."
                                    : "Logout"}
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </>
    );
}