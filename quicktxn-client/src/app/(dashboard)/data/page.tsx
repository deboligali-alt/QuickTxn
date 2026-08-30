"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import {
    Wifi,
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

const plans = [
    { id: 1, size: "500MB", price: 200, planCode: "MTN500" },
    { id: 2, size: "1GB", price: 350, planCode: "MTN1GB" },
    { id: 3, size: "2GB", price: 700, planCode: "MTN2GB" },
    { id: 4, size: "5GB", price: 1700, planCode: "MTN5GB" },
    { id: 5, size: "10GB", price: 3200, planCode: "MTN10GB" },
    { id: 6, size: "20GB", price: 6200, planCode: "MTN20GB" },
];

export default function DataPage() {
    const router = useRouter();

    const [network, setNetwork] = useState("MTN");
    const [phone, setPhone] = useState("");
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);

    const plan = plans.find((p) => p.id === selectedPlan);

    const buyData = async () => {
        if (!phone || !selectedPlan) {
            alert("Please complete all fields");
            return;
        }

        try {
            setLoading(true);

            const plan = plans.find((p) => p.id === selectedPlan);

            const res = await api.post("/data/purchase", {
                network: network.toUpperCase(),
                planCode: plan?.planCode,
                phoneNumber: phone,
                pin: "1234", // replace with PIN input later
            });

            sessionStorage.setItem("payment_success", "true");
            sessionStorage.setItem(
                "cashback_amount",
                String(res.data.data.cashback || 0)
            );

            sessionStorage.setItem("refresh_dashboard", "true");

            router.push("/dashboard");
        } catch (error: any) {
            alert(error.response?.data?.message || "Purchase failed");
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
                    className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white shadow-lg"
                >
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-white/20 p-3">
                            <Wifi size={30} />
                        </div>

                        <div>
                            <p className="text-sm text-blue-100">Fast Internet</p>
                            <h1 className="text-2xl font-bold">Buy Data</h1>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold">Data Purchase</h2>

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
                                                ? "border-blue-600 bg-blue-50"
                                                : "border-gray-200 hover:border-blue-300"
                                                }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                <NetworkLogo network={item.id} size="lg" />
                                                <p className="mt-2 text-sm font-bold">{item.name}</p>
                                                {network === item.id && (
                                                    <CheckCircle2
                                                        size={18}
                                                        className="mt-1 text-blue-600"
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
                                        value={phone}
                                        maxLength={11}
                                        inputMode="numeric"
                                        placeholder="08012345678"
                                        onChange={(e) =>
                                            setPhone(e.target.value.replace(/\D/g, ""))
                                        }
                                        className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 outline-none focus:border-blue-600"
                                    />
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="mb-3 block text-sm font-semibold text-gray-700">
                                    Select Data Plan
                                </label>

                                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                                    {plans.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setSelectedPlan(item.id)}
                                            className={`rounded-xl border p-4 text-left transition ${selectedPlan === item.id
                                                ? "border-blue-600 bg-blue-600 text-white"
                                                : "border-gray-200 hover:border-blue-400"
                                                }`}
                                        >
                                            <p className="text-lg font-bold">{item.size}</p>
                                            <p className="mt-1 text-sm">
                                                ₦{item.price.toLocaleString()}
                                            </p>
                                        </button>
                                    ))}
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
                                            setPin(e.target.value.replace(/\D/g, ""))
                                        }
                                        className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-lg tracking-[0.4em] outline-none focus:border-blue-600"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={buyData}
                                disabled={loading}
                                className="mt-7 flex h-14 w-full items-center justify-center rounded-2xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                            >
                                {loading ? "Processing..." : "Buy Data"}
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-5"
                    >
                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <h3 className="mb-4 font-bold">Purchase Summary</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Network</span>
                                    <span className="font-semibold">{network}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Phone</span>
                                    <span className="font-semibold">{phone || "--"}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">Plan</span>
                                    <span className="font-semibold">
                                        {plan?.size || "--"}
                                    </span>
                                </div>

                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Amount</span>
                                        <span className="text-xl font-bold text-blue-700">
                                            ₦{plan?.price.toLocaleString() || "0"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 p-5 text-white">
                            <h3 className="text-lg font-bold">Why QuickTxn?</h3>

                            <div className="mt-4 space-y-3 text-sm">
                                <div>⚡ Instant activation</div>
                                <div>📶 Affordable data plans</div>
                                <div>🔒 Secure payment</div>
                                <div>🌍 All Nigerian networks</div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <h3 className="mb-3 font-bold">Quick Tips</h3>

                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Choose the correct network.</li>
                                <li>• Confirm the phone number.</li>
                                <li>• Data activates within minutes.</li>
                                <li>• Keep your PIN confidential.</li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}