"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
    getDataPlans,
    purchaseData,
} from "@/services/data.service";

const networks = [
    { id: "MTN", name: "MTN" },
    { id: "AIRTEL", name: "Airtel" },
    { id: "GLO", name: "Glo" },
    { id: "9MOBILE", name: "9mobile" },
];

interface DataPlan {
    id: number;
    network: string;
    plan_name: string;
    plan_code: string;
    amount: number;
    category: string;
}

export default function DataPage() {
    const router = useRouter();

    const [network, setNetwork] = useState("MTN");
    const [phone, setPhone] = useState("");
    const [plans, setPlans] = useState<DataPlan[]>([]);
    const [selectedPlan, setSelectedPlan] =
        useState<DataPlan | null>(null);
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);

    const loadPlans = async (selected: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await getDataPlans(token, selected);
            setPlans(res.data);
            setSelectedPlan(null);
        } catch {
            toast.error("Unable to load data plans");
        }
    };

    useEffect(() => {
        loadPlans("MTN");
    }, []);

    const groupedPlans = useMemo(() => {
        const groups: Record<string, DataPlan[]> = {};

        plans.forEach((plan) => {
            const key = plan.category || "OTHER";
            if (!groups[key]) groups[key] = [];
            groups[key].push(plan);
        });

        return groups;
    }, [plans]);

    const order = [
        "DAILY",
        "NIGHT",
        "WEEKLY",
        "MONTHLY",
        "SPECIAL",
        "SME",
        "VOICE",
    ];

    const buyData = async () => {
        if (!phone || !selectedPlan || pin.length !== 4) {
            toast.error("Complete all fields");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            setLoading(true);

            const res = await purchaseData(token, {
                network,
                planCode: selectedPlan.plan_code,
                phoneNumber: phone,
                pin,
            });

            sessionStorage.setItem("payment_success", "true");
            sessionStorage.setItem(
                "cashback_amount",
                String(res.data.cashback || 0)
            );
            sessionStorage.setItem("refresh_dashboard", "true");

            toast.success("Data purchased successfully");
            router.push("/dashboard");
        } catch (err: any) {
            toast.error(
                err.response?.data?.message || "Purchase failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl px-4 py-5 pb-24">
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
                            <p className="text-sm text-blue-100">
                                Fast Internet
                            </p>
                            <h1 className="text-2xl font-bold">
                                Buy Data
                            </h1>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    {/* Left */}
                    <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-bold">
                            Data Purchase
                        </h2>

                        {/* Network */}
                        <div className="mt-6">
                            <label className="mb-3 block text-sm font-semibold">
                                Select Network
                            </label>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {networks.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setNetwork(item.id);
                                            loadPlans(item.id);
                                        }}
                                        className={`rounded-2xl border-2 p-3 transition ${network === item.id
                                                ? "border-blue-600 bg-blue-50"
                                                : "border-gray-200"
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
                                                    className="mt-1 text-blue-600"
                                                />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="mt-6">
                            <label className="mb-2 block text-sm font-semibold">
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
                                        setPhone(
                                            e.target.value.replace(/\D/g, "")
                                        )
                                    }
                                    className="h-12 w-full rounded-xl border pl-11 pr-4 outline-none focus:border-blue-600"
                                />
                            </div>
                        </div>

                        {/* Plans */}
                        <div className="mt-6">
                            <label className="mb-4 block text-sm font-semibold">
                                Select Data Plan
                            </label>

                            {order.map((category) =>
                                groupedPlans[category]?.length ? (
                                    <div
                                        key={category}
                                        className="mb-7"
                                    >
                                        <h3 className="mb-3 text-base font-bold text-gray-800">
                                            {category === "SME"
                                                ? "SME Data"
                                                : `${category} Plans`}
                                        </h3>

                                        <div className="space-y-3">
                                            {groupedPlans[category].map((plan) => (
                                                <button
                                                    key={plan.id}
                                                    onClick={() =>
                                                        setSelectedPlan(plan)
                                                    }
                                                    className={`w-full rounded-2xl border p-4 text-left transition ${selectedPlan?.id === plan.id
                                                            ? "border-blue-600 bg-blue-50"
                                                            : "border-gray-200 bg-white hover:border-blue-300"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="pr-4">
                                                            <p className="font-semibold text-gray-900">
                                                                {plan.plan_name}
                                                            </p>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="text-lg font-bold text-blue-700">
                                                                ₦
                                                                {Number(
                                                                    plan.amount
                                                                ).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : null
                            )}
                        </div>

                        {/* PIN */}
                        <div className="mt-6">
                            <label className="mb-2 block text-sm font-semibold">
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
                                    className="h-12 w-full rounded-xl border pl-11 pr-4 text-lg tracking-[0.4em] outline-none focus:border-blue-600"
                                />
                            </div>
                        </div>

                        <button
                            onClick={buyData}
                            disabled={loading}
                            className="mt-7 flex h-14 w-full items-center justify-center rounded-2xl bg-blue-600 font-semibold text-white disabled:opacity-60"
                        >
                            {loading
                                ? "Processing..."
                                : "Buy Data"}
                        </button>
                    </div>

                    {/* Right */}
                    <div className="space-y-5">
                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <h3 className="mb-4 font-bold">
                                Purchase Summary
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span>Network</span>
                                    <span className="font-semibold">
                                        {network}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Phone</span>
                                    <span className="font-semibold">
                                        {phone || "--"}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Plan</span>
                                    <span className="font-semibold text-right">
                                        {selectedPlan?.plan_name || "--"}
                                    </span>
                                </div>

                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span>Amount</span>

                                        <span className="text-xl font-bold text-blue-700">
                                            ₦
                                            {Number(
                                                selectedPlan?.amount || 0
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 p-5 text-white">
                            <h3 className="text-lg font-bold">
                                Why QuickTxn?
                            </h3>

                            <div className="mt-4 space-y-3 text-sm">
                                <div>⚡ Instant activation</div>
                                <div>📶 Affordable data plans</div>
                                <div>🔒 Secure payment</div>
                                <div>🌍 All Nigerian networks</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}