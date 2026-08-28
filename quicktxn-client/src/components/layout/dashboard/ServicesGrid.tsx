"use client";

import {
    Smartphone,
    Wifi,
    Trophy,
    Repeat,
    Landmark,
    Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";

const services = [
    {
        title: "Airtime",
        icon: Smartphone,
        color: "bg-blue-100 text-blue-600",
        path: "/airtime",
    },
    {
        title: "Data",
        icon: Wifi,
        color: "bg-purple-100 text-purple-600",
        path: "/data",
    },
    {
        title: "Betting",
        icon: Trophy,
        color: "bg-orange-100 text-orange-600",
        path: "/betting",
    },
    {
        title: "Swap",
        icon: Repeat,
        color: "bg-pink-100 text-pink-600",
        path: "/airtime-swap",
    },
    {
        title: "Transfer",
        icon: Landmark,
        color: "bg-green-100 text-green-600",
        path: "/transfer",
    },
    {
        title: "Wallet",
        icon: Wallet,
        color: "bg-emerald-100 text-emerald-600",
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

            <div className="grid grid-cols-3 gap-3">
                {services.map((service) => {
                    const Icon = service.icon;

                    return (
                        <button
                            key={service.title}
                            onClick={() => router.push(service.path)}
                            className="rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md active:scale-95"
                        >
                            <div
                                className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full ${service.color}`}
                            >
                                <Icon size={24} />
                            </div>

                            <p className="text-xs font-semibold text-gray-700">
                                {service.title}
                            </p>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}