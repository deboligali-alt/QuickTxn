"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Trophy } from "lucide-react";

interface Provider {
    provider_name: string;
    provider_code: string;
    logo: string;
}

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
        } catch {
            alert("Customer not found");
            setCustomerName("");
        }
    };

    const fundWallet = async () => {
        if (!customerName) {
            return alert("Verify customer first");
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
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4 pb-24">
            <h1 className="mb-6 text-2xl font-bold">
                Betting Wallet
            </h1>

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
                    <div className="grid grid-cols-2 gap-3">
                        {providers.map((provider) => (
                            <button
                                key={provider.provider_code}
                                onClick={() => setProviderCode(provider.provider_code)}
                                className={`rounded-2xl border-2 p-4 transition ${providerCode === provider.provider_code
                                        ? "border-green-600 bg-green-50"
                                        : "border-gray-200 bg-white"
                                    }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <Image
                                        src={provider.logo}
                                        alt={provider.provider_name}
                                        width={56}
                                        height={56}
                                        className="rounded-full object-contain"
                                    />

                                    <span className="text-center text-sm font-medium">
                                        {provider.provider_name}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
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
                        onChange={(e) =>
                            setAmount(e.target.value)
                        }
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
                className="mt-8 w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white"
            >
                {loading ? "Processing..." : "Pay from Wallet"}
            </button>
        </main>
    );
}