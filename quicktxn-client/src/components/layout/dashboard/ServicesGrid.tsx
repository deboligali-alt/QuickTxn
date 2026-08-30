"use client";

import {
    Smartphone,
    Wifi,
    Trophy,
    Repeat,
    Landmark,
    Tv,
    Zap,
    GraduationCap,
} from "lucide-react";
import { useRouter } from "next/navigation";

const services = [
    {
        title: "Airtime",
        icon: Smartphone,
        color: "bg-gradient-to-br from-green-500 to-emerald-600 text-white",
        path: "/airtime",
    },
    {
        title: "Data",
        icon: Wifi,
        color: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white",
        path: "/data",
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
        title: "WAEC",
        icon: GraduationCap,
        color: "bg-sky-100 text-sky-600",
        path: "/waec",
    },
    {
        title: "Betting",
        icon: Trophy,
        color: "bg-orange-100 text-orange-600",
        path: "/betting",
    },
    {
        title: "Airtime to Cash",
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
];

export default function ServicesGrid() {
    const router = useRouter();

    return (
        <section className="mt-5">
            <h2 className="mb-3 text-lg font-bold text-gray-900">
                Services
            </h2>

            <div className="grid grid-cols-4 gap-3">
                {services.map((service) => {
                    const Icon = service.icon;

                    return (
                        <button
                            key={service.title}
                            onClick={() => router.push(service.path)}
                            className="group rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-95"
                        >
                            <div
                                className={`mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl ${service.color} transition-transform group-hover:scale-110`}
                            >
                                <Icon size={20} />
                            </div>

                            <p className="text-center text-[10px] font-semibold leading-tight text-gray-700">
                                {service.title}
                            </p>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}