
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, Trophy } from "lucide-react";

interface Provider {
    provider_name: string;
    provider_code: string;
}

const logos: Record<string, string> = {
    SPORTYBET: "/betting/sportybet.png",
    BET9JA: "/betting/bet9ja.png",
    BETKING: "/betting/betking.png",
    "1XBET": "/betting/1xbet.png",
    NAIRABET: "/betting/nairabet.png",
};

export default function BettingPage() {
    const router = useRouter();

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
                const res = await api.get("/betting/providers");
                setProviders(res.data.data || []);

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
        if (!bettingUserId) {
            return alert("Enter Betting User ID");
        }

        try {
            const res = await api.post("/betting/verify", {
                company: providerCode,
                customerId: bettingUserId,
            });

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

            await api.post("/betting/fund", {
                providerCode,
                bettingUserId,
                amount: Number(amount),
                pin,
            });

            sessionStorage.setItem("payment_success", "true");
            router.push("/dashboard");
        } catch (error: any) {
            alert(error.response?.data?.message || "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-md p-4 pb-24">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-4 flex items-center gap-2 text-gray-700"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {/* Header */}
                <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-600 p-5 text-white">
                    <div className="flex items-center gap-3">
                        <Trophy size={28} />
                        <div>
                            <p className="text-sm text-green-100">
                                Instant Betting Top-up
                            </p>
                            <h1 className="text-2xl font-bold">
                                Betting Wallet
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-lg font-bold">
                        Select Betting Company
                    </h2>

                    {/* Logo Grid */}
                    <div className="mb-6 grid grid-cols-3 gap-3">
                        {providers.map((provider) => (
                            <button
                                key={provider.provider_code}
                                onClick={() => {
                                    setProviderCode(provider.provider_code);
                                    setCustomerName("");
                                }}
                                className={`rounded-2xl border-2 p-3 transition ${providerCode === provider.provider_code
                                        ? "border-green-600 bg-green-50"
                                        : "border-gray-200 bg-white"
                                    }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <Image
                                        src={
                                            logos[provider.provider_code] ||
                                            "/betting/sportybet.png"
                                        }
                                        alt={provider.provider_name}
                                        width={40}
                                        height={40}
                                        className="rounded-lg object-contain"
                                    />
                                    <span className="text-[11px] font-semibold text-center">
                                        {provider.provider_name}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* User ID */}
                    <label className="mb-2 block text-sm font-medium">
                        Betting User ID
                    </label>

                    <div className="mb-4 flex gap-2">
                        <input
                            value={bettingUserId}
                            onChange={(e) => setBettingUserId(e.target.value)}
                            placeholder="Enter User ID"
                            className="flex-1 rounded-xl border p-3 outline-none focus:border-green-500"
                        />
                        <button
                            onClick={verifyCustomer}
                            className="rounded-xl bg-green-600 px-4 font-medium text-white"
                        >
                            Verify
                        </button>
                    </div>

                    {/* Customer Name */}
                    <label className="mb-2 block text-sm font-medium">
                        Customer Name
                    </label>

                    <input
                        readOnly
                        value={customerName}
                        placeholder="Verified customer name"
                        className="mb-4 w-full rounded-xl border bg-gray-100 p-3 font-semibold text-green-700"
                    />

                    {/* Amount */}
                    <label className="mb-2 block text-sm font-medium">
                        Amount
                    </label>

                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="₦1000"
                        className="mb-4 w-full rounded-xl border p-3 text-xl font-bold outline-none focus:border-green-500"
                    />

                    {/* PIN */}
                    <label className="mb-2 block text-sm font-medium">
                        Transaction PIN
                    </label>

                    <input
                        type="password"
                        maxLength={4}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="****"
                        className="w-full rounded-xl border p-3 text-center text-lg tracking-[0.5em] outline-none focus:border-green-500"
                    />

                    {/* Button */}
                    <button
                        onClick={fundWallet}
                        disabled={loading}
                        className="mt-6 w-full rounded-xl bg-green-600 py-4 text-lg font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                    >
                        {loading ? "Processing..." : "Pay from Wallet"}
                    </button>
                </div>
            </div>
        </main>
    );
}