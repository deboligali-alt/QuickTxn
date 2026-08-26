"use client";

import { useEffect, useState } from "react";
import {
    Clock3,
    CheckCircle2,
    XCircle,
    Wallet,
} from "lucide-react";

import api from "@/lib/api";

interface AirtimeStats {
    pending: number;
    approved: number;
    rejected: number;
    todayVolume: number;
}

export default function ConversionStats() {

    const [stats, setStats] = useState<AirtimeStats>({
        pending: 0,
        approved: 0,
        rejected: 0,
        todayVolume: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadStats = async () => {

            try {

                const token = localStorage.getItem("token");

                if (!token) {
                    return;
                }

                const response = await api.get(
                    "/admin/airtime-swaps/stats",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.success) {

                    setStats(response.data.data);

                }

            } catch (error) {

                console.error(
                    "Failed to load airtime swap statistics:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        loadStats();

    }, []);

    const statCards = [
        {
            title: "Pending",
            value: stats.pending,
            color: "bg-yellow-500",
            icon: Clock3,
        },
        {
            title: "Approved",
            value: stats.approved,
            color: "bg-green-600",
            icon: CheckCircle2,
        },
        {
            title: "Rejected",
            value: stats.rejected,
            color: "bg-red-500",
            icon: XCircle,
        },
        {
            title: "Today's Volume",
            value: `₦${stats.todayVolume.toLocaleString("en-NG")}`,
            color: "bg-blue-600",
            icon: Wallet,
        },
    ];

    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {statCards.map((item) => {

                const Icon = item.icon;

                return (
                    <div
                        key={item.title}
                        className="rounded-2xl bg-white p-6 shadow"
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-slate-500">
                                    {item.title}
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">

                                    {loading
                                        ? "..."
                                        : item.value}

                                </h2>

                            </div>

                            <div
                                className={`rounded-xl p-4 text-white ${item.color}`}
                            >

                                <Icon size={24} />

                            </div>

                        </div>

                    </div>
                );

            })}

        </div>
    );
}