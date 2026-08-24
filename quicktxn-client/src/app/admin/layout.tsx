
"use client";
import { FileBarChart } from "lucide-react";
import { History } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Gift } from "lucide-react";
import { Headset } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { Landmark } from "lucide-react";
import { Settings } from "lucide-react";
import { Bell } from "lucide-react";
import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Smartphone,
    CreditCard,
    Wallet,
    Menu,
} from "lucide-react";
import { useState } from "react";

import AdminGuard from "@/components/auth/AdminGuard";

const menu = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
        title: "Reports",
        href: "/admin/reports",
        icon: FileBarChart,
        roles: ["SUPER_ADMIN"],
    },
    {
        title: "Audit Log",
        href: "/admin/audit",
        icon: History,
        roles: ["SUPER_ADMIN"],
    },
    {
        title: "Withdrawals",
        href: "/admin/withdrawals",
        icon: ArrowUpRight,
        roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
        title: "Referrals",
        href: "/admin/referrals",
        icon: Gift,
        roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
        title: "Support",
        href: "/admin/support",
        icon: Headset,
        roles: ["SUPER_ADMIN", "ADMIN", "SUPPORT"],
    },
    {
        title: "KYC",
        href: "/admin/kyc",
        icon: ShieldCheck,
        roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
        title: "Bank Account",
        href: "/admin/bank-account",
        icon: Landmark,
        roles: ["SUPER_ADMIN"],
    },
    {
        title: "Wallet Funding",
        href: "/admin/wallet-funding",
        icon: Landmark,
        roles: ["SUPER_ADMIN", "ADMIN"],
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
        roles: ["SUPER_ADMIN"],
    },
    {
        title: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users,
        roles: ["SUPER_ADMIN", "ADMIN", "SUPPORT"],
    },
    {
        title: "Airtime Swaps",
        href: "/admin/airtime-swaps",
        icon: Smartphone,
        roles: ["SUPER_ADMIN", "ADMIN", "AGENT"],
    },
    {
        title: "Transactions",
        href: "/admin/transactions",
        icon: CreditCard,
    },
    {
        title: "Airtime Rates",
        href: "/admin/airtime-rates",
        icon: Wallet,
    },
    {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
        roles: ["SUPER_ADMIN"],
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <AdminGuard>
            <div className="min-h-screen bg-slate-100">
                {/* Mobile Header */}
                <header className="flex items-center justify-between border-b bg-white px-4 py-4 lg:hidden">
                    <h1 className="text-xl font-bold text-green-700">
                        QuickTxn Admin
                    </h1>

                    <button
                        onClick={() => setOpen(!open)}
                        className="rounded-lg bg-green-600 p-2 text-white"
                    >
                        <Menu size={22} strokeWidth={2.5} />
                    </button>
                </header>

                <div className="flex">
                    {/* Sidebar */}
                    <aside
                        className={`fixed z-50 h-screen w-72 bg-gradient-to-b from-green-700 to-emerald-600 p-6 text-white transition-all duration-300 lg:static ${open ? "left-0" : "-left-80 lg:left-0"
                            }`}
                    >
                        <div className="mb-10">
                            <h2 className="text-3xl font-bold">QuickTxn</h2>
                            <p className="mt-1 text-green-100">Admin Control Center</p>
                        </div>

                        <nav className="space-y-3">
                            {menu.map((item) => {
                                const Icon = item.icon;
                                const active =
                                    pathname === item.href ||
                                    pathname.startsWith(item.href + "/");

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${active
                                            ? "bg-white text-green-700 font-semibold shadow-lg"
                                            : "text-green-50 hover:bg-white/10"
                                            }`}
                                    >
                                        <Icon size={22} strokeWidth={2.3} />
                                        {item.title}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="mt-auto pt-12">
                            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                                <p className="text-sm text-green-100">
                                    Logged in as
                                </p>
                                <h3 className="mt-1 font-bold">Administrator</h3>
                            </div>
                        </div>
                    </aside>

                    {/* Overlay */}
                    {open && (
                        <div
                            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                            onClick={() => setOpen(false)}
                        />
                    )}

                    {/* Main Content */}
                    <main className="flex-1 p-4 lg:p-8">{children}</main>
                </div>
            </div>
        </AdminGuard>
    );
}