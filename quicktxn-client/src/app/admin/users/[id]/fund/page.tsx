"use client";

import { useState } from "react";
import { ArrowLeft, Wallet } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { fundUserWallet } from "@/services/adminUser.service";

export default function FundWalletPage() {
    const router = useRouter();
    const { id } = useParams();

    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFund = async () => {
        if (!amount || Number(amount) <= 0) {
            alert("Enter a valid amount");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login again");
            return;
        }

        try {
            setLoading(true);

            await fundUserWallet(
                token,
                id as string,
                Number(amount)
            );

            alert("Wallet funded successfully!");

            router.push("/admin/users");
        } catch (error: any) {
            alert(
                error.response?.data?.message ||
                "Funding failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4">
            <button
                onClick={() => router.back()}
                className="mb-5 flex items-center gap-2 text-gray-600"
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-full bg-green-100 p-3">
                        <Wallet
                            size={28}
                            className="text-green-600"
                        />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold">
                            Fund Wallet
                        </h1>
                        <p className="text-sm text-gray-500">
                            Credit this user's wallet
                        </p>
                    </div>
                </div>

                <label className="mb-2 block text-sm font-medium">
                    Amount (₦)
                </label>

                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="5000"
                    className="w-full rounded-2xl border p-4 text-2xl font-bold outline-none focus:border-green-600"
                />

                <button
                    onClick={handleFund}
                    disabled={loading}
                    className="mt-6 w-full rounded-2xl bg-green-600 py-4 font-semibold text-white disabled:opacity-60"
                >
                    {loading ? "Funding..." : "Fund Wallet"}
                </button>
            </div>
        </main>
    );
}