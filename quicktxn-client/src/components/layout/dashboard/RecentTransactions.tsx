"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Transaction {
    id: string;
    type: "CREDIT" | "DEBIT";
    amount: number;
    description: string;
    created_at: string;
    status: string;
}

interface Props {
    transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: Props) {
    const router = useRouter();

    return (
        <section className="mt-6">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                    Recent Transactions
                </h2>

                <button
                    onClick={() => router.push("/history")}
                    className="text-sm font-semibold text-green-600"
                >
                    See all
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                {transactions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No transactions yet
                    </div>
                ) : (
                    transactions.map((tx) => (
                        <div
                            key={tx.id}
                            className="flex items-center justify-between border-b p-4 last:border-0"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div
                                    className={`flex h-11 w-11 items-center justify-center rounded-full ${tx.type === "CREDIT"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-red-100 text-red-600"
                                        }`}
                                >
                                    {tx.type === "CREDIT" ? (
                                        <ArrowDownLeft size={20} />
                                    ) : (
                                        <ArrowUpRight size={20} />
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-gray-900">
                                        {tx.description}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {new Date(tx.created_at).toLocaleDateString("en-NG", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
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

                                <p className="text-xs text-gray-500">
                                    {tx.status}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}