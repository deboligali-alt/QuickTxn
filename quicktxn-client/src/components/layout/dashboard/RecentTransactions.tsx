"use client";

import {
    ArrowDownLeft,
    ArrowUpRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Transaction {
    id: string;
    type: "CREDIT" | "DEBIT";
    amount: number;
    description: string;
    status: string;
    created_at: string;
}

export default function RecentTransactions({
    transactions,
}: {
    transactions: Transaction[];
}) {
    const router = useRouter();

    const recent = transactions.slice(0, 5);

    return (
        <section className="mt-8">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                    Recent Transactions
                </h2>

                <button
                    onClick={() => router.push("/transactions")}
                    className="text-sm font-semibold text-green-600"
                >
                    See all
                </button>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 lg:hidden">
                {recent.map((tx) => (
                    <div
                        key={tx.id}
                        className="rounded-2xl bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`rounded-full p-3 ${tx.type === "CREDIT"
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
                                    <p className="font-semibold">
                                        {tx.description}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {new Date(
                                            tx.created_at
                                        ).toLocaleDateString("en-NG")}
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
                    </div>
                ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-3xl bg-white shadow-sm lg:block">
                <table className="w-full">
                    <thead className="bg-gray-50 text-left text-sm text-gray-500">
                        <tr>
                            <th className="px-6 py-4">Transaction</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">
                                Amount
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {recent.map((tx) => (
                            <tr
                                key={tx.id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`rounded-full p-2 ${tx.type === "CREDIT"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-red-100 text-red-600"
                                                }`}
                                        >
                                            {tx.type === "CREDIT" ? (
                                                <ArrowDownLeft size={16} />
                                            ) : (
                                                <ArrowUpRight size={16} />
                                            )}
                                        </div>

                                        <span className="font-medium">
                                            {tx.description}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(
                                        tx.created_at
                                    ).toLocaleDateString("en-NG")}
                                </td>

                                <td className="px-6 py-4">
                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                        {tx.status}
                                    </span>
                                </td>

                                <td
                                    className={`px-6 py-4 text-right font-bold ${tx.type === "CREDIT"
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`}
                                >
                                    {tx.type === "CREDIT" ? "+" : "-"}₦
                                    {Number(tx.amount).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}