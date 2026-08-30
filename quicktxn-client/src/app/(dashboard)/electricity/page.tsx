"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Zap,
    CheckCircle2,
    Hash,
    Wallet,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const discos = [
    "IKEDC",
    "EKEDC",
    "AEDC",
    "IBEDC",
    "KEDCO",
    "PHED",
    "EEDC",
    "BEDC",
];

const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

export default function ElectricityPage() {
    const router = useRouter();

    const [disco, setDisco] = useState("");
    const [meterType, setMeterType] = useState("prepaid");
    const [meterNumber, setMeterNumber] = useState("");
    const [amount, setAmount] = useState("");

    const continuePayment = () => {
        if (!disco || !meterNumber || !amount) {
            toast.error("Complete all fields");
            return;
        }

        sessionStorage.setItem(
            "electricity",
            JSON.stringify({
                disco,
                meterType,
                meterNumber,
                amount,
            })
        );

        router.push("/electricity/confirm");
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
                            <p className="text-sm text-yellow-100">
                                Pay Instantly
                            </p>
                            <h1 className="text-2xl font-bold">
                                Electricity Bill
                            </h1>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    {/* Left */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold">
                                Bill Details
                            </h2>

                            {/* DISCO */}
                            <div className="mt-6">
                                <label className="mb-3 block text-sm font-semibold text-gray-700">
                                    Distribution Company
                                </label>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {discos.map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => setDisco(item)}
                                            className={`rounded-xl border-2 p-3 text-center transition ${disco === item
                                                    ? "border-orange-500 bg-orange-50"
                                                    : "border-gray-200 hover:border-orange-300"
                                                }`}
                                        >
                                            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                                                <Zap
                                                    size={18}
                                                    className="text-orange-600"
                                                />
                                            </div>

                                            <p className="text-xs font-bold">{item}</p>

                                            {disco === item && (
                                                <CheckCircle2
                                                    size={16}
                                                    className="mx-auto mt-1 text-orange-600"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Meter Type */}
                            <div className="mt-6">
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Meter Type
                                </label>

                                <div className="grid grid-cols-2 gap-3">
                                    {["prepaid", "postpaid"].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setMeterType(type)}
                                            className={`rounded-xl border-2 py-3 font-semibold capitalize transition ${meterType === type
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
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Meter Number
                                </label>

                                <div className="relative">
                                    <Hash
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        value={meterNumber}
                                        inputMode="numeric"
                                        placeholder="12345678901"
                                        onChange={(e) =>
                                            setMeterNumber(
                                                e.target.value.replace(/\D/g, "")
                                            )
                                        }
                                        className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 outline-none focus:border-orange-500"
                                    />
                                </div>
                            </div>

                            {/* Amount */}
                            <div className="mt-6">
                                <label className="mb-3 block text-sm font-semibold text-gray-700">
                                    Amount
                                </label>

                                <div className="grid grid-cols-3 gap-2">
                                    {quickAmounts.map((value) => (
                                        <button
                                            key={value}
                                            onClick={() =>
                                                setAmount(String(value))
                                            }
                                            className={`rounded-lg border py-2 text-sm font-bold transition ${Number(amount) === value
                                                    ? "border-orange-500 bg-orange-500 text-white"
                                                    : "border-gray-200"
                                                }`}
                                        >
                                            ₦{value.toLocaleString()}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative mt-3">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                                        ₦
                                    </span>

                                    <input
                                        type="number"
                                        value={amount}
                                        placeholder="Enter amount"
                                        onChange={(e) =>
                                            setAmount(e.target.value)
                                        }
                                        className="h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-lg font-bold outline-none focus:border-orange-500"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={continuePayment}
                                className="mt-7 flex h-14 w-full items-center justify-center rounded-2xl bg-orange-500 font-semibold text-white transition hover:bg-orange-600"
                            >
                                Continue Payment
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
                            <h3 className="mb-4 font-bold">
                                Payment Summary
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        DISCO
                                    </span>
                                    <span className="font-semibold">
                                        {disco || "--"}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Meter
                                    </span>
                                    <span className="font-semibold">
                                        {meterNumber || "--"}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Type
                                    </span>
                                    <span className="font-semibold capitalize">
                                        {meterType}
                                    </span>
                                </div>

                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            Amount
                                        </span>

                                        <span className="text-xl font-bold text-orange-600">
                                            ₦
                                            {Number(
                                                amount || 0
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-gradient-to-br from-yellow-500 to-orange-500 p-5 text-white">
                            <div className="flex items-center gap-2">
                                <Wallet size={22} />
                                <h3 className="text-lg font-bold">
                                    Why QuickTxn?
                                </h3>
                            </div>

                            <div className="mt-4 space-y-3 text-sm">
                                <div>⚡ Instant token delivery</div>
                                <div>🔒 Secure payments</div>
                                <div>🏠 All major DISCOs</div>
                                <div>📩 Digital receipt included</div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <h3 className="mb-3 font-bold">
                                Quick Tips
                            </h3>

                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Confirm your meter number.</li>
                                <li>• Choose the correct DISCO.</li>
                                <li>• Prepaid generates a token.</li>
                                <li>• Postpaid pays your bill.</li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}