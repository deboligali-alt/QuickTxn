"use client";

import {
    Smartphone,
    Wifi,
    Trophy,
    Repeat,
    ArrowUpRight,
    Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";

const services = [
    {
        name: "Airtime",
        icon: Smartphone,
        color: "bg-orange-100 text-orange-600",
        path: "/airtime",
    },
    {
        name: "Data",
        icon: Wifi,
        color: "bg-blue-100 text-blue-600",
        path: "/data",
    },
    {
        name: "Betting",
        icon: Trophy,
        color: "bg-green-100 text-green-600",
        path: "/betting",
    },
    {
        name: "Swap",
        icon: Repeat,
        color: "bg-purple-100 text-purple-600",
        path: "/airtime-swap",
    },
    {
        name: "Transfer",
        icon: ArrowUpRight,
        color: "bg-emerald-100 text-emerald-600",
        path: "/transfer",
    },
    {
        name: "Wallet",
        icon: Wallet,
        color: "bg-gray-100 text-gray-700",
        path: "/wallet",
    },
];

export default function ServicesGrid() {
    const router = useRouter();

    return (
        <section className="mt-5 px-4">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
                Services
            </h2>

            <div className="grid grid-cols-3 gap-4">
                {services.map((service) => {
                    const Icon = service.icon;

                    return (
                        <button
                            key={service.name}
                            onClick={() => router.push(service.path)}
                            className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md active:scale-95"
                        >
                            <div
                                className={`mb-3 rounded-full p-3 ${service.color}`}
                            >
                                <Icon size={24} />
                            </div>

                            <span className="text-xs font-semibold text-gray-700">
                                {service.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}