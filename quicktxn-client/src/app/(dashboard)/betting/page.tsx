"use client";

import axios from "axios";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    CheckCircle2,
    CircleDollarSign,
    LockKeyhole,
    RefreshCcw,
    ShieldCheck,
    Trophy,
    UserRound,
    Zap,
} from "lucide-react";

import {
    getBettingProviders,
    fundBettingWallet,
    getBettingHistory,
} from "@/services/betting.service";

interface BettingProvider {
    provider_name: string;
    provider_code: string;
}

interface BettingFunding {
    provider_name: string;
    betting_user_id: string;
    amount: number;
    status: string;
    reference: string;
    created_at: string;
}

const providerStyles: Record<
    string,
    {
        short: string;
        active: string;
        icon: string;
    }
> = {
    SPORTYBET: {
        short: "S",
        active:
            "border-blue-500 bg-blue-50 text-blue-700",
        icon: "bg-blue-600 text-white",
    },

    BET9JA: {
        short: "B",
        active:
            "border-green-500 bg-green-50 text-green-700",
        icon: "bg-green-600 text-white",
    },

    BETKING: {
        short: "BK",
        active:
            "border-yellow-400 bg-yellow-50 text-yellow-800",
        icon: "bg-yellow-400 text-yellow-950",
    },

    "1XBET": {
        short: "1X",
        active:
            "border-blue-600 bg-blue-50 text-blue-700",
        icon: "bg-blue-700 text-white",
    },
};

const quickAmounts = [
    500,
    1000,
    2000,
    5000,
    10000,
];

