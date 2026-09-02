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

const categoryOrder = [
    "DAILY",
    "NIGHT",
    "WEEKLY",
    "MONTHLY",
    "SPECIAL",
    "SME",
    "VOICE",
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
    const [category, setCategory] = useState("DAILY");
    const [selectedPlan, setSelectedPlan] =
        useState<DataPlan | null>(null);
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);

    const loadPlans = async (selectedNetwork: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const res = await getDataPlans(token, selectedNetwork);
            const data: DataPlan[] = res.data || [];

            setPlans(data);

            const hasDaily = data.some(
                (p) => p.category === "DAILY"
            );

            setCategory(
                hasDaily ? "DAILY" : data[0]?.category || "MONTHLY"
            );

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
            if (!groups[plan.category]) {
                groups[plan.category] = [];
            }
            groups[plan.category].push(plan);
        });

        return groups;
    }, [plans]);

    const visiblePlans = groupedPlans[category] || [];

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
            <div className="mx-auto w-full max-w-7xl px-3 py-5 pb-24 sm:px-4 lg:px-6">
                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="mb-4 flex items-center gap-2 text-gray-600"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {/* Header */}
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
                    {/* LEFT PANEL */}
                    <div className="lg:col-span-2 rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
                        <h2 className="text-lg font-bold">
                            Data Purchase
                        </h2>

                        {/* Network */}
                        <div className="mt-6">
                            <label className="mb-3 block text-sm font-bold text-gray-700">
                                Select Network
                            </label>

                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                                {networks.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setNetwork(item.id);
                                            loadPlans(item.id);
                                        }}
                                        className={`rounded-2xl border p-2.5 sm:p-3 transition ${network === item.id
                                                ? "border-blue-600 bg-blue-50"
                                                : "border-gray-200 bg-white"
                                            }`}
                                    >
                                        <div className="flex flex-col items-center">
                                            <NetworkLogo
                                                network={item.id}
                                                size="lg"
                                            />

                                            <p className="mt-2 text-xs sm:text-sm font-bold">
                                                {item.name}
                                            </p>

                                            {network === item.id && (
                                                <CheckCircle2
                                                    size={16}
                                                    className="mt-1 text-blue-600"
                                                />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="mt-6">
                            <label className="mb-2 block text-sm font-bold text-gray-700">
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
                                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                        {/* Categories */}
                        <div className="mt-6">
                            <label className="mb-3 block text-sm font-bold text-gray-700">
                                Data Categories
                            </label>

                            <div className="flex flex-wrap gap-2">
                                {categoryOrder
                                    .filter((cat) => groupedPlans[cat]?.length)
                                    .map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setCategory(cat);
                                                setSelectedPlan(null);
                                            }}
                                            className={`rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition ${category === cat
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {cat === "SME" ? "SME Data" : cat}
                                        </button>
                                    ))}
                            </div>
                        </div>

                        {/* Plans */}
                        <div className="mt-6">
                            <h3 className="mb-4 text-lg font-extrabold text-sky-600">
                                {category === "SME"
                                    ? "SME Data Plans"
                                    : `${category} Plans`}
                            </h3>

                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                {visiblePlans.map((plan) => (
                                    <button
                                        key={plan.id}
                                        onClick={() => setSelectedPlan(plan)}
                                        className={`rounded-2xl border border-gray-100 p-3 sm:p-4 text-left transition ${selectedPlan?.id === plan.id
                                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                                : "bg-white hover:border-blue-200"
                                            }`}
                                    >
                                        <p className="min-h-[36px] text-xs sm:text-sm font-semibold text-gray-700">
                                            {plan.plan_name}
                                        </p>

                                        <p className="mt-2 text-lg sm:text-xl font-extrabold text-sky-600">
                                            ₦{Number(plan.amount).toLocaleString()}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* PIN */}
                        <div className="mt-6">
                            <label className="mb-2 block text-sm font-bold text-gray-700">
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
                                    className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-lg tracking-[0.4em] outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Buy Button */}
                        <button
                            onClick={buyData}
                            disabled={loading}
                            className="mt-7 flex h-14 w-full items-center justify-center rounded-2xl bg-blue-600 font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
                        >
                            {loading ? "Processing..." : "Buy Data"}
                        </button>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="space-y-6">
                        {/* Summary */}
                        <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800">
                                Purchase Summary
                            </h3>

                            <div className="mt-5 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Network</span>
                                    <span className="font-bold">{network}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Phone</span>
                                    <span className="font-bold">
                                        {phone || "----------"}
                                    </span>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Selected Plan
                                    </p>

                                    <p className="mt-2 text-sm font-bold text-gray-800">
                                        {selectedPlan?.plan_name ||
                                            "No plan selected"}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-blue-100 bg-sky-50 p-4">
                                    <p className="text-sm font-medium text-sky-600">
                                        Amount
                                    </p>

                                    <h2 className="mt-1 text-3xl font-extrabold text-sky-600">
                                        ₦
                                        {selectedPlan
                                            ? Number(
                                                selectedPlan.amount
                                            ).toLocaleString()
                                            : "0"}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Why QuickTxn */}
                        <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-800">
                                Why QuickTxn?
                            </h3>

                            <div className="mt-5 space-y-4">
                                {[
                                    [
                                        "Instant Delivery",
                                        "Your data is delivered immediately after payment.",
                                    ],
                                    [
                                        "Secure Wallet",
                                        "Every purchase is protected with your 4-digit transaction PIN.",
                                    ],
                                    [
                                        "Cashback Rewards",
                                        "Eligible data purchases earn automatic cashback into your wallet.",
                                    ],
                                ].map(([title, desc]) => (
                                    <div
                                        key={title}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="rounded-full bg-green-100 p-2">
                                            <CheckCircle2
                                                size={18}
                                                className="text-green-600"
                                            />
                                        </div>

                                        <div>
                                            <p className="font-semibold">{title}</p>
                                            <p className="text-sm text-gray-500">
                                                {desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Support */}
                        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-white shadow-lg">
                            <h3 className="text-lg font-bold">
                                Need Help?
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-blue-100">
                                Having issues purchasing data? Our support team is available 24/7 to help you resolve any transaction quickly.
                            </p>

                            <button className="mt-5 w-full rounded-xl bg-white py-3 font-semibold text-blue-700 transition hover:bg-blue-50">
                                Contact Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}