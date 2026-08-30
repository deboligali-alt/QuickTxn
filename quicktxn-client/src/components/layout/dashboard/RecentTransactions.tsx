"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Transaction {
    id: string;
    type: "CREDIT" | "DEBIT";
    amount: number;
    description: string;
    status: string;
    created_at: string;
}

interface Props {
    transactions: Transaction[];
}

export default function RecentTransactions({
    transactions,
}: Props) {
    const router = useRouter();

    const recent = transactions.slice(0, 4);

    return (
        <section className="mt-6">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold">Recent Transactions</h2>

                <button
                    onClick={() => router.push("/transactions")}
                    className="text-sm font-semibold text-green-600"
                >
                    View More
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                {recent.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-500">
                        No transactions yet
                    </div>
                ) : (
                    recent.map((tx) => (
                        <div
                            key={tx.id}
                            className="flex items-center justify-between border-b px-4 py-3 last:border-0"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full ${tx.type === "CREDIT"
                                            ? "bg-green-100 text-green-600"
                                            : "bg-red-100 text-red-600"
                                        }`}
                                >
                                    {tx.type === "CREDIT" ? (
                                        <ArrowDownLeft size={18} />
                                    ) : (
                                        <ArrowUpRight size={18} />
                                    )}
                                </div>

                                <div>
                                    <p className="text-sm font-semibold">
                                        {tx.description}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(tx.created_at).toLocaleDateString("en-GB")}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p
                                    className={`text-sm font-bold ${tx.type === "CREDIT"
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`}
                                >
                                    {tx.type === "CREDIT" ? "+" : "-"}₦
                                    {Number(tx.amount).toLocaleString()}
                                </p>

                                <p className="text-[11px] capitalize text-gray-500">
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