export default function BettingPage() {
    const [providers, setProviders] =
        useState<BettingProvider[]>([]);

    const [providerCode, setProviderCode] =
        useState("");

    const [bettingUserId, setBettingUserId] =
        useState("");

    const [amount, setAmount] =
        useState("");

    const [pin, setPin] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [providersLoading, setProvidersLoading] =
        useState(true);

    // Betting history
    const [history, setHistory] =
        useState<BettingFunding[]>([]);

    const [historyLoading, setHistoryLoading] =
        useState(true);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    // ========================================
    // Load Betting Providers
    // ========================================

    const loadProviders = useCallback(
        async () => {
            try {
                setProvidersLoading(true);

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    setErrorMessage(
                        "Please login to continue."
                    );
                    return;
                }

                const response =
                    await getBettingProviders(token);

                const data =
                    response.data || [];

                setProviders(data);

                if (data.length > 0) {
                    setProviderCode(
                        data[0].provider_code
                    );
                }
            } catch (error) {
                console.error(error);

                if (
                    axios.isAxiosError(error)
                ) {
                    setErrorMessage(
                        error.response?.data
                            ?.message ||
                        "Unable to load betting providers."
                    );
                } else {
                    setErrorMessage(
                        "Unable to load betting providers."
                    );
                }
            } finally {
                setProvidersLoading(false);
            }
        },
        []
    );

    // ========================================
    // Load Betting History
    // ========================================

    const loadHistory = useCallback(
        async () => {
            try {
                setHistoryLoading(true);

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    return;
                }

                const response =
                    await getBettingHistory(token);

                setHistory(
                    response.data || []
                );
            } catch (error) {
                console.error(
                    "Failed to load betting history:",
                    error
                );
            } finally {
                setHistoryLoading(false);
            }
        },
        []
    );

    // ========================================
    // Load Data
    // ========================================

    useEffect(() => {
        loadProviders();
        loadHistory();
    }, [loadProviders, loadHistory]);

    // ========================================
    // Selected Provider
    // ========================================

    const selectedProvider = useMemo(() => {
        return providers.find(
            (provider) =>
                provider.provider_code ===
                providerCode
        );
    }, [providers, providerCode]);

    // ========================================
    // Numeric Amount
    // ========================================

    const numericAmount = useMemo(() => {
        return Number(amount || 0);
    }, [amount]);

    // ========================================
    // Submit Betting Funding
    // ========================================

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");

        if (!providerCode) {
            setErrorMessage(
                "Please select a betting provider."
            );
            return;
        }

        if (!bettingUserId.trim()) {
            setErrorMessage(
                "Please enter your betting account ID."
            );
            return;
        }

        if (numericAmount <= 0) {
            setErrorMessage(
                "Please enter a valid funding amount."
            );
            return;
        }

        if (!pin || pin.length !== 4) {
            setErrorMessage(
                "Please enter your 4-digit transaction PIN."
            );
            return;
        }

        try {
            setLoading(true);

            const token =
                localStorage.getItem("token");

            if (!token) {
                setErrorMessage(
                    "Your session has expired. Please login again."
                );
                return;
            }

            const response =
                await fundBettingWallet(
                    token,
                    {
                        providerCode,
                        bettingUserId:
                            bettingUserId.trim(),
                        amount: numericAmount,
                        pin,
                    }
                );

            setSuccessMessage(
                response.message ||
                "Betting wallet funded successfully."
            );

            // Refresh betting history immediately
            await loadHistory();

            setBettingUserId("");
            setAmount("");
            setPin("");
        } catch (error: unknown) {
            console.error(error);

            if (
                axios.isAxiosError<{
                    message?: string;
                }>(error)
            ) {
                setErrorMessage(
                    error.response?.data?.message ||
                    "Betting wallet funding failed."
                );
            } else {
                setErrorMessage(
                    "Betting wallet funding failed."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-6xl">

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
                    transition={{
                        duration: 0.5,
                    }}
                    className="mb-8"
                >
                    <p className="text-sm font-bold text-green-600">
                        BETTING SERVICES
                    </p>

                    <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        Fund Betting Wallet
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                        Fund your betting account quickly and
                        securely from your QuickTxn wallet.
                    </p>
                </motion.div>

                {/* MAIN GRID */}

                <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">

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
                        transition={{
                            duration: 0.5,
                        }}
                        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
                    >

                        <div className="mb-7">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                    <Trophy size={22} />
                                </div>

                                <div>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        Betting Platform
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Select your betting provider
                                        below.
                                    </p>

                                </div>

                            </div>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-7"
                        >

                            {/* PROVIDERS */}

                            <div>

                                <label className="mb-3 block text-sm font-semibold text-slate-900">
                                    Select Provider
                                </label>

                                {providersLoading ? (

                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                                        {[1, 2, 3, 4].map(
                                            (item) => (
                                                <div
                                                    key={item}
                                                    className="h-24 animate-pulse rounded-2xl bg-slate-100"
                                                />
                                            )
                                        )}

                                    </div>

                                ) : providers.length === 0 ? (

                                    <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-5 text-sm text-yellow-800">
                                        No betting providers are
                                        currently available.
                                    </div>

                                ) : (

                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                                        {providers.map(
                                            (provider) => {

                                                const selected =
                                                    providerCode ===
                                                    provider.provider_code;

                                                const styles =
                                                    providerStyles[
                                                    provider.provider_code
                                                    ] || {
                                                        short:
                                                            provider.provider_name.charAt(
                                                                0
                                                            ),
                                                        active:
                                                            "border-green-500 bg-green-50 text-green-700",
                                                        icon:
                                                            "bg-green-600 text-white",
                                                    };

                                                return (
                                                    <button
                                                        key={
                                                            provider.provider_code
                                                        }
                                                        type="button"
                                                        onClick={() => {
                                                            setProviderCode(
                                                                provider.provider_code
                                                            );

                                                            setSuccessMessage(
                                                                ""
                                                            );

                                                            setErrorMessage(
                                                                ""
                                                            );
                                                        }}
                                                        className={`rounded-2xl border-2 p-4 text-left transition-all ${selected
                                                                ? styles.active
                                                                : "border-slate-200 bg-white hover:border-green-200 hover:bg-green-50/50"
                                                            }`}
                                                    >

                                                        <div className="flex items-center justify-between">

                                                            <div
                                                                className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-extrabold ${selected
                                                                        ? styles.icon
                                                                        : "bg-slate-100 text-slate-700"
                                                                    }`}
                                                            >
                                                                {
                                                                    styles.short
                                                                }
                                                            </div>

                                                            {selected && (
                                                                <CheckCircle2
                                                                    size={18}
                                                                />
                                                            )}

                                                        </div>

                                                        <p className="mt-3 text-sm font-bold">
                                                            {
                                                                provider.provider_name
                                                            }
                                                        </p>

                                                    </button>
                                                );
                                            }
                                        )}

                                    </div>
                                )}

                            </div>

                            {/* BETTING ID */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-900">
                                    Betting Account ID
                                </label>

                                <div className="relative">

                                    <UserRound
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        value={bettingUserId}
                                        onChange={(e) =>
                                            setBettingUserId(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter your betting account ID"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                                        required
                                    />

                                </div>

                                <p className="mt-2 text-xs text-slate-400">
                                    Confirm your betting ID before
                                    submitting the transaction.
                                </p>

                            </div>

                            {/* AMOUNT */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-900">
                                    Funding Amount
                                </label>

                                <div className="relative">

                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                                        ₦
                                    </span>

                                    <input
                                        type="number"
                                        min="1"
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter amount"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-4 text-lg font-semibold outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                                        required
                                    />

                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">

                                    {quickAmounts.map(
                                        (value) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() =>
                                                    setAmount(
                                                        String(value)
                                                    )
                                                }
                                                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                                            >
                                                ₦
                                                {value.toLocaleString(
                                                    "en-NG"
                                                )}
                                            </button>
                                        )
                                    )}

                                </div>

                            </div>

                            {/* PIN */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-900">
                                    Transaction PIN
                                </label>

                                <div className="relative">

                                    <LockKeyhole
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="password"
                                        inputMode="numeric"
                                        maxLength={4}
                                        value={pin}
                                        onChange={(e) =>
                                            setPin(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            )
                                        }
                                        placeholder="••••"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-11 pr-4 text-sm tracking-[0.4em] outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                                        required
                                    />

                                </div>

                            </div>

                            {/* ERROR */}

                            {errorMessage && (
                                <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
                                    {errorMessage}
                                </div>
                            )}

                            {/* SUCCESS */}

                            {successMessage && (
                                <div className="flex items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm font-medium text-green-700">

                                    <CheckCircle2
                                        size={19}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <span>
                                        {successMessage}
                                    </span>

                                </div>
                            )}

                            {/* SUBMIT */}

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    providersLoading ||
                                    !providerCode
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-4 font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {loading ? (
                                    <>
                                        <RefreshCcw
                                            size={18}
                                            className="animate-spin"
                                        />

                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Fund Betting Wallet

                                        <ArrowRight
                                            size={18}
                                        />
                                    </>
                                )}

                            </button>

                        </form>

                    </motion.div>

                    {/* RIGHT SIDE */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 25,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            duration: 0.5,
                            delay: 0.1,
                        }}
                        className="space-y-6"
                    >

                        {/* AMOUNT CARD */}

                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-6 text-white shadow-xl sm:p-7">

                            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

                            <div className="relative">

                                <div className="flex items-center justify-between">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                                        <CircleDollarSign
                                            size={25}
                                        />
                                    </div>

                                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur">
                                        {selectedProvider
                                            ?.provider_name ||
                                            "Betting"}
                                    </span>

                                </div>

                                <p className="mt-8 text-sm text-green-100">
                                    Funding Amount
                                </p>

                                <h2 className="mt-2 text-4xl font-extrabold sm:text-5xl">
                                    ₦
                                    {numericAmount.toLocaleString(
                                        "en-NG",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </h2>

                                <div className="mt-7 rounded-2xl bg-white/10 p-5 backdrop-blur">

                                    <p className="text-xs text-green-100">
                                        Betting Account
                                    </p>

                                    <p className="mt-1 text-lg font-bold">
                                        {bettingUserId ||
                                            "Not entered"}
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* SUMMARY */}

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                            <h3 className="text-lg font-bold text-slate-900">
                                Funding Summary
                            </h3>

                            <div className="mt-5 space-y-4">

                                <div className="flex justify-between text-sm">

                                    <span className="text-slate-500">
                                        Provider
                                    </span>

                                    <span className="font-semibold text-slate-900">
                                        {selectedProvider
                                            ?.provider_name ||
                                            "Not selected"}
                                    </span>

                                </div>

                                <div className="flex justify-between gap-4 text-sm">

                                    <span className="text-slate-500">
                                        Account ID
                                    </span>

                                    <span className="max-w-[170px] truncate font-semibold text-slate-900">
                                        {bettingUserId ||
                                            "Not entered"}
                                    </span>

                                </div>

                                <div className="border-t border-slate-100 pt-4">

                                    <div className="flex justify-between">

                                        <span className="font-semibold text-slate-700">
                                            Total
                                        </span>

                                        <span className="text-xl font-extrabold text-green-600">
                                            ₦
                                            {numericAmount.toLocaleString(
                                                "en-NG"
                                            )}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* SECURITY */}

                        <div className="rounded-3xl border border-green-100 bg-green-50 p-6">

                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                    <ShieldCheck
                                        size={21}
                                    />
                                </div>

                                <div>

                                    <h3 className="font-bold text-slate-900">
                                        Secure Funding
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-slate-600">
                                        Your transaction PIN protects
                                        your QuickTxn wallet.
                                    </p>

                                </div>

                            </div>

                            <div className="mt-5 space-y-3">

                                <div className="flex items-center gap-2 text-sm text-slate-600">

                                    <CheckCircle2
                                        size={16}
                                        className="text-green-600"
                                    />

                                    Secure wallet debit

                                </div>

                                <div className="flex items-center gap-2 text-sm text-slate-600">

                                    <Zap
                                        size={16}
                                        className="text-green-600"
                                    />

                                    Fast transaction processing

                                </div>

                                <div className="flex items-center gap-2 text-sm text-slate-600">

                                    <Trophy
                                        size={16}
                                        className="text-green-600"
                                    />

                                    Multiple betting providers

                                </div>

                            </div>

                        </div>

                    </motion.div>

                </div>

                {/* ======================================== */}
                {/* BETTING FUNDING HISTORY */}
                {/* ======================================== */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        duration: 0.5,
                        delay: 0.2,
                    }}
                    className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                >

                    <div className="mb-6 flex items-center justify-between">

                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Betting Funding History
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Your recent betting wallet funding
                                transactions.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={loadHistory}
                            disabled={historyLoading}
                            className="rounded-xl bg-slate-100 p-3 text-slate-600 transition hover:bg-green-50 hover:text-green-600 disabled:cursor-not-allowed"
                            title="Refresh history"
                        >
                            <RefreshCcw
                                size={20}
                                className={
                                    historyLoading
                                        ? "animate-spin"
                                        : ""
                                }
                            />
                        </button>

                    </div>

                    {/* LOADING */}

                    {historyLoading ? (

                        <div className="space-y-3">

                            {[1, 2, 3].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="h-20 animate-pulse rounded-2xl bg-slate-100"
                                    />
                                )
                            )}

                        </div>

                    ) : history.length === 0 ? (

                        /* EMPTY */

                        <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">

                            <Trophy
                                size={34}
                                className="mx-auto text-slate-300"
                            />

                            <p className="mt-3 font-semibold text-slate-500">
                                No betting transactions yet.
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                                Your betting funding history will
                                appear here.
                            </p>

                        </div>

                    ) : (

                        /* HISTORY LIST */

                        <div className="space-y-3">

                            {history.map(
                                (item) => (

                                    <div
                                        key={
                                            item.reference
                                        }
                                        className="flex flex-col gap-4 rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                                    >

                                        <div className="flex items-center gap-4">

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                                                <Trophy
                                                    size={20}
                                                />
                                            </div>

                                            <div>

                                                <h3 className="font-bold text-slate-900">
                                                    {
                                                        item.provider_name
                                                    }
                                                </h3>

                                                <p className="text-sm text-slate-500">
                                                    Account:{" "}
                                                    {
                                                        item.betting_user_id
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    {new Date(
                                                        item.created_at
                                                    ).toLocaleString(
                                                        "en-NG"
                                                    )}
                                                </p>

                                            </div>

                                        </div>

                                        <div className="text-left sm:text-right">

                                            <p className="font-bold text-slate-900">
                                                ₦
                                                {Number(
                                                    item.amount
                                                ).toLocaleString(
                                                    "en-NG"
                                                )}
                                            </p>

                                            <span
                                                className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-bold ${item.status.toUpperCase() ===
                                                        "SUCCESS"
                                                        ? "bg-green-100 text-green-700"
                                                        : item.status.toUpperCase() ===
                                                            "PENDING"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {
                                                    item.status
                                                }
                                            </span>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>
                    )}

                </motion.div>

            </div>

        </main>
    );
}