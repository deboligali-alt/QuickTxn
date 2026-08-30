"use client";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    Tooltip,
} from "recharts";

interface Transaction {
    id: string;
    amount: number;
    type: "CREDIT" | "DEBIT";
    created_at: string;
}

export default function AnalyticsCard({
    transactions,
}: {
    transactions: Transaction[];
}) {
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));

        const label = d.toLocaleDateString("en-GB", {
            weekday: "short",
        });

        const dayKey = d.toISOString().slice(0, 10);

        const income = transactions
            .filter(
                (t) =>
                    t.type === "CREDIT" &&
                    t.created_at.slice(0, 10) === dayKey
            )
            .reduce((a, b) => a + Number(b.amount), 0);

        const expense = transactions
            .filter(
                (t) =>
                    t.type === "DEBIT" &&
                    t.created_at.slice(0, 10) === dayKey
            )
            .reduce((a, b) => a + Number(b.amount), 0);

        return { day: label, income, expense };
    });

    const totalIncome = transactions
        .filter((t) => t.type === "CREDIT")
        .reduce((a, b) => a + Number(b.amount), 0);

    const totalExpense = transactions
        .filter((t) => t.type === "DEBIT")
        .reduce((a, b) => a + Number(b.amount), 0);

    const net = totalIncome - totalExpense;

    return (
        <section className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-5">
                <h2 className="text-lg font-bold text-gray-900">
                    Analytics
                </h2>
                <p className="text-sm text-gray-500">
                    Last 7 days activity
                </p>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-green-50 p-3">
                    <p className="text-xs text-gray-500">Income</p>
                    <h3 className="mt-1 text-lg font-bold text-green-600">
                        ₦{totalIncome.toLocaleString()}
                    </h3>
                </div>

                <div className="rounded-xl bg-red-50 p-3">
                    <p className="text-xs text-gray-500">Expenses</p>
                    <h3 className="mt-1 text-lg font-bold text-red-600">
                        ₦{totalExpense.toLocaleString()}
                    </h3>
                </div>

                <div className="rounded-xl bg-blue-50 p-3">
                    <p className="text-xs text-gray-500">Transactions</p>
                    <h3 className="mt-1 text-lg font-bold text-blue-600">
                        {transactions.length}
                    </h3>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3">
                    <p className="text-xs text-gray-500">Net</p>
                    <h3 className="mt-1 text-lg font-bold text-emerald-600">
                        ₦{net.toLocaleString()}
                    </h3>
                </div>
            </div>

            <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={last7Days}>
                        <XAxis
                            dataKey="day"
                            tick={{ fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip />

                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke="#16a34a"
                            fill="#bbf7d0"
                            strokeWidth={2}
                        />

                        <Area
                            type="monotone"
                            dataKey="expense"
                            stroke="#dc2626"
                            fill="#fecaca"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}