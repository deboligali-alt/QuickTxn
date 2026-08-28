"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    ArrowDownLeft,
    ArrowUpRight,
    ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import TransactionFilter from "@/components/layout/dashboard/TransactionFilter";

interface Transaction {
    id: string;
    type: "CREDIT" | "DEBIT";
    amount: number;
    description: string;
    status: string;
    created_at: string;
}

export default function TransactionsPage() {
    const router = useRouter();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        const loadTransactions = async () => {
            try {
                const res = await api.get("/transactions");
                setTransactions(res.data.transactions || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadTransactions();
    }, []);

    const filteredTransactions = transactions.filter((tx) => {
        const matchesSearch = tx.description
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesFilter =
            filter === "ALL" || tx.type === filter;

        return matchesSearch && matchesFilter;
    });

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
                <button
                    onClick={() => router.back()}
                    className="mb-5 flex items-center gap-2 text-gray-700"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <h1 className="mb-6 text-3xl font-bold">
                    Transactions
                </h1>

                <TransactionFilter
                    search={search}
                    setSearch={setSearch}
                    filter={filter}
                    setFilter={setFilter}
                />

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-20 animate-pulse rounded-2xl bg-white"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                        {filteredTransactions.length === 0 ? (
                            <div className="p-10 text-center text-gray-500">
                                No transactions found
                            </div>
                        ) : (
                            filteredTransactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between border-b p-4 last:border-0"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-full ${tx.type === "CREDIT"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {tx.type === "CREDIT" ? (
                                                <ArrowDownLeft size={22} />
                                            ) : (
                                                <ArrowUpRight size={22} />
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate font-semibold">
                                                {tx.description}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {new Date(
                                                    tx.created_at
                                                ).toLocaleString("en-NG")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p
                                            className={`font-bold ${tx.type === "CREDIT"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                                }`}
                                        >
                                            {tx.type === "CREDIT" ? "+" : "-"}₦
                                            {Number(tx.amount).toLocaleString()}
                                        </p>

                                        <span className="text-xs text-gray-500">
                                            {tx.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}