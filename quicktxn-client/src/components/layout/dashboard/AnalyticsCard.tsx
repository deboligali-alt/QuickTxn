"use client";

interface Transaction {
    type: "CREDIT" | "DEBIT";
    amount: number;
}

interface Props {
    transactions: Transaction[];
}

export default function AnalyticsCard({ transactions }: Props) {
    const income = transactions
        .filter((t) => t.type === "CREDIT")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
        .filter((t) => t.type === "DEBIT")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const total = income + expense || 1;

    const incomeHeight = (income / total) * 140;
    const expenseHeight = (expense / total) * 140;

    return (
        <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">
                        Analytics
                    </h3>
                    <p className="text-sm text-gray-500">
                        Income vs Expenses
                    </p>
                </div>
            </div>

            <div className="flex h-44 items-end justify-center gap-12">
                <div className="flex flex-col items-center">
                    <div className="flex h-36 items-end">
                        <div
                            className="w-14 rounded-t-xl bg-green-500 transition-all"
                            style={{ height: `${incomeHeight}px` }}
                        />
                    </div>

                    <p className="mt-2 text-sm font-semibold">Income</p>
                    <span className="text-xs text-green-600">
                        ₦{income.toLocaleString()}
                    </span>
                </div>

                <div className="flex flex-col items-center">
                    <div className="flex h-36 items-end">
                        <div
                            className="w-14 rounded-t-xl bg-red-500 transition-all"
                            style={{ height: `${expenseHeight}px` }}
                        />
                    </div>

                    <p className="mt-2 text-sm font-semibold">Expense</p>
                    <span className="text-xs text-red-600">
                        ₦{expense.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
}