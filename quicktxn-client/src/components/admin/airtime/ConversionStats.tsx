"use client";

import { useEffect, useState } from "react";
import {
    Clock3,
    CheckCircle2,
    XCircle,
    Wallet,
} from "lucide-react";
import { getAllSwaps } from "@/services/admin.service";

interface Swap {
    status: "PENDING" | "APPROVED" | "REJECTED";
    receivable_amount: number;
}

export default function ConversionStats() {
    const [stats, setStats] = useState({
        pending: 0,
        approved: 0,
        rejected: 0,
        totalAmount: 0,
    });

    useEffect(() => {
        const loadStats = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await getAllSwaps(token);
                const swaps: Swap[] = res.data || [];

                const pending = swaps.filter(
                    (s) => s.status === "PENDING"
                ).length;

                const approved = swaps.filter(
                    (s) => s.status === "APPROVED"
                ).length;

                const rejected = swaps.filter(
                    (s) => s.status === "REJECTED"
                ).length;

                const totalAmount = swaps
                    .filter((s) => s.status === "APPROVED")
                    .reduce(
                        (sum, s) =>
                            sum + Number(s.receivable_amount),
                        0
                    );

                setStats({
                    pending,
                    approved,
                    rejected,
                    totalAmount,
                });
            } catch (err) {
                console.error(err);
            }
        };

        loadStats();
    }, []);

    const cards = [
        {
            title: "Pending",
            value: stats.pending,
            icon: Clock3,
            color: "bg-yellow-100 text-yellow-600",
        },
        {
            title: "Approved",
            value: stats.approved,
            icon: CheckCircle2,
            color: "bg-green-100 text-green-600",
        },
        {
            title: "Rejected",
            value: stats.rejected,
            icon: XCircle,
            color: "bg-red-100 text-red-600",
        },
        {
            title: "Wallet Credited",
            value: `₦${stats.totalAmount.toLocaleString()}`,
            icon: Wallet,
            color: "bg-blue-100 text-blue-600",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className="rounded-2xl bg-white p-5 shadow-sm"
                    >
                        <div
                            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
                        >
                            <Icon size={24} />
                        </div>

                        <p className="text-sm text-gray-500">
                            {card.title}
                        </p>

                        <h2 className="mt-1 text-2xl font-bold">
                            {card.value}
                        </h2>
                    </div>
                );
            })}
        </div>
    );
}