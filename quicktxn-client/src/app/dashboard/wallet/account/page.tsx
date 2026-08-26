"use client";

import { useEffect, useState } from "react";
import { Copy, Landmark, RefreshCw } from "lucide-react";
import api from "@/lib/api";

interface VirtualAccount {
    bank_name: string;
    account_name: string;
    account_number: string;
}

export default function VirtualAccountPage() {
    const [account, setAccount] = useState<VirtualAccount | null>(null);

    const loadAccount = async () => {
        const res = await api.get("/wallet/virtual-account");
        setAccount(res.data.data);
    };

    useEffect(() => {
        loadAccount();
    }, []);

    const copy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Account number copied");
    };

    if (!account) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center">
                Loading account...
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-xl space-y-8 p-6">

            <div>
                <h1 className="text-3xl font-bold">
                    Virtual Account
                </h1>
                <p className="mt-2 text-slate-500">
                    Fund your wallet using bank transfer.
                </p>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-500 p-8 text-white shadow-xl">

                <div className="mb-6 flex items-center gap-3">
                    <Landmark size={28} />
                    <span className="text-lg font-semibold">
                        {account.bank_name}
                    </span>
                </div>

                <h2 className="text-4xl font-bold tracking-wider">
                    {account.account_number}
                </h2>

                <p className="mt-4 text-green-100">
                    {account.account_name}
                </p>

                <button
                    onClick={() => copy(account.account_number)}
                    className="mt-6 flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-green-700"
                >
                    <Copy size={18} />
                    Copy Account Number
                </button>

            </div>

            <div className="rounded-2xl bg-white p-5 shadow">

                <div className="flex items-center gap-2">
                    <RefreshCw
                        className="text-green-600"
                        size={18}
                    />
                    <h3 className="font-bold">
                        Funding Information
                    </h3>
                </div>

                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    <li>
                        • Transfer to this account from any Nigerian bank.
                    </li>
                    <li>
                        • Wallet is credited automatically.
                    </li>
                    <li>
                        • No need to upload payment receipt.
                    </li>
                    <li>
                        • Available 24/7.
                    </li>
                </ul>

            </div>

        </main>
    );
}