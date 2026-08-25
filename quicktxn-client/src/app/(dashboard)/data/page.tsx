"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Wifi } from "lucide-react";

const networks = [
    { id: "mtn", name: "MTN", color: "bg-yellow-400" },
    { id: "airtel", name: "Airtel", color: "bg-red-500" },
    { id: "glo", name: "Glo", color: "bg-green-600" },
    { id: "9mobile", name: "9mobile", color: "bg-emerald-500" },
];

interface Plan {
    id: string;
    name: string;
    price: number;
}

export default function DataPage() {
    const [network, setNetwork] = useState("mtn");
    const [phone, setPhone] = useState("");
    const [plans, setPlans] = useState<Plan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/data/plans/${network}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setPlans(res.data.data);
            } catch {
                setPlans([
                    { id: "1", name: "500MB", price: 200 },
                    { id: "2", name: "1GB", price: 350 },
                    { id: "3", name: "2GB", price: 700 },
                    { id: "4", name: "5GB", price: 1500 },
                ]);
            }
        };

        fetchPlans();
    }, [network]);

    const buyData = async () => {
        if (!phone || !selectedPlan) {
            alert("Select a plan and enter phone number");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/data/purchase`,
                {
                    network,
                    phone,
                    planId: selectedPlan.id,
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
            alert(error.response?.data?.message || "Purchase failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4 pb-24">
            <h1 className="mb-6 text-2xl font-bold">
                Buy Data
            </h1>

            <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-600 p-6 text-white">
                <div className="flex items-center gap-3">
                    <Wifi size={30} />
                    <div>
                        <p className="text-sm text-green-100">
                            Mobile Data
                        </p>
                        <h2 className="text-xl font-bold">
                            Fast Activation
                        </h2>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <label className="mb-3 block text-sm font-medium">
                    Network
                </label>

                <div className="grid grid-cols-2 gap-3">
                    {networks.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setNetwork(item.id);
                                setSelectedPlan(null);
                            }}
                            className={`rounded-2xl border p-4 ${network === item.id
                                    ? "border-green-600 bg-green-50"
                                    : "bg-white"
                                }`}
                        >
                            <div
                                className={`mx-auto mb-2 h-10 w-10 rounded-full ${item.color}`}
                            />

                            <p className="font-semibold">
                                {item.name}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6">
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

            <div className="mt-6">
                <label className="mb-3 block text-sm font-medium">
                    Select Plan
                </label>

                <div className="space-y-3">
                    {plans.map((plan) => (
                        <button
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan)}
                            className={`flex w-full items-center justify-between rounded-2xl border p-4 ${selectedPlan?.id === plan.id
                                    ? "border-green-600 bg-green-50"
                                    : "bg-white"
                                }`}
                        >
                            <span className="font-medium">
                                {plan.name}
                            </span>

                            <span className="font-bold text-green-600">
                                ₦{plan.price}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={buyData}
                disabled={loading}
                className="mt-8 w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white disabled:opacity-60"
            >
                {loading ? "Processing..." : "Buy Data"}
            </button>
        </main>
    );
}