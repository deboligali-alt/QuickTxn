"use client";

import {
    Smartphone,
    Wifi,
    Trophy,
    RefreshCw,
    CreditCard,
    Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";

const services = [
    {
        title: "Airtime",
        icon: Smartphone,
        path: "/airtime",
    },
    {
        title: "Data",
        icon: Wifi,
        path: "/data",
    },
    {
        title: "Betting",
        icon: Trophy,
        path: "/betting",
    },
    {
        title: "Swap",
        icon: RefreshCw,
        path: "/airtime-swap",
    },
    {
        title: "Transfer",
        icon: CreditCard,
        path: "/transfer",
    },
    {
        title: "Wallet",
        icon: Wallet,
        path: "/wallet",
    },
];

export default function ServicesGrid() {
    const router = useRouter();

    return (
        <section className="mt-6 px-4">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Services
            </h2>

            <div className="grid grid-cols-3 gap-3">
                {services.map((service) => {
                    const Icon = service.icon;

                    return (
                        <button
                            key={service.title}
                            onClick={() => router.push(service.path)}
                            className="flex aspect-square flex-col items-center justify-center rounded-2xl bg-white shadow-sm transition hover:shadow-md active:scale-95"
                        >
                            <div className="mb-2 rounded-full bg-green-100 p-3">
                                <Icon
                                    size={22}
                                    className="text-green-600"
                                />
                            </div>

                            <span className="text-xs font-medium text-gray-700">
                                {service.title}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}