"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
    ArrowLeft,
    Zap,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ShieldCheck,
    Wallet,
} from "lucide-react";
import { motion } from "framer-motion";

const discos = [
    { id: "ikeja-electric", name: "IKEDC", color: "bg-blue-600" },
    { id: "eko-electric", name: "EKEDC", color: "bg-green-600" },
    { id: "ibadan-electric", name: "IBEDC", color: "bg-orange-500" },
    { id: "abuja-electric", name: "AEDC", color: "bg-purple-600" },
];

const meterTypes = ["PREPAID", "POSTPAID"];

const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

export default function ElectricityPage() {
    const router = useRouter();

    const [disco, setDisco] = useState("");
    const [meterType, setMeterType] = useState("PREPAID");
    const [meterNumber, setMeterNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");

    const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState<
        "SUCCESS" | "FAILED" | "PENDING" | ""
    >("");
    const [message, setMessage] = useState("");

    const selectedDisco = discos.find((d) => d.id === disco);

    const payElectricity = async () => {
        setStatus("");
        setMessage("");

        if (!disco || !meterType || !meterNumber || !amount || !pin) {
            setStatus("FAILED");
            setMessage("Please complete all fields.");
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/electricity/purchase", {
                disco,
                meterType,
                meterNumber,
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
                "electricity_receipt",
                JSON.stringify(res.data.data)
            );

            setTimeout(() => {
                router.replace("/dashboard");
            }, 1800);
        } catch (err: any) {
            setStatus("FAILED");
            setMessage(
                err.response?.data?.message || "Electricity purchase failed."
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

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white shadow-lg"
                >
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-white/20 p-3">
                            <Zap size={30} />
                        </div>

                        <div>
                            <p className="text-sm text-yellow-100">Instant Bill Payment</p>
                            <h1 className="text-2xl font-bold">Electricity</h1>
                        </div>
                    </div>
                </motion.div>

                {/* Status */}
                {status === "SUCCESS" && (
                    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
                        <CheckCircle2 size={22} />
                        <div>
                            <p className="font-bold">Payment Successful</p>
                            <p className="text-sm">{message}</p>
                        </div>
                    </div>
                )}

                {status === "FAILED" && (
                    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                        <AlertCircle size={22} />
                        <div>
                            <p className="font-bold">Payment Failed</p>
                            <p className="text-sm">{message}</p>
                        </div>
                    </div>
                )}

                {status === "PENDING" && (
                    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
                        <Loader2 size={22} className="animate-spin" />
                        <div>
                            <p className="font-bold">Payment Pending</p>
                            <p className="text-sm">{message}</p>
                        </div>
                    </div>
                )}

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    {/* Left */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold">Electricity Details</h2>

                            {/* Disco */}
                            <div className="mt-6">
                                <label className="mb-3 block text-sm font-semibold">
                                    Select Distribution Company
                                </label>

                                <div className="grid grid-cols-2 gap-3">
                                    {discos.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setDisco(item.id)}
                                            className={`rounded-2xl border-2 p-3 transition ${disco === item.id
                                                    ? "border-orange-500 bg-orange-50"
                                                    : "border-gray-200"
                                                }`}
                                        >
                                            <div
                                                className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full ${item.color}`}
                                            >
                                                <Zap size={22} className="text-white" />
                                            </div>

                                            <p className="text-xs font-bold">{item.name}</p>

                                            {disco === item.id && (
                                                <CheckCircle2
                                                    size={16}
                                                    className="mx-auto mt-1 text-orange-500"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Meter Type */}
                            <div className="mt-6">
                                <label className="mb-3 block text-sm font-semibold">
                                    Meter Type
                                </label>

                                <div className="grid grid-cols-2 gap-3">
                                    {meterTypes.map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setMeterType(type)}
                                            className={`rounded-xl border-2 py-3 font-semibold transition ${meterType === type
                                                    ? "border-orange-500 bg-orange-500 text-white"
                                                    : "border-gray-200"
                                                }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Meter Number */}
                            <div className="mt-6">
                                <label className="mb-2 block text-sm font-semibold">
                                    Meter Number
                                </label>

                                <input
                                    value={meterNumber}
                                    onChange={(e) =>
                                        setMeterNumber(e.target.value.replace(/\D/g, ""))
                                    }
                                    placeholder="Enter meter number"
                                    className="h-12 w-full rounded-xl border px-4 outline-none focus:border-orange-500"
                                />
                            </div>

                            {/* Amount */}
                            <div className="mt-6">
                                <label className="mb-2 block text-sm font-semibold">
                                    Amount
                                </label>

                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="h-12 w-full rounded-xl border px-4 text-lg font-bold outline-none focus:border-orange-500"
                                />

                                <div className="mt-3 grid grid-cols-3 gap-2">
                                    {quickAmounts.map((amt) => (
                                        <button
                                            key={amt}
                                            onClick={() => setAmount(String(amt))}
                                            className="rounded-lg border py-2 text-sm font-semibold hover:bg-orange-50"
                                        >
                                            ₦{amt.toLocaleString()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* PIN */}
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
                                            setPin(e.target.value.replace(/\D/g, ""))
                                        }
                                        placeholder="••••"
                                        className="h-12 w-full rounded-xl border pl-11 pr-4 text-center tracking-[8px] outline-none focus:border-orange-500"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={payElectricity}
                                disabled={loading}
                                className="mt-7 flex h-14 w-full items-center justify-center rounded-2xl bg-orange-500 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={18} className="mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Pay Electricity Bill"
                                )}
                            </button>
                        </div>
                    </motion.div>

                    {/* Right */}
                    <motion.div
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-5"
                    >
                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <h3 className="mb-4 font-bold">Payment Summary</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Disco</span>
                                    <span className="font-semibold">
                                        {selectedDisco?.name || "--"}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Meter</span>
                                    <span className="font-semibold">
                                        {meterNumber || "--"}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Type</span>
                                    <span className="font-semibold">{meterType}</span>
                                </div>

                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Amount</span>
                                        <span className="text-xl font-bold text-orange-600">
                                            ₦{Number(amount || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-yellow-500 p-5 text-white">
                            <div className="flex items-center gap-2">
                                <Wallet size={22} />
                                <h3 className="text-lg font-bold">Why QuickTxn?</h3>
                            </div>

                            <div className="mt-4 space-y-3 text-sm">
                                <div>⚡ Instant token delivery</div>
                                <div>🔒 Secure wallet payment</div>
                                <div>💰 Cashback rewards</div>
                                <div>📄 Automatic receipt</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}