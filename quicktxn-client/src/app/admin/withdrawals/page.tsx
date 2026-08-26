"use client";

import { useEffect, useState } from "react";
import {
    CheckCircle2,
    XCircle,
    RefreshCw,
    Landmark,
} from "lucide-react";
import api from "@/lib/api";

interface Withdrawal {
    id: string;
    full_name: string;
    bank_name: string;
    account_name: string;
    account_number: string;
    amount: number;
    status: string;
    created_at: string;
}

export default function WithdrawalsPage() {
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

    const loadWithdrawals = async () => {
        const res = await api.get("/admin/withdrawals");
        setWithdrawals(res.data.data || []);
    };

    useEffect(() => {
        loadWithdrawals();
    }, []);

    const approve = async (id: string) => {
        await api.patch(`/admin/withdrawals/${id}/approve`);
        loadWithdrawals();
    };

    const reject = async (id: string) => {
        await api.patch(`/admin/withdrawals/${id}/reject`);
        loadWithdrawals();
    };

    return (
        <main className="mx-auto max-w-7xl space-y-8 p-8">

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-4xl font-bold">
                        Withdrawal Requests
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Approve or reject user withdrawals.
                    </p>
                </div>

                <button
                    onClick={loadWithdrawals}
                    className="rounded-xl bg-green-600 p-3 text-white"
                >
                    <RefreshCw size={20} />
                </button>

            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow">

                <table className="min-w-full">

                    <thead className="bg-slate-100">
                        <tr>
                            <th className="px-5 py-4 text-left">
                                Customer
                            </th>
                            <th className="px-5 py-4 text-left">
                                Bank
                            </th>
                            <th className="px-5 py-4 text-left">
                                Amount
                            </th>
                            <th className="px-5 py-4 text-left">
                                Status
                            </th>
                            <th className="px-5 py-4 text-left">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>

                        {withdrawals.map((item) => (

                            <tr
                                key={item.id}
                                className="border-b hover:bg-slate-50"
                            >

                                <td className="px-5 py-5">

                                    <p className="font-semibold">
                                        {item.full_name}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {new Date(
                                            item.created_at
                                        ).toLocaleString("en-NG")}
                                    </p>

                                </td>

                                <td className="px-5 py-5">

                                    <p>{item.bank_name}</p>

                                    <p className="text-sm text-slate-500">
                                        {item.account_name}
                                    </p>

                                    <p className="text-sm font-medium">
                                        {item.account_number}
                                    </p>

                                </td>

                                <td className="px-5 py-5 font-bold text-green-600">
                                    ₦{Number(item.amount).toLocaleString()}
                                </td>

                                <td className="px-5 py-5">

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "APPROVED"
                                                ? "bg-green-100 text-green-700"
                                                : item.status === "REJECTED"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {item.status}
                                    </span>

                                </td>

                                <td className="px-5 py-5">

                                    {item.status === "PENDING" ? (

                                        <div className="flex gap-2">

                                            <button
                                                onClick={() => approve(item.id)}
                                                className="rounded-lg bg-green-600 p-2 text-white"
                                            >
                                                <CheckCircle2 size={18} />
                                            </button>

                                            <button
                                                onClick={() => reject(item.id)}
                                                className="rounded-lg bg-red-600 p-2 text-white"
                                            >
                                                <XCircle size={18} />
                                            </button>

                                        </div>

                                    ) : (

                                        <Landmark
                                            className="text-slate-400"
                                            size={18}
                                        />

                                    )}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </main>
    );
}