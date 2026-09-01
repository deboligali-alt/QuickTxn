"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import {
    Smartphone,
    ArrowLeft,
    Phone,
    Lock,
    CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import NetworkLogo from "@/components/ui/NetworkLogo";

const networks = [
    { id: "MTN", name: "MTN" },
    { id: "AIRTEL", name: "Airtel" },
    { id: "GLO", name: "Glo" },
    { id: "9MOBILE", name: "9mobile" },
];

const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

export default function AirtimePage() {
    const router = useRouter();

    const [network, setNetwork] = useState("MTN");
    const [phone, setPhone] = useState("");
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [responseType, setResponseType] = useState<
        "SUCCESS" | "FAILED" | "PENDING" | ""
    >("");
    const selectedNetwork = networks.find(
        (n) => n.id === network
    );
    const purchaseAirtime = async () => {
        setResponseMessage("");
        setResponseType("");

        if (!phone || !amount || !pin) {
            setResponseType("FAILED");
            setResponseMessage("Complete all fields");
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/airtime/purchase", {
                network: network.toUpperCase(),
                phoneNumber: phone,
                amount: Number(amount),
                pin,
            });

            const status =
                (res.data.data?.status || "SUCCESS").toUpperCase();

            setResponseType(status);
            setResponseMessage(res.data.message);

            if (status === "SUCCESS") {
                sessionStorage.setItem("payment_success", "true");

                sessionStorage.setItem(
                    "cashback_amount",
                    String(res.data.data?.cashback || 0)
                );

                sessionStorage.setItem("refresh_dashboard", "true");

                setTimeout(() => {
                    router.push("/dashboard");
                }, 2000);
            }
        } catch (error: any) {
            setResponseType("FAILED");
            setResponseMessage(
                error.response?.data?.message || "Purchase failed"
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
                    className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white shadow-lg"
                >
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-white/20 p-3">
                            <Smartphone size={30} />
                        </div>

                        <div>
                            <p className="text-sm text-green-100">
                                Instant Recharge
                            </p>

                            <h1 className="text-2xl font-bold">
                                Buy Airtime
                            </h1>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2"
                    >
                        {responseMessage && (
                            <div
                                className={`mt-4 flex items-center gap-2 rounded-xl border p-3 ${responseType === "SUCCESS"
                                        ? "border-green-200 bg-green-50 text-green-700"
                                        : responseType === "PENDING"
                                            ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                                            : "border-red-200 bg-red-50 text-red-700"
                                    }`}
                            >
                                <CheckCircle2 size={18} />
                                <span className="font-medium">{responseMessage}</span>
                            </div>
                        )}
                        <div className="rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold">
                                Recharge Details
                            </h2>

                            <div className="mt-6">
                                <label className="mb-3 block text-sm font-semibold text-gray-700">
                                    Select Network
                                </label>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {networks.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setNetwork(item.id)}
                                            className={`rounded-2xl border-2 p-3 transition ${network === item.id
                                                ? "border-green-600 bg-green-50"
                                                : "border-gray-200 hover:border-green-300"
                                                }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                <NetworkLogo
                                                    network={item.id}
                                                    size="lg"
                                                />

                                                <p className="mt-2 text-sm font-bold">
                                                    {item.name}
                                                </p>

                                                {network === item.id && (
                                                    <CheckCircle2
                                                        size={18}
                                                        className="mt-1 text-green-600"
                                                    />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Phone Number
                                </label>

                                <div className="relative">
                                    <Phone
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="tel"
                                        value={phone}
                                        maxLength={11}
                                        inputMode="numeric"
                                        placeholder="08012345678"
                                        onChange={(e) =>
                                            setPhone(
                                                e.target.value.replace(/\D/g, "")
                                            )
                                        }
                                        className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 outline-none focus:border-green-600"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Airtime Amount
                                </label>

                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                                    {quickAmounts.map((value) => (
                                        <button
                                            key={value}
                                            onClick={() =>
                                                setAmount(String(value))
                                            }
                                            className={`rounded-xl border py-2 text-sm font-bold transition ${Number(amount) === value
                                                ? "border-green-600 bg-green-600 text-white"
                                                : "border-gray-200 hover:border-green-500"
                                                }`}
                                        >
                                            ₦{value}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative mt-3">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                                        ₦
                                    </span>

                                    <input
                                        type="number"
                                        min="50"
                                        value={amount}
                                        placeholder="Enter amount"
                                        onChange={(e) =>
                                            setAmount(e.target.value)
                                        }
                                        className="h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-lg font-bold outline-none focus:border-green-600"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Transaction PIN
                                </label>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="password"
                                        value={pin}
                                        maxLength={4}
                                        inputMode="numeric"
                                        placeholder="****"
                                        onChange={(e) =>
                                            setPin(
                                                e.target.value.replace(/\D/g, "")
                                            )
                                        }
                                        className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-lg tracking-[0.4em] outline-none focus:border-green-600"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={purchaseAirtime}
                                disabled={loading}
                                className="mt-7 flex h-14 w-full items-center justify-center rounded-2xl bg-green-600 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                            >
                                {loading
                                    ? "Processing..."
                                    : "Buy Airtime"}
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
                                Purchase Summary
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Network
                                    </span>
                                    <span className="font-semibold">
                                        {selectedNetwork?.name}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Phone
                                    </span>
                                    <span className="font-semibold">
                                        {phone || "--"}
                                    </span>
                                </div>

                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            Amount
                                        </span>

                                        <span className="text-xl font-bold text-green-700">
                                            ₦
                                            {Number(
                                                amount || 0
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-500 p-5 text-white">
                            <h3 className="text-lg font-bold">
                                Why QuickTxn?
                            </h3>

                            <div className="mt-4 space-y-3 text-sm">
                                <div>⚡ Instant delivery</div>
                                <div>🔒 Secure payment</div>
                                <div>💰 Affordable VTU rates</div>
                                <div>📱 All Nigerian networks</div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <h3 className="mb-3 font-bold">
                                Quick Tips
                            </h3>

                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Confirm the phone number.</li>
                                <li>• Minimum purchase is ₦50.</li>
                                <li>• Airtime arrives instantly.</li>
                                <li>• Keep your PIN confidential.</li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}