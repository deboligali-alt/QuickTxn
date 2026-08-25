"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Transaction {
    id: string;
    type: string;
    amount: number;
    status: string;
    createdAt: string;
}

interface Props {
    transactions: Transaction[];
}

export default function RecentTransactions({
    transactions,
}: Props) {
    const router = useRouter();

    return (
        <section className="mt-6 px-4">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                    Recent Transactions
                </h2>

                <button
                    onClick={() => router.push("/transactions")}
                    className="text-sm font-semibold text-green-600"
                >
                    View all
                </button>
            </div>

            {transactions.length === 0 ? (
                <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
                    <p className="text-gray-500">
                        No transactions yet
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {transactions.slice(0, 5).map((tx) => (
                        <button
                            key={tx.id}
                            onClick={() =>
                                router.push(`/transactions/${tx.id}`)
                            }
                            className="flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-sm active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`rounded-full p-3 ${tx.amount > 0
                                            ? "bg-green-100"
                                            : "bg-red-100"
                                        }`}
                                >
                                    {tx.amount > 0 ? (
                                        <ArrowDownLeft
                                            size={18}
                                            className="text-green-600"
                                        />
                                    ) : (
                                        <ArrowUpRight
                                            size={18}
                                            className="text-red-600"
                                        />
                                    )}
                                </div>

                                <div className="text-left">
                                    <p className="font-medium text-gray-900">
                                        {tx.type}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {new Date(
                                            tx.createdAt
                                        ).toLocaleDateString("en-NG", {
                                            day: "numeric",
                                            month: "short",
                                        })}
                                    </p>
                                </div>
                            </div>

                            <span
                                className={`font-bold ${tx.amount > 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                            >
                                {tx.amount > 0 ? "+" : "-"}₦
                                {Math.abs(tx.amount).toLocaleString()}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}