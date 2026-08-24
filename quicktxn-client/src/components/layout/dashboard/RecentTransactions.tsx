"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Transaction {
    id: string;
    type: string;
    amount: number;
    createdAt: string;
}

export default function RecentTransactions() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/transactions?page=1&limit=5`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setTransactions(res.data.transactions);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) {
        return (
            <section className="mt-6 px-4">
                <p className="text-gray-500">Loading transactions...</p>
            </section>
        );
    }

    return (
        <section className="mt-6 px-4">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Recent Transactions
                </h2>

                <button
                    onClick={() => router.push("/transactions")}
                    className="text-sm font-medium text-green-600"
                >
                    See all
                </button>
            </div>

            <div className="space-y-3">
                {transactions.map((tx) => (
                    <div
                        key={tx.id}
                        className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`rounded-full p-2 ${tx.amount > 0
                                        ? "bg-green-100"
                                        : "bg-red-100"
                                    }`}
                            >
                                {tx.amount > 0 ? (
                                    <ArrowDownLeft
                                        className="text-green-600"
                                        size={18}
                                    />
                                ) : (
                                    <ArrowUpRight
                                        className="text-red-600"
                                        size={18}
                                    />
                                )}
                            </div>

                            <div>
                                <p className="font-medium">
                                    {tx.type}
                                </p>

                                <p className="text-xs text-gray-500">
                                    {new Date(
                                        tx.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <span
                            className={`font-semibold ${tx.amount > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                        >
                            {tx.amount > 0 ? "+" : "-"}₦
                            {Math.abs(tx.amount).toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}