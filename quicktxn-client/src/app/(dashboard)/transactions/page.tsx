"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import {
    ArrowDownLeft,
    ArrowUpRight,
    ArrowLeft,
    Receipt,
    Wallet,
    TrendingUp,
    ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import TransactionFilter from "@/components/layout/dashboard/TransactionFilter";

interface Transaction {
    id: string;
    reference: string; // ✅ Added
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

    const filteredTransactions = useMemo(() => {
        return transactions.filter((tx) => {
            const matchesSearch = tx.description
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesFilter =
                filter === "ALL" || tx.type === filter;

            return matchesSearch && matchesFilter;
        });
    }, [transactions, search, filter]);

    const totalCredit = transactions
        .filter((t) => t.type === "CREDIT")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalDebit = transactions
        .filter((t) => t.type === "DEBIT")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl px-4 py-5 pb-24">
                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="mb-4 flex items-center gap-2 text-gray-600"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white shadow-lg"
                >
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-white/20 p-3">
                            <Receipt size={30} />
                        </div>

                        <div>
                            <p className="text-sm text-green-100">
                                Wallet Activity
                            </p>
                            <h1 className="text-2xl font-bold">
                                Transaction History
                            </h1>
                        </div>
                    </div>
                </motion.div>

                {/* Summary */}
                <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <Wallet className="mb-2 text-green-600" size={22} />
                        <p className="text-xs text-gray-500">
                            Total Transactions
                        </p>
                        <h3 className="mt-1 text-xl font-bold">
                            {transactions.length}
                        </h3>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <TrendingUp
                            className="mb-2 text-green-600"
                            size={22}
                        />
                        <p className="text-xs text-gray-500">Credits</p>
                        <h3 className="mt-1 text-lg font-bold text-green-600">
                            ₦{totalCredit.toLocaleString()}
                        </h3>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <ArrowUpRight
                            className="mb-2 text-red-500"
                            size={22}
                        />
                        <p className="text-xs text-gray-500">Debits</p>
                        <h3 className="mt-1 text-lg font-bold text-red-500">
                            ₦{totalDebit.toLocaleString()}
                        </h3>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <Receipt className="mb-2 text-blue-600" size={22} />
                        <p className="text-xs text-gray-500">Successful</p>
                        <h3 className="mt-1 text-xl font-bold text-blue-600">
                            {
                                transactions.filter(
                                    (t) =>
                                        t.status.toLowerCase() === "success"
                                ).length
                            }
                        </h3>
                    </div>
                </div>

                {/* Filter */}
                <div className="mt-5">
                    <TransactionFilter
                        search={search}
                        setSearch={setSearch}
                        filter={filter}
                        setFilter={setFilter}
                    />
                </div>

                {/* Transactions */}
                <div className="mt-5 space-y-3">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-20 animate-pulse rounded-2xl bg-white"
                            />
                        ))
                    ) : filteredTransactions.length === 0 ? (
                        <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
                            <Receipt
                                size={48}
                                className="mx-auto text-gray-300"
                            />
                            <h3 className="mt-4 text-lg font-semibold">
                                No Transactions
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Your transactions will appear here.
                            </p>
                        </div>
                    ) : (
                        filteredTransactions.map((tx) => (
                            <motion.button
                                key={tx.id}
                                whileTap={{ scale: 0.98 }}
                                onClick={() =>
                                    router.push(
                                        `/transaction/${tx.reference}`
                                    )
                                }
                                className="w-full rounded-2xl bg-white p-4 text-left shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
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
                                            <p className="truncate font-semibold text-gray-900">
                                                {tx.description}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-500">
                                                {new Date(
                                                    tx.created_at
                                                ).toLocaleString("en-NG", {
                                                    dateStyle: "medium",
                                                    timeStyle: "short",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="ml-3 text-right">
                                        <p
                                            className={`font-bold ${tx.type === "CREDIT"
                                                    ? "text-green-600"
                                                    : "text-red-500"
                                                }`}
                                        >
                                            {tx.type === "CREDIT" ? "+" : "-"}₦
                                            {Number(tx.amount).toLocaleString()}
                                        </p>

                                        <span
                                            className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold capitalize ${tx.status.toLowerCase() === "success"
                                                    ? "bg-green-100 text-green-700"
                                                    : tx.status.toLowerCase() === "pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {tx.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-end text-xs font-medium text-green-600">
                                    View Receipt
                                    <ChevronRight size={14} />
                                </div>
                            </motion.button>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}