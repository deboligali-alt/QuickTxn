"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Trophy } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";

interface Provider {
    provider_name: string;
    provider_code: string;
}

// Static logos
const logos: Record<string, string> = {
    SPORTYBET: "/betting/sportybet.png",
    BET9JA: "/betting/bet9ja.png",
    BETKING: "/betting/betking.png",
    "1XBET": "/betting/1xbet.png",
    NAIRABET: "/betting/nairabet.png",
};

export default function BettingPage() {
    const [providers, setProviders] = useState<Provider[]>([]);
    const [providerCode, setProviderCode] = useState("");
    const [bettingUserId, setBettingUserId] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const loadProviders = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/betting/providers`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setProviders(res.data.data);

                if (res.data.data.length > 0) {
                    setProviderCode(res.data.data[0].provider_code);
                }
            } catch (error) {
                console.error(error);
            }
        };

        loadProviders();
    }, []);

    const verifyCustomer = async () => {
        if (!bettingUserId) return alert("Enter Betting User ID");

        try {
            const token = localStorage.getItem("token");

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/betting/verify`,
                {
                    company: providerCode,
                    customerId: bettingUserId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCustomerName(res.data.data.name);
        } catch (error: any) {
            setCustomerName("");
            alert(error.response?.data?.message || "Customer not found");
        }
    };

    const fundWallet = async () => {
        if (!customerName) {
            return alert("Verify customer first");
        }

        if (!amount || !pin) {
            return alert("Enter amount and PIN");
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/betting/fund`,
                {
                    providerCode,
                    bettingUserId,
                    amount: Number(amount),
                    pin,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            sessionStorage.setItem("payment_success", "true");
            window.location.href = "/dashboard";
        } catch (error: any) {
            alert(error.response?.data?.message || "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 pb-24">
            <PageHeader name="Betting Wallet" />

            <div className="p-4">
                <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-600 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <Trophy size={28} />
                        <div>
                            <p className="text-sm text-green-100">
                                Instant Betting Top-up
                            </p>
                            <h2 className="text-xl font-bold">
                                Fund Betting Wallet
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Betting Company
                        </label>

                        <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white p-3">
                            <Image
                                src={logos[providerCode]}
                                alt={providerCode}
                                width={48}
                                height={48}
                                className="rounded-xl"
                            />

                            <div>
                                <p className="text-xs text-gray-500">Selected</p>
                                <p className="font-semibold">
                                    {providers.find(
                                        (p) => p.provider_code === providerCode
                                    )?.provider_name}
                                </p>
                            </div>
                        </div>

                        <select
                            value={providerCode}
                            onChange={(e) => setProviderCode(e.target.value)}
                            className="w-full rounded-2xl border bg-white p-4"
                        >
                            {providers.map((provider) => (
                                <option
                                    key={provider.provider_code}
                                    value={provider.provider_code}
                                >
                                    {provider.provider_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Betting User ID
                        </label>

                        <div className="flex gap-2">
                            <input
                                value={bettingUserId}
                                onChange={(e) =>
                                    setBettingUserId(e.target.value)
                                }
                                placeholder="Enter User ID"
                                className="flex-1 rounded-2xl border bg-white p-4"
                            />

                            <button
                                onClick={verifyCustomer}
                                className="rounded-2xl bg-green-600 px-4 text-white"
                            >
                                Verify
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Customer Name
                        </label>

                        <input
                            readOnly
                            value={customerName}
                            placeholder="Verified customer name"
                            className="w-full rounded-2xl border bg-gray-100 p-4 font-semibold text-green-700"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Amount
                        </label>

                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="₦1000"
                            className="w-full rounded-2xl border bg-white p-4 text-2xl font-bold"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Transaction PIN
                        </label>

                        <input
                            type="password"
                            maxLength={4}
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="****"
                            className="w-full rounded-2xl border bg-white p-4 text-center text-xl tracking-[0.5em]"
                        />
                    </div>
                </div>

                <button
                    onClick={fundWallet}
                    disabled={loading}
                    className="mt-8 w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white disabled:opacity-60"
                >
                    {loading ? "Processing..." : "Pay from Wallet"}
                </button>
            </div>
        </main>
    );
}