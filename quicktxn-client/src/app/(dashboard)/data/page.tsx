"use client";

import { useState } from "react";
import { Wifi, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const networks = [
    { id: "mtn", name: "MTN", color: "bg-yellow-400" },
    { id: "airtel", name: "Airtel", color: "bg-red-500" },
    { id: "glo", name: "Glo", color: "bg-green-600" },
    { id: "9mobile", name: "9mobile", color: "bg-emerald-500" },
];

const plans = [
    { id: 1, size: "500MB", price: 200 },
    { id: 2, size: "1GB", price: 350 },
    { id: 3, size: "2GB", price: 700 },
    { id: 4, size: "5GB", price: 1700 },
    { id: 5, size: "10GB", price: 3200 },
    { id: 6, size: "20GB", price: 6200 },
];

export default function DataPage() {
    const router = useRouter();

    const [network, setNetwork] = useState("mtn");
    const [phone, setPhone] = useState("");
    const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const buyData = async () => {
        if (!phone || !selectedPlan) {
            alert("Please complete all fields");
            return;
        }

        try {
            setLoading(true);

            const plan = plans.find((p) => p.id === selectedPlan);

            await api.post("/data/purchase", {
                network,
                phone,
                planId: selectedPlan,
                amount: plan?.price,
            });

            sessionStorage.setItem("payment_success", "true");
            router.push("/dashboard");
        } catch (error: any) {
            alert(error.response?.data?.message || "Purchase failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 lg:px-8">
                <button
                    onClick={() => router.back()}
                    className="mb-5 flex items-center gap-2 text-gray-700"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-600 p-6 text-white shadow-lg">
                    <div className="flex items-center gap-3">
                        <Wifi size={30} />
                        <div>
                            <p className="text-sm text-blue-100">Fast Internet</p>
                            <h1 className="text-2xl font-bold">Buy Data</h1>
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
                    <h2 className="mb-5 text-lg font-bold">Data Purchase</h2>

                    <label className="mb-3 block text-sm font-medium">
                        Select Network
                    </label>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {networks.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setNetwork(item.id)}
                                className={`rounded-2xl border p-4 transition ${network === item.id
                                        ? "border-blue-600 bg-blue-50"
                                        : "bg-white"
                                    }`}
                            >
                                <div
                                    className={`mx-auto mb-2 h-10 w-10 rounded-full ${item.color}`}
                                />
                                <p className="text-sm font-semibold">{item.name}</p>
                            </button>
                        ))}
                    </div>

                    <div className="mt-6">
                        <label className="mb-2 block text-sm font-medium">
                            Phone Number
                        </label>

                        <input
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value.replace(/\D/g, ""))
                            }
                            maxLength={11}
                            placeholder="08012345678"
                            className="w-full rounded-xl border p-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="mt-6">
                        <label className="mb-3 block text-sm font-medium">
                            Select Data Plan
                        </label>

                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                            {plans.map((plan) => (
                                <button
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan.id)}
                                    className={`rounded-xl border p-4 text-left transition ${selectedPlan === plan.id
                                            ? "border-blue-600 bg-blue-600 text-white"
                                            : "bg-white hover:border-blue-500"
                                        }`}
                                >
                                    <p className="font-bold">{plan.size}</p>
                                    <p className="mt-1 text-sm">
                                        ₦{plan.price.toLocaleString()}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={buyData}
                        disabled={loading}
                        className="mt-6 w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        {loading ? "Processing..." : "Buy Data"}
                    </button>
                </div>
            </div>
        </main>
    );
}