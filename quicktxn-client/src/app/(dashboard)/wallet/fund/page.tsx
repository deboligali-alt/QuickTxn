"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
    ArrowLeft,
    CreditCard,
    ShieldCheck,
    Wallet,
    CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { fundWallet } from "@/services/wallet.service";

const QUICK_AMOUNTS = [
    1000,
    2000,
    5000,
    10000,
    20000,
];

export default function FundWalletPage() {
    const router = useRouter();

    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const numericAmount = Number(amount);

    const handleFund = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!amount || numericAmount <= 0) {
            toast.error(
                "Please enter a valid amount."
            );
            return;
        }

        if (numericAmount < 100) {
            toast.error(
                "Minimum funding amount is ₦100."
            );
            return;
        }

        try {
            setLoading(true);

            const token =
                localStorage.getItem("token");

            if (!token) {
                toast.error(
                    "Your session has expired. Please login again."
                );

                router.replace("/login");
                return;
            }

            const response = await fundWallet(
                token,
                numericAmount
            );

            const authorizationUrl =
                response?.data?.authorization_url;

            if (!authorizationUrl) {
                toast.error(
                    "Unable to create payment session."
                );
                return;
            }

            toast.success(
                "Payment initialized. Redirecting..."
            );

            window.location.href =
                authorizationUrl;
        } catch (error: unknown) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ||
                    "Unable to initialize payment."
                );
            } else {
                toast.error(
                    "Unable to initialize payment."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-full bg-slate-50">

            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

                {/* BACK */}

                <button
                    type="button"
                    onClick={() =>
                        router.push("/wallet")
                    }
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-green-600"
                >
                    <ArrowLeft size={17} />
                    Back to Wallet
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
                            <Wallet size={28} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                                Fund Wallet
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 sm:text-base">
                                Add money to your QuickTxn wallet
                                securely.
                            </p>
                        </div>

                    </div>
                </motion.div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* =================================
                        FUNDING FORM
                    ================================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 25,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.1,
                        }}
                        className="lg:col-span-2"
                    >
                        <form
                            onSubmit={handleFund}
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                        >

                            <div className="mb-7">
                                <h2 className="text-xl font-bold text-slate-900">
                                    Enter Funding Amount
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Choose an amount or enter your
                                    preferred amount below.
                                </p>
                            </div>

                            {/* AMOUNT */}

                            <div>
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
                                        min="100"
                                        step="1"
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(
                                                e.target.value
                                            )
                                        }
                                        placeholder="0.00"
                                        className="w-full rounded-xl border border-slate-300 py-4 pl-10 pr-4 text-xl font-semibold text-slate-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                        required
                                    />

                                </div>

                                <p className="mt-2 text-xs text-slate-400">
                                    Minimum funding amount: ₦100
                                </p>
                            </div>

                            {/* QUICK AMOUNTS */}

                            <div className="mt-7">

                                <p className="mb-3 text-sm font-semibold text-slate-700">
                                    Quick Amount
                                </p>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">

                                    {QUICK_AMOUNTS.map(
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
                                                className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${Number(
                                                    amount
                                                ) ===
                                                        quickAmount
                                                        ? "border-green-600 bg-green-50 text-green-700"
                                                        : "border-slate-200 bg-white text-slate-700 hover:border-green-400 hover:bg-green-50"
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

                            {/* PAYMENT METHOD */}

                            <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-4">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm">
                                        <CreditCard
                                            size={22}
                                        />
                                    </div>

                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            Paystack
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            Secure online payment
                                        </p>
                                    </div>

                                    <CheckCircle2
                                        size={20}
                                        className="ml-auto text-green-600"
                                    />

                                </div>

                            </div>

                            {/* SUBMIT */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                                <CreditCard size={19} />

                                {loading
                                    ? "Redirecting to Paystack..."
                                    : "Proceed to Paystack"}
                            </button>

                        </form>
                    </motion.div>

                    {/* =================================
                        INFORMATION
                    ================================== */}

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
                            delay: 0.2,
                        }}
                        className="space-y-5"
                    >

                        {/* SECURITY */}

                        <div className="rounded-3xl bg-gradient-to-br from-green-700 to-emerald-500 p-6 text-white shadow-lg">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                                <ShieldCheck
                                    size={25}
                                />
                            </div>

                            <h2 className="mt-5 text-xl font-bold">
                                Secure Funding
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-green-50">
                                Your payment is processed through
                                Paystack. QuickTxn does not store
                                your card details.
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
                                            Enter amount
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Select or enter the amount
                                            you want to add.
                                        </p>
                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                                        2
                                    </div>

                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            Complete payment
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            You'll be redirected to
                                            Paystack.
                                        </p>
                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                                        3
                                    </div>

                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            Wallet credited
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            After successful payment,
                                            your wallet will be updated.
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