"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Smartphone, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const networks = [
    { id: "mtn", name: "MTN", color: "bg-yellow-400" },
    { id: "airtel", name: "Airtel", color: "bg-red-500" },
    { id: "glo", name: "Glo", color: "bg-green-600" },
    { id: "9mobile", name: "9mobile", color: "bg-emerald-500" },
];

export default function AirtimePage() {
    const router = useRouter();

    const [network, setNetwork] = useState("mtn");
    const [phone, setPhone] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const purchaseAirtime = async () => {
        if (!phone || !amount) {
            alert("Complete all fields");
            return;
        }

        try {
            setLoading(true);

            await api.post("/airtime/purchase", {
                network,
                phone,
                amount: Number(amount),
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
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-5 flex items-center gap-2 text-gray-700"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {/* Hero Card */}
                <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-600 p-6 text-white shadow-lg">
                    <div className="flex items-center gap-3">
                        <Smartphone size={30} />
                        <div>
                            <p className="text-sm text-green-100">
                                Instant Recharge
                            </p>
                            <h1 className="text-2xl font-bold">
                                Buy Airtime
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm">
                    <h2 className="mb-5 text-lg font-bold">
                        Recharge Details
                    </h2>

                    {/* Networks */}
                    <label className="mb-3 block text-sm font-medium">
                        Select Network
                    </label>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {networks.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setNetwork(item.id)}
                                className={`rounded-2xl border p-4 transition ${network === item.id
                                        ? "border-green-600 bg-green-50"
                                        : "bg-white hover:border-gray-300"
                                    }`}
                            >
                                <div
                                    className={`mx-auto mb-2 h-10 w-10 rounded-full ${item.color}`}
                                />
                                <p className="text-sm font-semibold">
                                    {item.name}
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* Inputs */}
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Phone Number
                            </label>

                            <input
                                value={phone}
                                onChange={(e) =>
                                    setPhone(
                                        e.target.value.replace(/\D/g, "")
                                    )
                                }
                                maxLength={11}
                                placeholder="08012345678"
                                className="w-full rounded-xl border p-3 outline-none focus:border-green-500"
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
                                placeholder="₦100"
                                className="w-full rounded-xl border p-3 text-xl font-bold outline-none focus:border-green-500"
                            />
                        </div>
                    </div>

                    {/* Quick Amounts */}
                    <div className="mt-5">
                        <p className="mb-3 text-sm font-medium text-gray-700">
                            Quick Select
                        </p>

                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                            {[100, 200, 500, 1000, 2000, 5000].map(
                                (value) => (
                                    <button
                                        key={value}
                                        onClick={() =>
                                            setAmount(String(value))
                                        }
                                        className={`rounded-xl border py-3 text-sm font-semibold transition ${amount === String(value)
                                                ? "border-green-600 bg-green-600 text-white"
                                                : "bg-white hover:border-green-500"
                                            }`}
                                    >
                                        ₦{value}
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    {/* Buy Button */}
                    <button
                        onClick={purchaseAirtime}
                        disabled={loading}
                        className="mt-6 w-full rounded-xl bg-green-600 py-4 text-lg font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Processing..." : "Buy Airtime"}
                    </button>
                </div>
            </div>
        </main>
    );
}