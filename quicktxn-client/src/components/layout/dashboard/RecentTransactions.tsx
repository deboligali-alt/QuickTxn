"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Transaction {
    id: string;
    type: "CREDIT" | "DEBIT";
    amount: number;
    description: string;
    status: "SUCCESS" | "FAILED" | "PENDING";
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

    const getStatusStyle = (status: string) => {
        switch (status?.toUpperCase()) {
            case "SUCCESS":
                return {
                    badge: "bg-green-100 text-green-700",
                    amount: "text-green-600",
                };
            case "FAILED":
                return {
                    badge: "bg-red-100 text-red-700",
                    amount: "text-red-600",
                };
            default:
                return {
                    badge: "bg-orange-100 text-orange-700",
                    amount: "text-orange-600",
                };
        }
    };

    return (
        <section className="mt-6">
            <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold">
                    Recent Transactions
                </h2>

                {transactions.length > 4 && (
                    <button
                        onClick={() => router.push("/transactions")}
                        className="text-sm font-semibold text-green-600"
                    >
                        View More
                    </button>
                )}
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                {recent.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-500">
                        No transactions yet
                    </div>
                ) : (
                    recent.map((tx) => {
                        const style = getStatusStyle(tx.status);

                        return (
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
                                        <p className="text-sm font-semibold text-gray-800">
                                            {tx.description}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {new Date(tx.created_at).toLocaleDateString(
                                                "en-GB"
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p
                                        className={`text-sm font-bold ${style.amount}`}
                                    >
                                        {tx.type === "CREDIT" ? "+" : "-"}₦
                                        {Number(tx.amount).toLocaleString()}
                                    </p>

                                    <span
                                        className={`mt-1 inline-block rounded-full px-2 py-1 text-[10px] font-bold ${style.badge}`}
                                    >
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </section>
    );
}