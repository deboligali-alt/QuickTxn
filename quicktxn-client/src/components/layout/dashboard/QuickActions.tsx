"use client";

import Link from "next/link";
import {
    Wallet,
    ArrowRightLeft,
    Smartphone,
    Wifi,
    Landmark,
    Gamepad2,
    RefreshCw,
    History,
} from "lucide-react";

const actions = [
    {
        title: "Fund Wallet",
        icon: Wallet,
        href: "/wallet/fund",
        color: "bg-green-500",
    },
    {
        title: "Transfer",
        icon: ArrowRightLeft,
        href: "/transfer",
        color: "bg-blue-500",
    },
    {
        title: "Airtime",
        icon: Smartphone,
        href: "/airtime",
        color: "bg-orange-500",
    },
    {
        title: "Data",
        icon: Wifi,
        href: "/data",
        color: "bg-purple-500",
    },
    {
        title: "Bank",
        icon: Landmark,
        href: "/bank-transfer",
        color: "bg-pink-500",
    },
    {
        title: "Betting",
        icon: Gamepad2,
        href: "/betting",
        color: "bg-indigo-500",
    },

    {
        title: "Airtime Swap",
        icon: RefreshCw,
        href: "/airtime-swap",
        color: "bg-emerald-500",
    },

    {
        title: "Swap History",
        icon: History,
        href: "/airtime-swap/history",
        color: "bg-purple-500",
    },

];

export default function QuickActions() {
    return (
        <section>

            <h2 className="mb-6 text-2xl font-bold text-slate-900">
                Quick Services
            </h2>

            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">

                {actions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <Link
                            key={action.title}
                            href={action.href}
                            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div
                                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-white ${action.color}`}
                            >
                                <Icon size={28} />
                            </div>

                            <h3 className="font-semibold text-slate-800">
                                {action.title}
                            </h3>
                        </Link>
                    );
                })}

            </div>

        </section>
    );
}