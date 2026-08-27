"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { Smartphone, CheckCircle2 } from "lucide-react";

interface DataPlan {
    network: string;
    plan_type: string;
    plan_name: string;
    plan_code: string;
    amount: number;
}

const networks = [
    { name: "MTN", color: "bg-yellow-400" },
    { name: "Airtel", color: "bg-red-500" },
    { name: "Glo", color: "bg-green-600" },
    { name: "9mobile", color: "bg-emerald-500" },
];

const dataTypes = ["SME", "Corporate", "Gifting"];

export default function DataPage() {
    const [network, setNetwork] = useState("MTN");
    const [phone, setPhone] = useState("");
    const [type, setType] = useState("SME");
    const [pin, setPin] = useState("");

    const [plans, setPlans] = useState<DataPlan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Load data plans
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const res = await api.get("/data/plans");
                setPlans(res.data.data);
            } catch (error) {
                console.error("Failed to load data plans:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    // Filter plans
    const currentPlans = useMemo(() => {
        return plans.filter(
            (plan) =>
                plan.network === network &&
                plan.plan_type === type
        );
    }, [plans, network, type]);

    // Purchase Data
    const purchaseData = async () => {
        if (!selectedPlan) {
            return alert("Select a data plan");
        }

        if (phone.length !== 11) {
            return alert("Enter a valid phone number");
        }

        if (pin.length !== 4) {
            return alert("Enter your 4-digit PIN");
        }

        try {
            setProcessing(true);

            await api.post("/data/purchase", {
                network,
                planCode: selectedPlan.plan_code,
                phoneNumber: phone,
                pin,
            });

            sessionStorage.setItem("payment_success", "true");
            window.location.href = "/dashboard";

        } catch (error: any) {
            alert(
                error.response?.data?.message ||
                "Data purchase failed"
            );
        } finally {
            setProcessing(false);
        }
    };

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4 pb-28">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Buy Data</h1>
                <p className="text-sm text-gray-500">
                    Fast & affordable internet bundles
                </p>
            </div>

            <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-5 text-white">
                <div className="flex items-center gap-3">
                    <Smartphone size={30} />
                    <div>
                        <p className="text-sm text-green-100">
                            Instant Purchase
                        </p>
                        <h2 className="text-xl font-bold">
                            Data Bundles
                        </h2>
                    </div>
                </div>
            </div>

            {/* Network */}
            <div className="mt-6">
                <label className="mb-3 block font-semibold">
                    Select Network
                </label>

                <div className="grid grid-cols-2 gap-3">
                    {networks.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => {
                                setNetwork(item.name);
                                setSelectedPlan(null);
                            }}
                            className={`rounded-2xl border p-4 transition ${network === item.name
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

            {/* Phone */}
            <div className="mt-6">
                <label className="mb-2 block font-semibold">
                    Phone Number
                </label>

                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08012345678"
                    className="w-full rounded-2xl border bg-white p-4 outline-none focus:border-green-600"
                />
            </div>

            {/* Data Type */}
            <div className="mt-6">
                <label className="mb-3 block font-semibold">
                    Data Type
                </label>

                <div className="flex gap-2">
                    {dataTypes.map((item) => (
                        <button
                            key={item}
                            onClick={() => {
                                setType(item);
                                setSelectedPlan(null);
                            }}
                            className={`flex-1 rounded-xl py-3 text-sm font-semibold ${type === item
                                    ? "bg-green-600 text-white"
                                    : "border bg-white"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* Plans */}
            <div className="mt-6">
                <label className="mb-3 block font-semibold">
                    Select Data Plan
                </label>

                {loading ? (
                    <p className="text-center text-gray-500">
                        Loading plans...
                    </p>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {currentPlans.map((plan) => (
                            <button
                                key={plan.plan_code}
                                onClick={() => setSelectedPlan(plan)}
                                className={`rounded-2xl border p-4 text-left transition ${selectedPlan?.plan_code === plan.plan_code
                                        ? "border-green-600 bg-green-50"
                                        : "bg-white"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold">
                                        {plan.plan_name}
                                    </h3>

                                    {selectedPlan?.plan_code === plan.plan_code && (
                                        <CheckCircle2
                                            className="text-green-600"
                                            size={18}
                                        />
                                    )}
                                </div>

                                <p className="mt-2 text-2xl font-bold text-green-600">
                                    ₦{Number(plan.amount).toLocaleString()}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    {plan.plan_type} Bundle
                                </p>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* PIN */}
            <div className="mt-6">
                <label className="mb-2 block font-semibold">
                    Transaction PIN
                </label>

                <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="****"
                    className="w-full rounded-2xl border bg-white p-4 text-center tracking-[0.5em]"
                />
            </div>

            <button
                onClick={purchaseData}
                disabled={
                    processing ||
                    loading ||
                    !selectedPlan ||
                    phone.length !== 11 ||
                    pin.length !== 4
                }
                className="mt-8 w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white disabled:opacity-50"
            >
                {processing ? "Processing..." : "Buy Data"}
            </button>
        </main>
    );
}