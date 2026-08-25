"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Plan {
    id: string;
    network: string;
    plan_name: string;
    size: string;
    validity: string;
    amount: number;
}

const networks = [
    {
        code: "MTN",
        name: "MTN",
        color: "border-yellow-400 bg-yellow-50",
        logo: "/networks/mtn.png",
    },
    {
        code: "AIRTEL",
        name: "Airtel",
        color: "border-red-500 bg-red-50",
        logo: "/networks/airtel.png",
    },
    {
        code: "GLO",
        name: "Glo",
        color: "border-green-500 bg-green-50",
        logo: "/networks/glo.png",
    },
    {
        code: "9MOBILE",
        name: "9mobile",
        color: "border-emerald-600 bg-emerald-50",
        logo: "/networks/9mobile.png",
    },
];

export default function DataPage() {
    const [selectedNetwork, setSelectedNetwork] = useState("MTN");
    const [plans, setPlans] = useState<Plan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [phone, setPhone] = useState("");

    useEffect(() => {
        const loadPlans = async () => {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/data/plans`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setPlans(
                res.data.data.filter(
                    (plan: Plan) => plan.network === selectedNetwork
                )
            );
        };

        loadPlans();
    }, [selectedNetwork]);

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4 pb-28">
            <h1 className="text-2xl font-bold">Buy Data</h1>
            <p className="mt-1 text-gray-500">
                Fast & affordable internet bundles
            </p>

            {/* Networks */}
            <div className="mt-6 grid grid-cols-4 gap-3">
                {networks.map((network) => (
                    <button
                        key={network.code}
                        onClick={() => {
                            setSelectedNetwork(network.code);
                            setSelectedPlan(null);
                        }}
                        className={`rounded-2xl border-2 p-3 transition ${selectedNetwork === network.code
                                ? network.color
                                : "border-gray-200 bg-white"
                            }`}
                    >
                        <img
                            src={network.logo}
                            alt={network.name}
                            className="mx-auto h-10 w-10 object-contain"
                        />
                        <p className="mt-2 text-center text-xs font-medium">
                            {network.name}
                        </p>
                    </button>
                ))}
            </div>

            {/* Phone */}
            <div className="mt-6">
                <label className="mb-2 block text-sm font-medium">
                    Phone Number
                </label>

                <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08012345678"
                    className="w-full rounded-2xl border bg-white p-4"
                />
            </div>

            {/* Plans */}
            <div className="mt-6">
                <h2 className="mb-3 font-semibold">Select Plan</h2>

                <div className="space-y-3">
                    {plans.map((plan) => (
                        <button
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan)}
                            className={`w-full rounded-2xl border p-4 text-left ${selectedPlan?.id === plan.id
                                    ? "border-green-600 bg-green-50"
                                    : "border-gray-200 bg-white"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold">{plan.size}</h3>
                                    <p className="text-sm text-gray-500">
                                        {plan.validity}
                                    </p>
                                </div>

                                <span className="text-lg font-bold text-green-600">
                                    ₦{plan.amount.toLocaleString()}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Continue */}
            <button className="mt-8 w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white">
                Continue
            </button>
        </main>
    );
}