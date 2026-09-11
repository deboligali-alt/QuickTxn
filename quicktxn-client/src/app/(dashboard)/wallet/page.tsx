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
    Copy,
    Landmark,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { getWallet } from "@/services/wallet.service";

interface WalletData {
    balance: number;
}

interface VirtualAccount {
    account_name: string;
    account_number: string;
    bank_name: string;
    bank_code: string;
    status: string;
}

export default function WalletPage() {
    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [account, setAccount] = useState<VirtualAccount | null>(null);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showBalance, setShowBalance] = useState(true);

    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

    // ----------------------------
    // Load Wallet
    // ----------------------------
    const loadWallet = useCallback(async (refresh = false) => {
        try {
            if (refresh) setRefreshing(true);
            else setLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login first.");
                return;
            }

            const response = await getWallet(token);

            setWallet(response.data || response.wallet || null);
        } catch (error) {
            console.error(error);
            toast.error("Unable to load wallet.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // ----------------------------
    // Load/Create Virtual Account
    // ----------------------------
    const loadVirtualAccount = useCallback(async () => {
        try {
            if (!token) return;

            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/monnify/account`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAccount(res.data.data);
        } catch (err: any) {
            if (err.response?.status === 404) {
                const created = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/monnify/create-account`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setAccount(created.data.data);
            }
        }
    }, [token]);

    useEffect(() => {
        loadWallet();
        loadVirtualAccount();
    }, [loadWallet, loadVirtualAccount]);

    const copyNumber = async () => {
        if (!account) return;

        await navigator.clipboard.writeText(account.account_number);
        toast.success("Account number copied!");
    };

    const balance = Number(wallet?.balance || 0);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                Loading wallet...
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-5xl p-5 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-green-600 font-semibold">
                            QuickTxn Wallet
                        </p>
                        <h1 className="text-3xl font-bold">
                            My Wallet
                        </h1>
                    </div>

                    <button
                        onClick={() => loadWallet(true)}
                        className="border rounded-xl px-4 py-2 flex items-center gap-2"
                    >
                        <RefreshCcw
                            size={18}
                            className={refreshing ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>
                </div>

                {/* Balance */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white"
                >
                    <div className="flex justify-between">
                        <div>
                            <p>Available Balance</p>

                            <h2 className="text-4xl font-bold mt-2">
                                {showBalance
                                    ? `₦${balance.toLocaleString("en-NG", {
                                        minimumFractionDigits: 2,
                                    })}`
                                    : "₦••••••"}
                            </h2>
                        </div>

                        <button
                            onClick={() => setShowBalance(!showBalance)}
                        >
                            {showBalance ? (
                                <Eye size={22} />
                            ) : (
                                <EyeOff size={22} />
                            )}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <Link
                            href="/wallet/fund"
                            className="bg-white text-green-700 rounded-xl py-3 flex justify-center items-center gap-2 font-semibold"
                        >
                            <Plus size={18} />
                            Fund Wallet
                        </Link>

                        <Link
                            href="/transfer"
                            className="border border-white rounded-xl py-3 flex justify-center items-center gap-2"
                        >
                            <ArrowUpRight size={18} />
                            Send
                        </Link>
                    </div>
                </motion.div>

                {/* Permanent Virtual Account */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <Landmark className="text-green-600" />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold">
                                Permanent Funding Account
                            </h2>
                            <p className="text-sm text-gray-500">
                                Powered by Monnify
                            </p>
                        </div>
                    </div>

                    {account ? (
                        <>
                            <div className="bg-green-50 rounded-2xl p-5 space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Bank
                                    </p>
                                    <h3 className="font-semibold text-lg">
                                        {account.bank_name}
                                    </h3>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Account Number
                                    </p>

                                    <div className="flex justify-between items-center mt-1">
                                        <h1 className="text-3xl font-bold tracking-widest">
                                            {account.account_number}
                                        </h1>

                                        <button
                                            onClick={copyNumber}
                                            className="bg-green-600 text-white p-3 rounded-xl"
                                        >
                                            <Copy size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Account Name
                                    </p>

                                    <h3 className="font-semibold uppercase">
                                        {account.account_name}
                                    </h3>
                                </div>
                            </div>

                            <p className="text-sm text-gray-500 mt-4">
                                Any transfer to this account automatically
                                credits your QuickTxn wallet.
                            </p>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            Creating your permanent account...
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        href="/transactions"
                        className="bg-white rounded-2xl p-5 border text-center"
                    >
                        <CreditCard className="mx-auto mb-3 text-blue-600" />
                        <p className="font-semibold">
                            Transactions
                        </p>
                    </Link>

                    <Link
                        href="/beneficiaries"
                        className="bg-white rounded-2xl p-5 border text-center"
                    >
                        <Building2 className="mx-auto mb-3 text-purple-600" />
                        <p className="font-semibold">
                            Beneficiaries
                        </p>
                    </Link>

                    <Link
                        href="/settings/pin"
                        className="bg-white rounded-2xl p-5 border text-center"
                    >
                        <ShieldCheck className="mx-auto mb-3 text-green-600" />
                        <p className="font-semibold">
                            Transaction PIN
                        </p>
                    </Link>

                    <Link
                        href="/settings"
                        className="bg-white rounded-2xl p-5 border text-center"
                    >
                        <WalletIcon className="mx-auto mb-3 text-slate-700" />
                        <p className="font-semibold">
                            Settings
                        </p>
                    </Link>
                </div>
            </div>
        </main>
    );
}