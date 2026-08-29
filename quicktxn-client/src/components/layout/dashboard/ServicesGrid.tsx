"use client";

import {
    Smartphone,
    Wifi,
    Trophy,
    Repeat,
    Landmark,
    Wallet,
    Tv,
    Zap,
    GraduationCap,
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
        title: "WAEC",
        icon: GraduationCap,
        color: "bg-sky-100 text-sky-600",
        path: "/waec",
    },
    {
        title: "Electricity",
        icon: Zap,
        color: "bg-yellow-100 text-yellow-600",
        path: "/electricity",
    },
    {
        title: "Cable TV",
        icon: Tv,
        color: "bg-indigo-100 text-indigo-600",
        path: "/cable",
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
        <section className="mt-6">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Services</h2>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {services.map((service) => {
                    const Icon = service.icon;

                    return (
                        <button
                            key={service.title}
                            onClick={() => router.push(service.path)}
                            className="group rounded-2xl bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95 sm:p-4"
                        >
                            <div
                                className={`mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full transition-transform group-hover:scale-110 sm:h-12 sm:w-12 ${service.color}`}
                            >
                                <Icon size={22} />
                            </div>

                            <p className="text-center text-[11px] font-semibold text-gray-700 sm:text-xs">
                                {service.title}
                            </p>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}