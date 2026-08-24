"use client";

import Link from "next/link";
import {
    ArrowDownLeft,
    ArrowUpRight,
    CircleDollarSign,
    Database,
    Gamepad2,
    RefreshCcw,
    Smartphone,
    Wallet,
} from "lucide-react";

interface Transaction {
    id: string;
    type: string;
    amount: number;
    status: string;
    description: string;
    created_at: string;
}

interface Props {
    transactions: Transaction[];
}

const getTransactionInfo = (type: string) => {
    const normalizedType = type.toUpperCase();

    if (
        normalizedType.includes("BETTING")
    ) {
        return {
            title: "Betting Wallet Funding",
            icon: Gamepad2,
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            direction: "out",
        };
    }

    if (
        normalizedType.includes("AIRTIME_SWAP") ||
        normalizedType.includes("SWAP")
    ) {
        return {
            title: "Airtime Swap",
            icon: RefreshCcw,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            direction: "in",
        };
    }

    if (
        normalizedType.includes("AIRTIME")
    ) {
        return {
            title: "Airtime Purchase",
            icon: Smartphone,
            iconBg: "bg-orange-100",
            iconColor: "text-orange-600",
            direction: "out",
        };
    }

    if (
        normalizedType.includes("DATA")
    ) {
        return {
            title: "Data Purchase",
            icon: Database,
            iconBg: "bg-cyan-100",
            iconColor: "text-cyan-600",
            direction: "out",
        };
    }

    if (
        normalizedType.includes("WALLET") ||
        normalizedType.includes("FUNDING")
    ) {
        return {
            title: "Wallet Funding",
            icon: Wallet,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
            direction: "in",
        };
    }

    if (
        normalizedType.includes("TRANSFER")
    ) {
        return {
            title: "Transfer",
            icon: ArrowUpRight,
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
            direction: "out",
        };
    }

    return {
        title: "Transaction",
        icon: CircleDollarSign,
        iconBg: "bg-slate-100",
        iconColor: "text-slate-600",
        direction: "out",
    };
};

export default function RecentTransactions({
    transactions,
}: Props) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* HEADER */}

            <div className="mb-6 flex items-center justify-between">

                <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        Recent Transactions
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Your latest QuickTxn activities
                    </p>
                </div>

                <Link
                    href="/transactions"
                    className="rounded-xl bg-green-50 px-4 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-100"
                >
                    View All
                </Link>

            </div>

            {/* TRANSACTIONS */}

            <div className="space-y-3">

                {transactions.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">

                        <CircleDollarSign
                            size={32}
                            className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 font-medium text-slate-500">
                            No transactions yet.
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                            Your recent transactions will appear here.
                        </p>

                    </div>
                )}

                {transactions
                    .slice(0, 5)
                    .map((transaction) => {
                        const info =
                            getTransactionInfo(
                                transaction.type
                            );

                        const Icon = info.icon;

                        const isSuccess =
                            transaction.status.toUpperCase() ===
                            "SUCCESS";

                        const isPending =
                            transaction.status.toUpperCase() ===
                            "PENDING";

                        return (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 transition hover:border-green-100 hover:bg-slate-50"
                            >

                                {/* LEFT */}

                                <div className="flex min-w-0 items-center gap-4">

                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${info.iconBg}`}
                                    >
                                        <Icon
                                            size={21}
                                            className={
                                                info.iconColor
                                            }
                                        />
                                    </div>

                                    <div className="min-w-0">

                                        <h3 className="truncate font-semibold text-slate-900">
                                            {info.title}
                                        </h3>

                                        <p className="mt-1 truncate text-sm text-slate-500">
                                            {transaction.description ||
                                                transaction.type}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {new Date(
                                                transaction.created_at
                                            ).toLocaleString(
                                                "en-NG"
                                            )}
                                        </p>

                                    </div>

                                </div>

                                {/* RIGHT */}

                                <div className="ml-4 shrink-0 text-right">

                                    <p
                                        className={`font-bold ${info.direction ===
                                                "in"
                                                ? "text-green-600"
                                                : "text-slate-900"
                                            }`}
                                    >
                                        {info.direction ===
                                            "in"
                                            ? "+"
                                            : "-"}
                                        ₦
                                        {Number(
                                            transaction.amount
                                        ).toLocaleString(
                                            "en-NG"
                                        )}
                                    </p>

                                    <span
                                        className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${isSuccess
                                                ? "bg-green-100 text-green-700"
                                                : isPending
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {transaction.status}
                                    </span>

                                </div>

                            </div>
                        );
                    })}

            </div>

        </div>
    );
}