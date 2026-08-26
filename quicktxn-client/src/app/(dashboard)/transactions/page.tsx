"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import {
    ArrowDownLeft,
    ArrowUpRight,
    Search,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Transaction {
    id: string;
    type: string;
    amount: number;
    status: string;
    createdAt: string;
}

const filters = ["All", "Funding", "Transfer", "Airtime", "Data"];

export default function TransactionsPage() {
    const router = useRouter();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await api.get("/transactions");
                setTransactions(res.data.transactions);
            } catch (error) {
                console.error("Transaction fetch failed:", error);
            }
        };

        fetchTransactions();
    }, []);

    const filtered = useMemo(() => {
        return transactions.filter((tx) => {
            const matchSearch = tx.type
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchFilter =
                activeFilter === "All"
                    ? true
                    : tx.type.toLowerCase().includes(activeFilter.toLowerCase());

            return matchSearch && matchFilter;
        });
    }, [transactions, search, activeFilter]);

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4 pb-24">
            <h1 className="mb-5 text-2xl font-bold">Transactions</h1>

            <div className="mb-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm">
                <Search size={18} className="text-gray-400" />
                <input
                    placeholder="Search transaction..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full outline-none"
                />
            </div>

            <div className="mb-5 flex gap-2 overflow-x-auto">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${activeFilter === filter
                                ? "bg-green-600 text-white"
                                : "bg-white text-gray-600"
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {filtered.map((tx) => (
                    <button
                        key={tx.id}
                        onClick={() => router.push(`/transactions/${tx.id}`)}
                        className="flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`rounded-full p-3 ${tx.amount > 0 ? "bg-green-100" : "bg-red-100"
                                    }`}
                            >
                                {tx.amount > 0 ? (
                                    <ArrowDownLeft size={18} className="text-green-600" />
                                ) : (
                                    <ArrowUpRight size={18} className="text-red-600" />
                                )}
                            </div>

                            <div className="text-left">
                                <h3 className="font-semibold">{tx.type}</h3>

                                <p className="text-xs text-gray-500">
                                    {new Date(tx.createdAt).toLocaleString("en-NG", {
                                        day: "numeric",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                            <p
                                className={`font-bold ${tx.amount > 0 ? "text-green-600" : "text-red-600"
                                    }`}
                            >
                                {tx.amount > 0 ? "+" : "-"}₦
                                {Math.abs(tx.amount).toLocaleString()}
                            </p>

                            <span
                                className={`text-xs ${tx.status === "success"
                                        ? "text-green-600"
                                        : "text-orange-500"
                                    }`}
                            >
                                {tx.status}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </main>
    );
}