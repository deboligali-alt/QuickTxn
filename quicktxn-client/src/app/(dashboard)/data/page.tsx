"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Wifi,
    ShieldCheck,
    CheckCircle2,
    Phone,
    Lock,
    Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import NetworkLogo from "@/components/ui/NetworkLogo";
import {
    getDataPlans,
    purchaseData,
} from "@/services/data.service";

interface DataPlan {
    network: string;
    plan_name: string;
    plan_code: string;
    amount: number | string;
}

interface PurchaseResponse {
    success: boolean;
    message: string;
    data?: {
        network: string;
        plan: string;
        planCode: string;
        amount: number | string;
        phoneNumber: string;
        reference: string;
        provider: string;
        providerReference: string;
        status: string;
    };
}

const networks = [
    {
        name: "MTN",
        value: "MTN",
    },
    {
        name: "Glo",
        value: "GLO",
    },
    {
        name: "Airtel",
        value: "AIRTEL",
    },
    {
        name: "9mobile",
        value: "9MOBILE",
    },
];

export default function DataPage() {

    const router = useRouter();

    const [network, setNetwork] = useState("");

    const [phone, setPhone] = useState("");

    const [pin, setPin] = useState("");

    const [plans, setPlans] = useState<DataPlan[]>([]);

    const [loadingPlans, setLoadingPlans] =
        useState(true);

    const [loading, setLoading] =
        useState(false);

    const [selectedPlanCode, setSelectedPlanCode] =
        useState<string | null>(null);

    // ========================================
    // Load real plans from backend
    // ========================================
    useEffect(() => {

        const loadPlans = async () => {

            try {

                setLoadingPlans(true);

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    toast.error(
                        "Please login again."
                    );
                    return;
                }

                const response =
                    await getDataPlans(token);

                if (!response?.success) {
                    throw new Error(
                        response?.message ||
                        "Unable to load data plans."
                    );
                }

                setPlans(response.data || []);

            } catch (error: any) {

                console.error(
                    "Load data plans error:",
                    error
                );

                toast.error(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to load data plans."
                );

            } finally {

                setLoadingPlans(false);

            }
        };

        loadPlans();

    }, []);

    // ========================================
    // Plans for selected network
    // ========================================
    const currentPlans = useMemo(() => {

        return plans
            .filter(
                (plan) =>
                    plan.network ===
                    network
            )
            .sort(
                (a, b) =>
                    Number(a.amount) -
                    Number(b.amount)
            );

    }, [plans, network]);

    // ========================================
    // Selected plan
    // ========================================
    const selectedPlanData =
        currentPlans.find(
            (plan) =>
                plan.plan_code ===
                selectedPlanCode
        ) || null;

    // ========================================
    // Change network
    // ========================================
    const handleNetworkChange = (
        value: string
    ) => {

        setNetwork(value);

        setSelectedPlanCode(null);

    };

    // ========================================
    // Purchase
    // ========================================
    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (!network) {
            toast.error(
                "Please select a network."
            );
            return;
        }

        if (
            !phone ||
            phone.length !== 11
        ) {
            toast.error(
                "Please enter a valid 11-digit phone number."
            );
            return;
        }

        if (!selectedPlanData) {
            toast.error(
                "Please select a data plan."
            );
            return;
        }

        if (
            !pin ||
            pin.length !== 4
        ) {
            toast.error(
                "Please enter your 4-digit transaction PIN."
            );
            return;
        }

        try {

            setLoading(true);

            const token =
                localStorage.getItem("token");

            if (!token) {
                toast.error(
                    "Please login again."
                );
                return;
            }

            const response: PurchaseResponse =
                await purchaseData(
                    token,
                    {
                        network,
                        planCode:
                            selectedPlanData.plan_code,
                        phoneNumber:
                            phone,
                        pin,
                    }
                );

            if (!response?.success) {

                throw new Error(
                    response?.message ||
                    "Data purchase failed."
                );
            }

            toast.success(
                response.message ||
                "Data purchased successfully."
            );

            // Clear sensitive/input fields
            setPin("");
            setSelectedPlanCode(null);

            // Show reference
            if (response.data?.reference) {

                toast.success(
                    `Reference: ${response.data.reference}`,
                    {
                        duration: 6000,
                    }
                );

            }

        } catch (error: any) {

            console.error(
                "Data purchase error:",
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Unable to purchase data.";

            toast.error(message);

        } finally {

            setLoading(false);

        }
    };

    return (
        <main className="min-h-full bg-slate-50">

            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

                {/* BACK */}

                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-green-600"
                >
                    <ArrowLeft size={17} />
                    Back
                </button>

                {/* HEADER */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="mb-8"
                >

                    <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                            <Wifi size={28} />
                        </div>

                        <div>

                            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                                Buy Data
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 sm:text-base">
                                Purchase affordable data bundles
                                for any Nigerian network.
                            </p>

                        </div>

                    </div>

                </motion.div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* FORM */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 25,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        className="lg:col-span-2"
                    >

                        <form
                            onSubmit={handleSubmit}
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                        >

                            <h2 className="text-xl font-bold text-slate-900">
                                Data Purchase
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Select a network, recipient and
                                data plan.
                            </p>

                            {/* NETWORK */}

                            <div className="mt-7">

                                <label className="mb-3 block text-sm font-semibold text-slate-700">
                                    Select Network
                                </label>

                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

                                    {networks.map(
                                        (item) => (

                                            <button
                                                key={item.value}
                                                type="button"
                                                onClick={() =>
                                                    handleNetworkChange(
                                                        item.value
                                                    )
                                                }
                                                className={`relative rounded-2xl border-2 p-4 transition-all duration-200 ${
                                                    network ===
                                                    item.value
                                                        ? "border-green-600 bg-green-50 shadow-md"
                                                        : "border-slate-200 bg-white hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
                                                }`}
                                            >

                                                {network ===
                                                    item.value && (
                                                    <div className="absolute right-2 top-2">
                                                        <CheckCircle2
                                                            size={18}
                                                            className="text-green-600"
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex flex-col items-center">

                                                    <NetworkLogo
                                                        network={
                                                            item.value
                                                        }
                                                        size="lg"
                                                    />

                                                    <p
                                                        className={`mt-3 font-bold ${
                                                            network ===
                                                            item.value
                                                                ? "text-green-700"
                                                                : "text-slate-800"
                                                        }`}
                                                    >
                                                        {
                                                            item.name
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Data Network
                                                    </p>

                                                </div>

                                            </button>

                                        )
                                    )}

                                </div>

                            </div>

                            {/* PHONE */}

                            <div className="mt-7">

                                <label
                                    htmlFor="phone"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Phone Number
                                </label>

                                <div className="relative">

                                    <Phone
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="phone"
                                        type="tel"
                                        inputMode="numeric"
                                        placeholder="08012345678"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            )
                                        }
                                        maxLength={11}
                                        className="w-full rounded-xl border border-slate-300 py-4 pl-12 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                        required
                                    />

                                </div>

                            </div>

                            {/* DATA PLANS */}

                            <div className="mt-7">

                                <div className="mb-3 flex items-center justify-between">

                                    <label className="text-sm font-semibold text-slate-700">
                                        Select Data Plan
                                    </label>

                                    {selectedPlanData && (
                                        <span className="text-sm font-bold text-green-600">
                                            ₦
                                            {Number(
                                                selectedPlanData.amount
                                            ).toLocaleString(
                                                "en-NG",
                                                {
                                                    minimumFractionDigits: 2,
                                                }
                                            )}
                                        </span>
                                    )}

                                </div>

                                {!network ? (

                                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">

                                        <Wifi
                                            size={30}
                                            className="mx-auto text-slate-400"
                                        />

                                        <p className="mt-3 font-semibold text-slate-700">
                                            Select a network first
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Available data plans
                                            will appear here.
                                        </p>

                                    </div>

                                ) : loadingPlans ? (

                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-10 text-center">

                                        <p className="font-semibold text-slate-700">
                                            Loading data plans...
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Getting the latest plans.
                                        </p>

                                    </div>

                                ) : currentPlans.length === 0 ? (

                                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">

                                        <Wifi
                                            size={30}
                                            className="mx-auto text-slate-400"
                                        />

                                        <p className="mt-3 font-semibold text-slate-700">
                                            No plans available
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            There are currently no active plans
                                            for this network.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="grid max-h-[520px] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">

                                        {currentPlans.map(
                                            (plan) => (

                                                <button
                                                    key={`${plan.network}-${plan.plan_code}`}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedPlanCode(
                                                            plan.plan_code
                                                        )
                                                    }
                                                    className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                                                        selectedPlanCode ===
                                                        plan.plan_code
                                                            ? "border-green-600 bg-green-50 ring-2 ring-green-100"
                                                            : "border-slate-200 hover:border-green-400 hover:bg-slate-50"
                                                    }`}
                                                >

                                                    <div className="flex min-w-0 items-center gap-3">

                                                        <div
                                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                                                selectedPlanCode ===
                                                                plan.plan_code
                                                                    ? "bg-green-600 text-white"
                                                                    : "bg-green-100 text-green-600"
                                                            }`}
                                                        >
                                                            <Wifi
                                                                size={20}
                                                            />
                                                        </div>

                                                        <div className="min-w-0">

                                                            <p className="font-bold text-slate-900">
                                                                {
                                                                    plan.plan_name
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-slate-500">
                                                                {
                                                                    plan.plan_code
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>

                                                    <div className="ml-3 shrink-0 text-right">

                                                        <p className="font-bold text-slate-900">
                                                            ₦
                                                            {Number(
                                                                plan.amount
                                                            ).toLocaleString(
                                                                "en-NG",
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                }
                                                            )}
                                                        </p>

                                                        {selectedPlanCode ===
                                                            plan.plan_code && (
                                                            <CheckCircle2
                                                                size={18}
                                                                className="ml-auto mt-1 text-green-600"
                                                            />
                                                        )}

                                                    </div>

                                                </button>

                                            )
                                        )}

                                    </div>

                                )}

                            </div>

                            {/* PIN */}

                            <div className="mt-7">

                                <label
                                    htmlFor="pin"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Transaction PIN
                                </label>

                                <div className="relative">

                                    <Lock
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="pin"
                                        type="password"
                                        inputMode="numeric"
                                        maxLength={4}
                                        placeholder="••••"
                                        value={pin}
                                        onChange={(e) =>
                                            setPin(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-300 py-4 pl-12 pr-4 tracking-[0.5em] outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                        required
                                    />

                                </div>

                            </div>

                            {/* TOTAL */}

                            {selectedPlanData && (

                                <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 p-5">

                                    <div>

                                        <span className="font-medium text-slate-600">
                                            Total
                                        </span>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {
                                                networks.find(
                                                    (item) =>
                                                        item.value ===
                                                        network
                                                )?.name
                                            }{" "}
                                            Data
                                        </p>

                                    </div>

                                    <span className="text-2xl font-extrabold text-slate-900">
                                        ₦
                                        {Number(
                                            selectedPlanData.amount
                                        ).toLocaleString(
                                            "en-NG",
                                            {
                                                minimumFractionDigits: 2,
                                            }
                                        )}
                                    </span>

                                </div>

                            )}

                            {/* SUBMIT */}

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    loadingPlans ||
                                    !selectedPlanData
                                }
                                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >

                                <Zap size={19} />

                                {loading
                                    ? "Processing..."
                                    : "Buy Data"}

                            </button>

                        </form>

                    </motion.div>

                    {/* SIDE */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 20,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            delay: 0.15,
                        }}
                        className="space-y-5"
                    >

                        {/* SELECTED NETWORK */}

                        {network && (

                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                                <p className="text-sm font-semibold text-slate-500">
                                    Selected Network
                                </p>

                                <div className="mt-4 flex items-center gap-4">

                                    <NetworkLogo
                                        network={network}
                                        size="lg"
                                    />

                                    <div>

                                        <h2 className="text-xl font-bold text-slate-900">
                                            {
                                                networks.find(
                                                    (item) =>
                                                        item.value ===
                                                        network
                                                )?.name
                                            }
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {
                                                currentPlans.length
                                            }{" "}
                                            data plans available
                                        </p>

                                    </div>

                                </div>

                            </div>

                        )}

                        {/* SECURITY */}

                        <div className="rounded-3xl bg-gradient-to-br from-green-700 to-emerald-500 p-6 text-white shadow-lg">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                                <ShieldCheck size={25} />
                            </div>

                            <h2 className="mt-5 text-xl font-bold">
                                Secure Purchase
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-green-50">
                                Your data purchase is protected
                                by your QuickTxn transaction PIN.
                            </p>

                        </div>

                        {/* HOW IT WORKS */}

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-bold text-slate-900">
                                How it works
                            </h2>

                            <div className="mt-5 space-y-5">

                                <div className="flex gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                                        1
                                    </div>

                                    <div>

                                        <p className="font-semibold text-slate-900">
                                            Select network
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Choose MTN, Glo, Airtel
                                            or 9mobile.
                                        </p>

                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                                        2
                                    </div>

                                    <div>

                                        <p className="font-semibold text-slate-900">
                                            Choose a plan
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Select from the latest
                                            available data bundles.
                                        </p>

                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                                        3
                                    </div>

                                    <div>

                                        <p className="font-semibold text-slate-900">
                                            Confirm purchase
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Enter your PIN and
                                            complete the purchase.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </motion.div>

                </div>

            </div>

        </main>
    );
}