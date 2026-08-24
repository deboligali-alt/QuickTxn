"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
    ArrowDownLeft,
    ArrowLeft,
    ArrowUpRight,
    CheckCircle2,
    Clock3,
    Filter,
    History,
    Search,
    XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { getTransactions } from "@/services/dashboard.service";

interface Transaction {
    id: string;
    amount: number;
    type: string;
    status: string;
    description: string;
    created_at: string;
}

export default function TransactionsPage() {
    const router = useRouter();

    const [transactions, setTransactions] =
        useState<Transaction[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [typeFilter, setTypeFilter] =
        useState("all");

    const loadTransactions = useCallback(
        async () => {
            try {
                setLoading(true);

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    router.replace("/login");
                    return;
                }

                const response =
                    await getTransactions(token);

                setTransactions(
                    response.transactions || []
                );
            } catch (error) {
                console.error(error);

                if (
                    axios.isAxiosError(error)
                ) {
                    toast.error(
                        error.response?.data
                            ?.message ||
                        "Unable to load transactions."
                    );
                } else {
                    toast.error(
                        "Unable to load transactions."
                    );
                }
            } finally {
                setLoading(false);
            }
        },
        [router]
    );

    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);

    const filteredTransactions =
        useMemo(() => {
            return transactions.filter(
                (transaction) => {
                    const searchText =
                        search
                            .toLowerCase()
                            .trim();

                    const matchesSearch =
                        !searchText ||
                        transaction.description
                            ?.toLowerCase()
                            .includes(searchText) ||
                        transaction.type
                            ?.toLowerCase()
                            .includes(searchText) ||
                        transaction.status
                            ?.toLowerCase()
                            .includes(searchText) ||
                        String(
                            transaction.amount
                        ).includes(searchText);

                    const matchesStatus =
                        statusFilter === "all" ||
                        transaction.status
                            ?.toLowerCase() ===
                        statusFilter;

                    const matchesType =
                        typeFilter === "all" ||
                        transaction.type
                            ?.toLowerCase() ===
                        typeFilter;

                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesType
                    );
                }
            );
        }, [
            transactions,
            search,
            statusFilter,
            typeFilter,
        ]);

    const formatAmount = (
        amount: number
    ) => {
        return `₦${Number(
            amount || 0
        ).toLocaleString("en-NG")}`;
    };

    const formatDate = (
        date: string
    ) => {
        if (!date) return "Unknown date";

        return new Date(date).toLocaleString(
            "en-NG",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    const normalizeStatus = (
        status: string
    ) => {
        return status
            ?.toLowerCase()
            .replace(/[_-]/g, " ");
    };

    const isCredit = (
        transaction: Transaction
    ) => {
        const type =
            transaction.type?.toLowerCase();

        return (
            type.includes("credit") ||
            type.includes("fund") ||
            type.includes("deposit") ||
            type.includes("receive")
        );
    };

    const getStatus = (
        status: string
    ) => {
        const normalized =
            normalizeStatus(status);

        if (
            normalized.includes("success") ||
            normalized.includes("completed")
        ) {
            return {
                label: "Successful",
                className:
                    "bg-green-100 text-green-700",
                icon: CheckCircle2,
            };
        }

        if (
            normalized.includes("pending") ||
            normalized.includes("processing")
        ) {
            return {
                label: "Pending",
                className:
                    "bg-yellow-100 text-yellow-700",
                icon: Clock3,
            };
        }

        return {
            label: "Failed",
            className:
                "bg-red-100 text-red-700",
            icon: XCircle,
        };
    };

    const getTypeLabel = (
        type: string
    ) => {
        if (!type) return "Transaction";

        return type
            .replace(/[_-]/g, " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    const successfulCount =
        transactions.filter((item) => {
            const status =
                normalizeStatus(
                    item.status
                );

            return (
                status.includes("success") ||
                status.includes("completed")
            );
        }).length;

    const pendingCount =
        transactions.filter((item) => {
            const status =
                normalizeStatus(
                    item.status
                );

            return (
                status.includes("pending") ||
                status.includes("processing")
            );
        }).length;

    const failedCount =
        transactions.filter((item) => {
            const status =
                normalizeStatus(
                    item.status
                );

            return (
                status.includes("failed") ||
                status.includes("cancel")
            );
        }).length;

    return (
        <main className="min-h-full bg-slate-50">

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

                {/* BACK */}

                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-green-600"
                >
                    <ArrowLeft size={17} />
                    Back
                </button>

                {/* HEADER */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center"
                >
                    <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                            <History size={28} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                                Transactions
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 sm:text-base">
                                View and track all your
                                QuickTxn transactions.
                            </p>
                        </div>

                    </div>
                </motion.div>

                {/* STATS */}

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-slate-500">
                                    Total Transactions
                                </p>

                                <p className="mt-2 text-2xl font-extrabold text-slate-900">
                                    {transactions.length}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <History size={21} />
                            </div>

                        </div>

                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-slate-500">
                                    Successful
                                </p>

                                <p className="mt-2 text-2xl font-extrabold text-green-600">
                                    {successfulCount}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                <CheckCircle2 size={21} />
                            </div>

                        </div>

                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-slate-500">
                                    Pending
                                </p>

                                <p className="mt-2 text-2xl font-extrabold text-yellow-600">
                                    {pendingCount}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600">
                                <Clock3 size={21} />
                            </div>

                        </div>

                    </div>

                </div>

                {/* FILTERS */}

                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                    <div className="flex flex-col gap-4 lg:flex-row">

                        {/* SEARCH */}

                        <div className="relative flex-1">

                            <Search
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                            />

                        </div>

                        {/* STATUS */}

                        <div className="relative">

                            <Filter
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                                className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-10 outline-none transition focus:border-green-600 sm:w-52"
                            >
                                <option value="all">
                                    All Status
                                </option>

                                <option value="successful">
                                    Successful
                                </option>

                                <option value="completed">
                                    Completed
                                </option>

                                <option value="pending">
                                    Pending
                                </option>

                                <option value="failed">
                                    Failed
                                </option>
                            </select>

                        </div>

                        {/* TYPE */}

                        <div>

                            <select
                                value={typeFilter}
                                onChange={(e) =>
                                    setTypeFilter(
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-300 bg-white py-3 px-4 outline-none transition focus:border-green-600 sm:w-52"
                            >
                                <option value="all">
                                    All Types
                                </option>

                                <option value="credit">
                                    Credit
                                </option>

                                <option value="debit">
                                    Debit
                                </option>

                                <option value="airtime">
                                    Airtime
                                </option>

                                <option value="data">
                                    Data
                                </option>

                                <option value="transfer">
                                    Transfer
                                </option>

                                <option value="bank transfer">
                                    Bank Transfer
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

                {/* TRANSACTIONS */}

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                    {/* DESKTOP HEADER */}

                    <div className="hidden border-b border-slate-200 bg-slate-50 px-6 py-4 lg:grid lg:grid-cols-12 lg:gap-4">

                        <div className="col-span-5 text-xs font-bold uppercase tracking-wide text-slate-500">
                            Transaction
                        </div>

                        <div className="col-span-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                            Amount
                        </div>

                        <div className="col-span-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                            Status
                        </div>

                        <div className="col-span-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                            Date
                        </div>

                    </div>

                    {/* LOADING */}

                    {loading ? (
                        <div className="space-y-4 p-6">

                            {[1, 2, 3, 4].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="animate-pulse rounded-2xl bg-slate-100 p-5"
                                    >
                                        <div className="h-5 w-1/3 rounded bg-slate-200" />

                                        <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />

                                        <div className="mt-3 h-4 w-1/4 rounded bg-slate-200" />
                                    </div>
                                )
                            )}

                        </div>
                    ) : filteredTransactions.length ===
                        0 ? (
                        <div className="px-6 py-16 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <History size={28} />
                            </div>

                            <h2 className="mt-5 text-lg font-bold text-slate-900">
                                No transactions found
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                {search ||
                                    statusFilter !==
                                    "all" ||
                                    typeFilter !==
                                    "all"
                                    ? "Try changing your search or filters."
                                    : "Your transactions will appear here once you start using QuickTxn."}
                            </p>

                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">

                            {filteredTransactions.map(
                                (
                                    transaction
                                ) => {
                                    const credit =
                                        isCredit(
                                            transaction
                                        );

                                    const status =
                                        getStatus(
                                            transaction.status
                                        );

                                    const StatusIcon =
                                        status.icon;

                                    return (
                                        <motion.div
                                            key={
                                                transaction.id
                                            }
                                            initial={{
                                                opacity: 0,
                                            }}
                                            animate={{
                                                opacity: 1,
                                            }}
                                            className="px-5 py-5 transition hover:bg-slate-50 sm:px-6"
                                        >

                                            {/* DESKTOP */}

                                            <div className="hidden lg:grid lg:grid-cols-12 lg:items-center lg:gap-4">

                                                <div className="col-span-5 flex items-center gap-4">

                                                    <div
                                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${credit
                                                                ? "bg-green-100 text-green-600"
                                                                : "bg-red-100 text-red-600"
                                                            }`}
                                                    >
                                                        {credit ? (
                                                            <ArrowDownLeft
                                                                size={
                                                                    21
                                                                }
                                                            />
                                                        ) : (
                                                            <ArrowUpRight
                                                                size={
                                                                    21
                                                                }
                                                            />
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">

                                                        <p className="truncate font-bold text-slate-900">
                                                            {transaction.description ||
                                                                getTypeLabel(
                                                                    transaction.type
                                                                )}
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            {getTypeLabel(
                                                                transaction.type
                                                            )}
                                                        </p>

                                                    </div>

                                                </div>

                                                <div className="col-span-2">

                                                    <p
                                                        className={`font-bold ${credit
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                            }`}
                                                    >
                                                        {credit
                                                            ? "+"
                                                            : "-"}
                                                        {formatAmount(
                                                            transaction.amount
                                                        )}
                                                    </p>

                                                </div>

                                                <div className="col-span-2">

                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                                                    >
                                                        <StatusIcon
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        {
                                                            status.label
                                                        }
                                                    </span>

                                                </div>

                                                <div className="col-span-3 text-right">

                                                    <p className="text-sm font-medium text-slate-700">
                                                        {formatDate(
                                                            transaction.created_at
                                                        )}
                                                    </p>

                                                </div>

                                            </div>

                                            {/* MOBILE */}

                                            <div className="lg:hidden">

                                                <div className="flex items-start justify-between gap-4">

                                                    <div className="flex min-w-0 items-center gap-3">

                                                        <div
                                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${credit
                                                                    ? "bg-green-100 text-green-600"
                                                                    : "bg-red-100 text-red-600"
                                                                }`}
                                                        >
                                                            {credit ? (
                                                                <ArrowDownLeft
                                                                    size={
                                                                        21
                                                                    }
                                                                />
                                                            ) : (
                                                                <ArrowUpRight
                                                                    size={
                                                                        21
                                                                    }
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="min-w-0">

                                                            <p className="truncate font-bold text-slate-900">
                                                                {transaction.description ||
                                                                    getTypeLabel(
                                                                        transaction.type
                                                                    )}
                                                            </p>

                                                            <p className="mt-1 text-xs text-slate-500">
                                                                {getTypeLabel(
                                                                    transaction.type
                                                                )}
                                                            </p>

                                                        </div>

                                                    </div>

                                                    <p
                                                        className={`shrink-0 font-bold ${credit
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                            }`}
                                                    >
                                                        {credit
                                                            ? "+"
                                                            : "-"}
                                                        {formatAmount(
                                                            transaction.amount
                                                        )}
                                                    </p>

                                                </div>

                                                <div className="mt-4 flex items-center justify-between gap-3">

                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                                                    >
                                                        <StatusIcon
                                                            size={
                                                                14
                                                            }
                                                        />

                                                        {
                                                            status.label
                                                        }
                                                    </span>

                                                    <span className="text-xs text-slate-400">
                                                        {formatDate(
                                                            transaction.created_at
                                                        )}
                                                    </span>

                                                </div>

                                            </div>

                                        </motion.div>
                                    );
                                }
                            )}

                        </div>
                    )}

                </div>

                {/* FOOTER */}

                {!loading &&
                    filteredTransactions.length >
                    0 && (
                        <div className="mt-4 flex flex-col justify-between gap-2 text-sm text-slate-500 sm:flex-row sm:items-center">

                            <p>
                                Showing{" "}
                                <span className="font-semibold text-slate-700">
                                    {
                                        filteredTransactions.length
                                    }
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-slate-700">
                                    {
                                        transactions.length
                                    }
                                </span>{" "}
                                transactions
                            </p>

                            <p className="text-xs">
                                {failedCount} failed
                                transaction
                                {failedCount ===
                                    1
                                    ? ""
                                    : "s"}
                            </p>

                        </div>
                    )}

            </div>

        </main>
    );
}