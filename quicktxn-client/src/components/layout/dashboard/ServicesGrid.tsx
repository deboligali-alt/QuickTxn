"use client";

import {
    Smartphone,
    Wifi,
    Trophy,
    Repeat,
    Landmark,
    Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

const services = [
    { title: "Airtime", icon: Smartphone, color: "text-blue-600", path: "/airtime" },
    { title: "Data", icon: Wifi, color: "text-cyan-600", path: "/data" },
    { title: "Betting", icon: Trophy, color: "text-purple-600", path: "/betting" },
    { title: "Swap", icon: Repeat, color: "text-orange-600", path: "/airtime-swap" },
    { title: "Transfer", icon: Landmark, color: "text-green-600", path: "/transfer" },
    { title: "Bills", icon: Zap, color: "text-red-600", path: "/wallet" },
];

export default function ServicesGrid() {
    const router = useRouter();

    return (
        <section className="mt-6 px-4">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
                Services
            </h2>

            <div className="grid grid-cols-3 gap-3">
                {services.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.title}
                            onClick={() => router.push(item.path)}
                            className="rounded-2xl bg-white p-4 shadow-sm transition active:scale-95"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <Icon className={`${item.color}`} size={26} />
                                <span className="text-xs font-medium text-gray-700">
                                    {item.title}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}