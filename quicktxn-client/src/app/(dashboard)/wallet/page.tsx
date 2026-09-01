"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    Wallet as WalletIcon,
    Plus,
    ArrowUpRight,
    ArrowDownLeft,
    Building2,
    RefreshCcw,
    ShieldCheck,
    CreditCard,
    Eye,
    EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { getWallet } from "@/services/wallet.service";

interface WalletData {
    balance: number;
}

export default function WalletPage() {
    const [wallet, setWallet] = useState<WalletData | null>(
        null
    );

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showBalance, setShowBalance] = useState(true);

    const loadWallet = useCallback(
        async (refresh = false) => {
            try {
                if (refresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    toast.error("Please login first.");
                    return;
                }

                const response = await getWallet(token);

                setWallet(
                    response.data || response.wallet || null
                );
            } catch (error) {
                console.error(error);

                if (axios.isAxiosError(error)) {
                    toast.error(
                        error.response?.data?.message ||
                        "Unable to load wallet."
                    );
                } else {
                    toast.error(
                        "Unable to load wallet."
                    );
                }
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );

    useEffect(() => {
        loadWallet();
    }, [loadWallet]);

    const balance = Number(
        wallet?.balance || 0
    );

    const formattedBalance =
        balance.toLocaleString("en-NG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50">
                <div className="mx-auto w-full max-w-5xl animate-pulse px-4 py-6 sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        <div className="h-10 w-48 rounded-xl bg-slate-200" />
                        <div className="h-64 rounded-3xl bg-slate-200" />
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                            <div className="h-32 rounded-2xl bg-slate-200" />
                            <div className="h-32 rounded-2xl bg-slate-200" />
                            <div className="h-32 rounded-2xl bg-slate-200" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6 lg:px-8 pb-24">

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
                    className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-green-600">
                            QuickTxn Wallet
                        </p>

                        <h1 className="mt-1 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                            My Wallet
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            Manage your balance and move money
                            securely.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            loadWallet(true)
                        }
                        disabled={refreshing}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
                    >
                        <RefreshCcw
                            size={17}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Refresh Balance
                    </button>
                </motion.div>

                {/* BALANCE CARD */}

                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.98,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-5 text-white shadow-lg sm:p-6"
                >
                    {/* Decorative shapes */}

                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

                    <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl" />

                    <div className="relative z-10">

                        <div className="flex items-start justify-between">

                            <div className="flex items-center gap-3">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                                    <WalletIcon size={25} />
                                </div>

                                <div>
                                    <p className="text-sm text-green-100">
                                        Available Balance
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-white/80">
                                        QuickTxn Wallet
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowBalance(
                                        !showBalance
                                    )
                                }
                                className="rounded-xl bg-white/10 p-3 transition hover:bg-white/20"
                                aria-label={
                                    showBalance
                                        ? "Hide balance"
                                        : "Show balance"
                                }
                            >
                                {showBalance ? (
                                    <Eye size={20} />
                                ) : (
                                    <EyeOff size={20} />
                                )}
                            </button>

                        </div>

                        <div className="mt-10">

                            <p className="text-sm text-green-100">
                                Wallet Balance
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                                {showBalance
                                    ? `₦${formattedBalance}`
                                    : "₦••••••"}
                            </h2>

                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">

                            <Link
                                href="/wallet/fund"
                                className="flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                            >
                                <Plus size={19} />
                                Fund Wallet
                            </Link>

                            <Link
                                href="/transfer"
                                className="flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                            >
                                <ArrowUpRight size={19} />
                                Send Money
                            </Link>

                        </div>

                    </div>
                </motion.div>

                {/* ACTION CARDS */}

                <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">

                    {/* FUND */}

                    <Link
                        href="/wallet/fund"
                        className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                <ArrowDownLeft size={23} />
                            </div>

                            <ArrowUpRight
                                size={19}
                                className="text-slate-300 transition group-hover:text-green-600"
                            />

                        </div>

                        <h3 className="mt-5 text-lg font-bold text-slate-900">
                            Fund Wallet
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Add money to your QuickTxn wallet
                            securely.
                        </p>
                    </Link>

                    {/* QUICKTXN TRANSFER */}

                    <Link
                        href="/transfer"
                        className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <ArrowUpRight size={23} />
                            </div>

                            <ArrowUpRight
                                size={19}
                                className="text-slate-300 transition group-hover:text-blue-600"
                            />

                        </div>

                        <h3 className="mt-5 text-lg font-bold text-slate-900">
                            Send Money
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Transfer money to another QuickTxn
                            user.
                        </p>
                    </Link>

                    {/* BANK TRANSFER */}

                    <Link
                        href="/wallet/bank-transfer"
                        className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                                <Building2 size={23} />
                            </div>

                            <ArrowUpRight
                                size={19}
                                className="text-slate-300 transition group-hover:text-purple-600"
                            />

                        </div>

                        <h3 className="mt-5 text-lg font-bold text-slate-900">
                            Bank Transfer
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Transfer money directly to a bank
                            account.
                        </p>
                    </Link>

                </div>

                {/* INFORMATION SECTION */}

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* SECURITY */}

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

                        <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                <ShieldCheck size={24} />
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Wallet Security
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Keep your account protected.
                                </p>
                            </div>

                        </div>

                        <div className="mt-6 space-y-4">

                            <div className="flex gap-3">
                                <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />

                                <p className="text-sm leading-6 text-slate-600">
                                    Never share your transaction
                                    PIN with anyone.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />

                                <p className="text-sm leading-6 text-slate-600">
                                    Always confirm recipient
                                    details before sending money.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />

                                <p className="text-sm leading-6 text-slate-600">
                                    Contact support if you notice
                                    suspicious account activity.
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* WALLET MANAGEMENT */}

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

                        <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <CreditCard size={24} />
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Wallet Management
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Manage your wallet activity.
                                </p>
                            </div>

                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">

                            <Link
                                href="/transactions"
                                className="rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
                            >
                                <p className="text-sm font-bold text-slate-900">
                                    Transactions
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    View history
                                </p>
                            </Link>

                            <Link
                                href="/beneficiaries"
                                className="rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
                            >
                                <p className="text-sm font-bold text-slate-900">
                                    Beneficiaries
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Manage accounts
                                </p>
                            </Link>

                            <Link
                                href="/settings/security"
                                className="rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
                            >
                                <p className="text-sm font-bold text-slate-900">
                                    Transaction PIN
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Create & Manage your PIN
                                </p>
                            </Link>

                            <Link
                                href="/settings"
                                className="rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50"
                            >
                                <p className="text-sm font-bold text-slate-900">
                                    Settings
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Account settings
                                </p>
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
}