"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Smartphone } from "lucide-react";

const networks = [
    { id: "mtn", name: "MTN", color: "bg-yellow-400" },
    { id: "airtel", name: "Airtel", color: "bg-red-500" },
    { id: "glo", name: "Glo", color: "bg-green-600" },
    { id: "9mobile", name: "9mobile", color: "bg-emerald-500" },
];

export default function AirtimePage() {
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
            window.location.href = "/dashboard";
        } catch (error: any) {
            alert(error.response?.data?.message || "Purchase failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4 pb-24">
            <h1 className="mb-6 text-2xl font-bold">Buy Airtime</h1>

            <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-600 p-6 text-white">
                <div className="flex items-center gap-3">
                    <Smartphone size={30} />
                    <div>
                        <p className="text-sm text-green-100">
                            Instant Recharge
                        </p>
                        <h2 className="text-xl font-bold">All Networks</h2>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <label className="mb-3 block text-sm font-medium">
                    Select Network
                </label>

                <div className="grid grid-cols-2 gap-3">
                    {networks.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setNetwork(item.id)}
                            className={`rounded-2xl border p-4 transition ${network === item.id
                                ? "border-green-600 bg-green-50"
                                : "bg-white"
                                }`}
                        >
                            <div
                                className={`mx-auto mb-2 h-10 w-10 rounded-full ${item.color}`}
                            />
                            <p className="font-semibold">{item.name}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Phone Number
                    </label>
                    <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="08012345678"
                        className="w-full rounded-2xl border bg-white p-4 outline-none"
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
                        className="w-full rounded-2xl border bg-white p-4 text-2xl font-bold outline-none"
                    />
                </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
                {[100, 200, 500, 1000, 2000, 5000].map((value) => (
                    <button
                        key={value}
                        onClick={() => setAmount(String(value))}
                        className="rounded-xl bg-white py-3 font-semibold shadow-sm"
                    >
                        ₦{value}
                    </button>
                ))}
            </div>

            <button
                onClick={purchaseAirtime}
                disabled={loading}
                className="mt-8 w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white disabled:opacity-60"
            >
                {loading ? "Processing..." : "Buy Airtime"}
            </button>
        </main>
    );
}