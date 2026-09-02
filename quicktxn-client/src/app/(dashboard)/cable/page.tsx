"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
    ArrowLeft,
    Tv,
    CheckCircle2,
    CreditCard,
    Wallet,
    AlertCircle,
    Loader2,
    ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const providers = [
    { id: "dstv", name: "DSTV", color: "bg-blue-600" },
    { id: "gotv", name: "GOtv", color: "bg-green-600" },
    { id: "startimes", name: "Startimes", color: "bg-orange-500" },
];

const bouquets = {
    dstv: [
        { name: "Compact", price: 19000 },
        { name: "Premium", price: 37000 },
    ],
    gotv: [
        { name: "Jinja", price: 3900 },
        { name: "Max", price: 8500 },
    ],
    startimes: [
        { name: "Basic", price: 3300 },
        { name: "Classic", price: 5000 },
    ],
};

export default function CablePage() {
    const router = useRouter();

    const [provider, setProvider] = useState("");
    const [smartCard, setSmartCard] = useState("");
    const [bouquet, setBouquet] = useState("");
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");

    const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState<
        "SUCCESS" | "FAILED" | "PENDING" | ""
    >("");
    const [message, setMessage] = useState("");

    const selectedProvider = providers.find(
        (p) => p.id === provider
    );

    const payCable = async () => {
        setStatus("");
        setMessage("");

        if (
            !provider ||
            !smartCard ||
            !bouquet ||
            !amount ||
            !pin
        ) {
            setStatus("FAILED");
            setMessage("Complete all fields.");
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/cable/purchase", {
                provider,
                smartCard,
                bouquet,
                amount: Number(amount),
                pin,
            });

            setStatus(res.data.status || "SUCCESS");
            setMessage(res.data.message);

            sessionStorage.setItem("payment_success", "true");

            if (res.data.data?.cashback) {
                sessionStorage.setItem(
                    "cashback_amount",
                    String(res.data.data.cashback)
                );
            }

            sessionStorage.setItem(
                "cable_receipt",
                JSON.stringify(res.data.data)
            );

            setTimeout(() => {
                router.replace("/dashboard");
            }, 1800);

        } catch (err: any) {
            setStatus("FAILED");
            setMessage(
                err.response?.data?.message ||
                "Subscription failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-5xl px-4 py-5 pb-24">
                <button
                    onClick={() => router.back()}
                    className="mb-4 flex items-center gap-2 text-gray-600"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white shadow-lg"
                >
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-white/20 p-3">
                            <Tv size={30} />
                        </div>

                        <div>
                            <p className="text-sm text-indigo-100">
                                Renew Subscription
                            </p>
                            <h1 className="text-2xl font-bold">
                                Cable TV
                            </h1>
                        </div>
                    </div>
                </motion.div>

                {status === "SUCCESS" && (
                    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
                        <CheckCircle2 size={22} />
                        <div>
                            <p className="font-bold">
                                Payment Successful
                            </p>
                            <p className="text-sm">{message}</p>
                        </div>
                    </div>
                )}

                {status === "FAILED" && (
                    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                        <AlertCircle size={22} />
                        <div>
                            <p className="font-bold">
                                Payment Failed
                            </p>
                            <p className="text-sm">{message}</p>
                        </div>
                    </div>
                )}

                {status === "PENDING" && (
                    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
                        <Loader2
                            size={22}
                            className="animate-spin"
                        />
                        <div>
                            <p className="font-bold">
                                Payment Pending
                            </p>
                            <p className="text-sm">{message}</p>
                        </div>
                    </div>
                )}

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold">
                                Subscription Details
                            </h2>

                            <div className="mt-6">
                                <label className="mb-3 block text-sm font-semibold">
                                    Select Provider
                                </label>

                                <div className="grid grid-cols-3 gap-3">
                                    {providers.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setProvider(item.id);
                                                setBouquet("");
                                                setAmount("");
                                            }}
                                            className={`rounded-2xl border-2 p-3 transition ${provider === item.id
                                                    ? "border-indigo-600 bg-indigo-50"
                                                    : "border-gray-200"
                                                }`}
                                        >
                                            <div
                                                className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full ${item.color}`}
                                            >
                                                <Tv
                                                    size={22}
                                                    className="text-white"
                                                />
                                            </div>

                                            <p className="text-xs font-bold">
                                                {item.name}
                                            </p>

                                            {provider === item.id && (
                                                <CheckCircle2
                                                    size={16}
                                                    className="mx-auto mt-1 text-indigo-600"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="mb-2 block text-sm font-semibold">
                                    Smart Card / IUC Number
                                </label>

                                <div className="relative">
                                    <CreditCard
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        value={smartCard}
                                        onChange={(e) =>
                                            setSmartCard(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            )
                                        }
                                        placeholder="Enter Smart Card Number"
                                        className="h-12 w-full rounded-xl border pl-11 pr-4 outline-none focus:border-indigo-600"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="mb-3 block text-sm font-semibold">
                                    Select Bouquet
                                </label>

                                <div className="grid gap-3">
                                    {provider &&
                                        bouquets[
                                            provider as keyof typeof bouquets
                                        ]?.map((item) => (
                                            <button
                                                key={item.name}
                                                onClick={() => {
                                                    setBouquet(item.name);
                                                    setAmount(
                                                        String(
                                                            item.price
                                                        )
                                                    );
                                                }}
                                                className={`rounded-xl border-2 p-4 text-left transition ${bouquet === item.name
                                                        ? "border-indigo-600 bg-indigo-600 text-white"
                                                        : "border-gray-200"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-bold">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-sm opacity-80">
                                                            Monthly Plan
                                                        </p>
                                                    </div>

                                                    <p className="text-lg font-bold">
                                                        ₦
                                                        {item.price.toLocaleString()}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="mb-2 block text-sm font-semibold">
                                    Transaction PIN
                                </label>

                                <div className="relative">
                                    <ShieldCheck
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="password"
                                        maxLength={4}
                                        value={pin}
                                        onChange={(e) =>
                                            setPin(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            )
                                        }
                                        placeholder="••••"
                                        className="h-12 w-full rounded-xl border pl-11 pr-4 text-center tracking-[8px] outline-none focus:border-indigo-600"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={payCable}
                                disabled={loading}
                                className="mt-7 flex h-14 w-full items-center justify-center rounded-2xl bg-indigo-600 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="mr-2 animate-spin"
                                        />
                                        Processing...
                                    </>
                                ) : (
                                    "Pay Subscription"
                                )}
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-5"
                    >
                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <h3 className="mb-4 font-bold">
                                Payment Summary
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Provider
                                    </span>
                                    <span className="font-semibold">
                                        {selectedProvider?.name || "--"}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Smart Card
                                    </span>
                                    <span className="font-semibold">
                                        {smartCard || "--"}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Bouquet
                                    </span>
                                    <span className="font-semibold">
                                        {bouquet || "--"}
                                    </span>
                                </div>

                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            Amount
                                        </span>

                                        <span className="text-xl font-bold text-indigo-700">
                                            ₦
                                            {Number(
                                                amount || 0
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-600 p-5 text-white">
                            <div className="flex items-center gap-2">
                                <Wallet size={22} />
                                <h3 className="text-lg font-bold">
                                    Why QuickTxn?
                                </h3>
                            </div>

                            <div className="mt-4 space-y-3 text-sm">
                                <div>📺 Instant renewal</div>
                                <div>⚡ No waiting time</div>
                                <div>🔒 Secure payment</div>
                                <div>🌍 DSTV, GOtv & Startimes</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}