"use client";

import { useState } from "react";
import axios from "axios";
import { Wallet } from "lucide-react";

const quickAmounts = [500, 1000, 2000, 5000];

export default function FundWalletPage() {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFund = async () => {
        if (!amount || Number(amount) < 100) {
            alert("Minimum funding is ₦100");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/wallet/fund`,
                { amount: Number(amount) },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            window.location.href = res.data.data.authorization_url;
        } catch (error) {
            console.error(error);
            alert("Unable to initialize payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4 pb-24">
            <h1 className="mb-6 text-2xl font-bold">
                Fund Wallet
            </h1>

            <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-600 p-6 text-white">
                <div className="flex items-center gap-3">
                    <Wallet size={28} />

                    <div>
                        <p className="text-green-100 text-sm">
                            QuickTxn Wallet
                        </p>

                        <h2 className="text-xl font-bold">
                            Add Money Securely
                        </h2>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Enter Amount
                </label>

                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="₦0"
                    className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-3xl font-bold outline-none focus:border-green-500"
                />
            </div>

            <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-gray-700">
                    Quick Select
                </p>

                <div className="grid grid-cols-2 gap-3">
                    {quickAmounts.map((value) => (
                        <button
                            key={value}
                            onClick={() => setAmount(String(value))}
                            className="rounded-2xl border border-green-200 bg-white py-4 font-semibold text-green-700 transition active:scale-95"
                        >
                            ₦{value.toLocaleString()}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={handleFund}
                disabled={loading}
                className="mt-8 w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
            >
                {loading ? "Processing..." : "Continue to Paystack"}
            </button>
        </main>
    );
}