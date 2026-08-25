"use client";

import {
    Smartphone,
    Wifi,
    Trophy,
    Repeat,
    ArrowRightLeft,
    Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";

const services = [
    {
        name: "Airtime",
        icon: Smartphone,
        path: "/airtime",
    },
    {
        name: "Data",
        icon: Wifi,
        path: "/data",
    },
    {
        name: "Betting",
        icon: Trophy,
        path: "/betting",
    },
    {
        name: "Swap",
        icon: Repeat,
        path: "/airtime-swap",
    },
    {
        name: "Transfer",
        icon: ArrowRightLeft,
        path: "/transfer",
    },
    {
        name: "Wallet",
        icon: Wallet,
        path: "/wallet",
    },
];

export default function ServicesGrid() {
    const router = useRouter();

    return (
        <section className="px-4 mt-5">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
                Services
            </h2>

            <div className="grid grid-cols-3 gap-3">
                {services.map((service) => {
                    const Icon = service.icon;

                    return (
                        <button
                            key={service.name}
                            onClick={() => router.push(service.path)}
                            className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 shadow-sm transition active:scale-95"
                        >
                            <div className="rounded-full bg-green-100 p-3">
                                <Icon size={22} className="text-green-600" />
                            </div>

                            <span className="text-xs font-medium text-gray-700">
                                {service.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}