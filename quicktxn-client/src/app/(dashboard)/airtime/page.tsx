"use client";
import { buyAirtime } from "@/services/airtime.service";
import NetworkLogo from "@/components/ui/NetworkLogo";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Smartphone,
    ShieldCheck,
    CheckCircle2,
    Phone,
    Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const networks = [
    {
        name: "MTN",
        value: "MTN",
        color: "yellow",
    },
    {
        name: "Glo",
        value: "GLO",
        color: "green",
    },
    {
        name: "Airtel",
        value: "AIRTEL",
        color: "red",
    },
    {
        name: "9mobile",
        value: "9MOBILE",
        color: "emerald",
    },
];


const quickAmounts = [
    100,
    200,
    500,
    1000,
    2000,
];

export default function AirtimePage() {
    const router = useRouter();

    const [network, setNetwork] = useState("");
    const [phone, setPhone] = useState("");
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!network) {
            toast.error("Please select a network.");
            return;
        }

        if (!phone || phone.length < 10) {
            toast.error(
                "Please enter a valid phone number."
            );
            return;
        }

        if (!amount || Number(amount) <= 0) {
            toast.error(
                "Please enter a valid airtime amount."
            );
            return;
        }

        if (!pin || pin.length !== 4) {
            toast.error(
                "Please enter your 4-digit transaction PIN."
            );
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login again.");
                return;
            }

            const response = await buyAirtime(token, {
                network,
                phoneNumber: phone,
                amount: Number(amount),
                pin,
            });

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    "Airtime purchase failed."
                );
            }

            toast.success(
                response.message ||
                "Airtime purchased successfully."
            );

            if (response.data?.reference) {
                toast.success(
                    `Reference: ${response.data.reference}`,
                    {
                        duration: 6000,
                    }
                );
            }

            // Clear PIN after successful purchase
            setPin("");
        } catch (error) {
            console.error(error);

            toast.error(
                "Unable to purchase airtime."
            );
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
                            <Smartphone size={28} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                                Buy Airtime
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 sm:text-base">
                                Recharge any Nigerian mobile
                                network instantly.
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
                                Airtime Details
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Enter the number and amount you
                                want to recharge.
                            </p>

                            {/* NETWORK */}

                            <div className="mt-7">

                                <label className="mb-3 block text-sm font-semibold text-slate-700">
                                    Select Network
                                </label>

                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    {networks.map((item) => (
                                        <button
                                            key={item.value}
                                            type="button"
                                            onClick={() => setNetwork(item.value)}
                                            className={`relative rounded-2xl border-2 p-4 transition-all duration-200 ${network === item.value
                                                ? "border-green-600 bg-green-50 shadow-md"
                                                : "border-slate-200 bg-white hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
                                                }`}
                                        >
                                            {/* Selected indicator */}
                                            {network === item.value && (
                                                <div className="absolute right-2 top-2">
                                                    <CheckCircle2
                                                        size={18}
                                                        className="text-green-600"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex flex-col items-center">

                                                {/* Network Logo */}
                                                <NetworkLogo
                                                    network={item.value}
                                                    size="lg"
                                                />

                                                {/* Network Name */}
                                                <p
                                                    className={`mt-3 font-bold ${network === item.value
                                                        ? "text-green-700"
                                                        : "text-slate-800"
                                                        }`}
                                                >
                                                    {item.name}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    Mobile Network
                                                </p>

                                            </div>
                                        </button>
                                    ))}
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

                            {/* AMOUNT */}

                            <div className="mt-7">

                                <label
                                    htmlFor="amount"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Amount
                                </label>

                                <div className="relative">

                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-500">
                                        ₦
                                    </span>

                                    <input
                                        id="amount"
                                        type="number"
                                        min="50"
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(
                                                e.target.value
                                            )
                                        }
                                        placeholder="0"
                                        className="w-full rounded-xl border border-slate-300 py-4 pl-10 pr-4 text-lg font-semibold outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                        required
                                    />

                                </div>

                            </div>

                            {/* QUICK AMOUNTS */}

                            <div className="mt-5">

                                <p className="mb-3 text-sm font-semibold text-slate-700">
                                    Quick Amount
                                </p>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">

                                    {quickAmounts.map(
                                        (quickAmount) => (
                                            <button
                                                key={
                                                    quickAmount
                                                }
                                                type="button"
                                                onClick={() =>
                                                    setAmount(
                                                        String(
                                                            quickAmount
                                                        )
                                                    )
                                                }
                                                className={`rounded-xl border py-3 text-sm font-semibold transition ${Number(
                                                    amount
                                                ) ===
                                                    quickAmount
                                                    ? "border-green-600 bg-green-50 text-green-700"
                                                    : "border-slate-200 text-slate-700 hover:border-green-400 hover:bg-green-50"
                                                    }`}
                                            >
                                                ₦
                                                {quickAmount.toLocaleString(
                                                    "en-NG"
                                                )}
                                            </button>
                                        )
                                    )}

                                </div>

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

                            {/* SUBMIT */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-7 w-full rounded-xl bg-green-600 py-4 font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                                {loading
                                    ? "Processing..."
                                    : "Buy Airtime"}
                            </button>

                        </form>
                    </motion.div>

                    {/* SIDE INFORMATION */}

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

                        {/* SECURITY */}

                        <div className="rounded-3xl bg-gradient-to-br from-green-700 to-emerald-500 p-6 text-white shadow-lg">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                                <ShieldCheck size={25} />
                            </div>

                            <h2 className="mt-5 text-xl font-bold">
                                Secure Recharge
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-green-50">
                                Airtime purchases are protected
                                by your QuickTxn transaction PIN.
                            </p>

                        </div>

                        {/* SUPPORTED NETWORKS */}

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-bold text-slate-900">
                                Supported Networks
                            </h2>

                            <div className="mt-5 space-y-3">

                                {networks.map((item) => (
                                    <div
                                        key={item.value}
                                        className="flex items-center justify-between rounded-xl bg-slate-50 p-3 transition hover:bg-slate-100"
                                    >
                                        <div className="flex items-center gap-3">

                                            <NetworkLogo
                                                network={item.value}
                                                size="sm"
                                            />

                                            <div>
                                                <p className="font-semibold text-slate-800">
                                                    {item.name}
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    Available
                                                </p>
                                            </div>

                                        </div>

                                        <CheckCircle2
                                            size={18}
                                            className="text-green-600"
                                        />
                                    </div>
                                ))}

                            </div>

                        </div>

                    </motion.div>

                </div>

            </div>

        </main>
    );
}