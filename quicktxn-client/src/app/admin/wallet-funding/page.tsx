"use client";

import { useEffect, useState } from "react";
import {
    CheckCircle2,
    XCircle,
    RefreshCw,
    Wallet,
} from "lucide-react";
import api from "@/lib/axios";

interface Funding {
    id: string;
    full_name: string;
    amount: number;
    bank_name: string;
    account_name: string;
    reference: string;
    status: string;
    created_at: string;
}

export default function WalletFundingPage() {
    const [fundings, setFundings] = useState<Funding[]>([]);
    const [loading, setLoading] = useState(true);

    const loadFundings = async () => {
        try {
            const res = await api.get("/admin/wallet-funding");
            setFundings(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFundings();
    }, []);

    const approve = async (id: string) => {
        try {
            await api.patch(`/admin/wallet-funding/${id}/approve`);
            loadFundings();
        } catch {
            alert("Approval failed");
        }
    };

    const reject = async (id: string) => {
        try {
            await api.patch(`/admin/wallet-funding/${id}/reject`);
            loadFundings();
        } catch {
            alert("Rejection failed");
        }
    };

    return (
        <main className="mx-auto max-w-7xl space-y-8 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold">
                        Wallet Funding
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Approve manual bank deposits.
                    </p>
                </div>

                <button
                    onClick={loadFundings}
                    className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-white"
                >
                    <RefreshCw size={18} />
                    Refresh
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
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="py-10 text-center"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : (
                            fundings.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b hover:bg-slate-50"
                                >
                                    <td className="px-5 py-5">
                                        <div>
                                            <p className="font-semibold">
                                                {item.full_name}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {item.reference}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-5 py-5">
                                        <div>
                                            <p>{item.bank_name}</p>
                                            <p className="text-sm text-slate-500">
                                                {item.account_name}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-5 py-5 font-bold text-green-600">
                                        ₦{Number(item.amount).toLocaleString()}
                                    </td>

                                    <td className="px-5 py-5">
                                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                                            {item.status}
                                        </span>
                                    </td>

                                    <td className="px-5 py-5">
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
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}