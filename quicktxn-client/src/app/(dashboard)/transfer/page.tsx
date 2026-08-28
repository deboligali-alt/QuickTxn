"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    ChevronDown,
    Lock,
    ShieldCheck,
    Wallet,
    ArrowRight,
    Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import {
    getBanks,
    resolveAccount,
    bankTransfer,
    getWallet,
} from "@/services/wallet.service";

interface Bank {
    id?: string | number;
    name: string;
    code: string;
}

interface WalletData {
    balance: number;
}

export default function BankTransferPage() {
    const router = useRouter();

    const [banks, setBanks] = useState<Bank[]>([]);
    const [wallet, setWallet] =
        useState<WalletData | null>(null);

    const [bankCode, setBankCode] =
        useState("");

    const [accountNumber, setAccountNumber] =
        useState("");

    const [accountName, setAccountName] =
        useState("");

    const [amount, setAmount] =
        useState("");

    const [pin, setPin] =
        useState("");

    const [loadingBanks, setLoadingBanks] =
        useState(true);

    const [resolving, setResolving] =
        useState(false);

    const [transferring, setTransferring] =
        useState(false);

    const [accountResolved, setAccountResolved] =
        useState(false);

    const selectedBank = banks.find(
        (bank) => bank.code === bankCode
    );

    const numericAmount = Number(amount || 0);

    useEffect(() => {
        const loadData = async () => {
            try {
                const token =
                    localStorage.getItem("token");

                if (!token) {
                    router.replace("/login");
                    return;
                }

                const [
                    banksResponse,
                    walletResponse,
                ] = await Promise.all([
                    getBanks(token),
                    getWallet(token),
                ]);

                const bankList =
                    banksResponse.data ||
                    banksResponse.banks ||
                    [];

                setBanks(bankList);

                setWallet(
                    walletResponse.data ||
                    walletResponse
                );
            } catch (error) {
                console.error(error);

                if (
                    axios.isAxiosError(error)
                ) {
                    toast.error(
                        error.response?.data
                            ?.message ||
                        "Unable to load banks."
                    );
                } else {
                    toast.error(
                        "Unable to load bank information."
                    );
                }
            } finally {
                setLoadingBanks(false);
            }
        };

        loadData();
    }, [router]);
    const handleBankChange = (value: string) => {
        setBankCode(value);
    };

    const handleAccountNumberChange = (value: string) => {
        const clean = value.replace(/\D/g, "").slice(0, 10);
        setAccountNumber(clean);
    };

    const handleResolveAccount = async () => {
        if (!bankCode) {
            toast.error(
                "Please select a bank."
            );
            return;
        }

        if (accountNumber.length !== 10) {
            toast.error(
                "Please enter a valid 10-digit account number."
            );
            return;
        }

        try {
            setResolving(true);

            const token =
                localStorage.getItem("token");

            if (!token) {
                router.replace("/login");
                return;
            }

            const response =
                await resolveAccount(
                    token,
                    accountNumber,
                    bankCode
                );

            const resolvedName =
                response.data?.account_name ||
                response.data?.accountName ||
                response.account_name ||
                response.accountName;

            if (!resolvedName) {
                toast.error(
                    "Unable to resolve account name."
                );
                return;
            }

            setAccountName(resolvedName);
            setAccountResolved(true);

            toast.success(
                "Account verified successfully."
            );
        } catch (error: unknown) {
            console.error(error);

            if (
                axios.isAxiosError(error)
            ) {
                toast.error(
                    error.response?.data
                        ?.message ||
                    "Unable to resolve account."
                );
            } else {
                toast.error(
                    "Unable to resolve account."
                );
            }
        } finally {
            setResolving(false);
        }
    };

    useEffect(() => {
        const verifyAccount = async () => {
            if (!bankCode || accountNumber.length !== 10) {
                setAccountName("");
                setAccountResolved(false);
                return;
            }

            try {
                setResolving(true);

                const token = localStorage.getItem("token");
                if (!token) return;

                const res = await resolveAccount(
                    token,
                    accountNumber,
                    bankCode
                );

                const name =
                    res.data?.account_name || res.account_name;

                if (name) {
                    setAccountName(name);
                    setAccountResolved(true);
                } else {
                    setAccountName("");
                    setAccountResolved(false);
                }
            } catch {
                setAccountName("");
                setAccountResolved(false);
            } finally {
                setResolving(false);
            }
        };

        const timer = setTimeout(verifyAccount, 300);
        return () => clearTimeout(timer);
    }, [bankCode, accountNumber]);
    const handleTransfer = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!accountResolved) {
            toast.error(
                "Please verify the account first."
            );
            return;
        }

        if (
            !amount ||
            numericAmount <= 0
        ) {
            toast.error(
                "Enter a valid transfer amount."
            );
            return;
        }

        if (
            wallet &&
            numericAmount >
            Number(wallet.balance)
        ) {
            toast.error(
                "Insufficient wallet balance."
            );
            return;
        }

        if (pin.length !== 4) {
            toast.error(
                "Enter your 4-digit transaction PIN."
            );
            return;
        }

        try {
            setTransferring(true);

            const token =
                localStorage.getItem("token");

            if (!token) {
                router.replace("/login");
                return;
            }
            const response = await bankTransfer(token, {
                accountNumber,
                bankCode,
                accountName,
                amount: numericAmount,
                pin,
            });

            toast.success(
                response.message || "Bank transfer successful."
            );

            // Refresh wallet instantly
            const walletResponse = await getWallet(token);
            setWallet(walletResponse.data || walletResponse);

            // Clear form
            setAmount("");
            setPin("");
            setAccountNumber("");
            setAccountName("");
            setBankCode("");
            setAccountResolved(false);

            // Notify dashboard
            sessionStorage.setItem("refresh_dashboard", "true");

            // Go back after 1 second
            setTimeout(() => {
                router.push("/");
            }, 1000);

            setAmount("");
            setPin("");
            setAccountNumber("");
            setAccountName("");
            setBankCode("");
            setAccountResolved(false);

        } catch (error: unknown) {
            console.error(error);

            if (
                axios.isAxiosError(error)
            ) {
                toast.error(
                    error.response?.data
                        ?.message ||
                    "Bank transfer failed."
                );
            } else {
                toast.error(
                    "Bank transfer failed."
                );
            }
        } finally {
            setTransferring(false);
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
                            <Building2 size={28} />
                        </div>

                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                                Bank Transfer
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 sm:text-base">
                                Send money securely to any
                                Nigerian bank account.
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
                            onSubmit={
                                handleTransfer
                            }
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                        >

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                    <Building2
                                        size={20}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        Send to Bank
                                    </h2>

                                    <p className="text-sm text-slate-500">
                                        Enter the recipient's
                                        bank details.
                                    </p>
                                </div>

                            </div>

                            {/* BANK */}

                            <div className="mt-7">

                                <label
                                    htmlFor="bank"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Select Bank
                                </label>

                                <div className="relative">

                                    <Building2
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <select
                                        id="bank"
                                        value={bankCode}
                                        onChange={(e) =>
                                            handleBankChange(
                                                e.target
                                                    .value
                                            )
                                        }
                                        disabled={
                                            loadingBanks
                                        }
                                        className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-4 pl-12 pr-12 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-slate-100"
                                        required
                                    >
                                        <option value="">
                                            {loadingBanks
                                                ? "Loading banks..."
                                                : "Select a bank"}
                                        </option>

                                        {banks.map(
                                            (
                                                bank,
                                                index
                                            ) => (
                                                <option
                                                    key={
                                                        bank.id ||
                                                        bank.code ||
                                                        index
                                                    }
                                                    value={
                                                        bank.code
                                                    }
                                                >
                                                    {
                                                        bank.name
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <ChevronDown
                                        size={18}
                                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                </div>

                            </div>

                            {/* ACCOUNT NUMBER */}

                            <div className="mt-6">

                                <label
                                    htmlFor="accountNumber"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Account Number
                                </label>

                                <div className="flex flex-col gap-3 sm:flex-row">

                                    <div className="relative flex-1">

                                        <Wallet
                                            size={19}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="accountNumber"
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={10}
                                            placeholder="0123456789"
                                            value={
                                                accountNumber
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                handleAccountNumberChange(
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-300 py-4 pl-12 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                            required
                                        />

                                    </div>



                                </div>

                            </div>

                            {/* ACCOUNT NAME */}

                            {accountResolved && (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: 10,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-5"
                                >
                                    <div className="mt-6">
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Account Name
                                        </label>

                                        <div className="flex h-[58px] items-center rounded-xl border border-slate-300 bg-slate-50 px-4">
                                            {resolving ? (
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Loader2 size={18} className="animate-spin" />
                                                    <span>Verifying account...</span>
                                                </div>
                                            ) : accountResolved ? (
                                                <div className="flex items-center gap-2 text-green-700 font-semibold">
                                                    <CheckCircle2 size={18} />
                                                    <span>{accountName}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">
                                                    Account name will appear automatically
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                </motion.div>
                            )}

                            {/* AMOUNT */}

                            <div className="mt-7">

                                <label
                                    htmlFor="amount"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Amount
                                </label>

                                <div className="relative">

                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                                        ₦
                                    </span>

                                    <input
                                        id="amount"
                                        type="number"
                                        min="1"
                                        placeholder="5000"
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(
                                                e.target
                                                    .value
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-300 py-4 pl-10 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                        required
                                    />

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

                                <p className="mt-2 text-xs text-slate-400">
                                    Enter your 4-digit QuickTxn
                                    transaction PIN.
                                </p>

                            </div>

                            {/* SUMMARY */}

                            {accountResolved &&
                                numericAmount > 0 && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: 10,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        className="mt-6 rounded-2xl bg-slate-50 p-5"
                                    >

                                        <p className="text-sm font-semibold text-slate-500">
                                            Transfer Summary
                                        </p>

                                        <div className="mt-4 space-y-3">

                                            <div className="flex justify-between gap-4">
                                                <span className="text-sm text-slate-500">
                                                    Recipient
                                                </span>

                                                <span className="text-right text-sm font-semibold text-slate-900">
                                                    {
                                                        accountName
                                                    }
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4">
                                                <span className="text-sm text-slate-500">
                                                    Bank
                                                </span>

                                                <span className="text-right text-sm font-semibold text-slate-900">
                                                    {
                                                        selectedBank
                                                            ?.name
                                                    }
                                                </span>
                                            </div>

                                            <div className="flex justify-between gap-4">
                                                <span className="text-sm text-slate-500">
                                                    Account
                                                </span>

                                                <span className="text-sm font-semibold text-slate-900">
                                                    {
                                                        accountNumber
                                                    }
                                                </span>
                                            </div>

                                            <div className="border-t border-slate-200 pt-3">

                                                <div className="flex justify-between">

                                                    <span className="font-semibold text-slate-700">
                                                        Amount
                                                    </span>

                                                    <span className="text-2xl font-extrabold text-slate-900">
                                                        ₦
                                                        {numericAmount.toLocaleString(
                                                            "en-NG"
                                                        )}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                    </motion.div>
                                )}

                            {/* TRANSFER */}

                            <button
                                type="submit"
                                disabled={
                                    transferring ||
                                    !accountResolved
                                }
                                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                                {transferring ? (
                                    <>
                                        <Loader2
                                            size={19}
                                            className="animate-spin"
                                        />
                                        Processing Transfer...
                                    </>
                                ) : (
                                    <>
                                        Transfer Money
                                        <ArrowRight
                                            size={19}
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

                        {/* WALLET */}

                        <div className="rounded-3xl bg-gradient-to-br from-green-700 to-emerald-500 p-6 text-white shadow-lg">

                            <div className="flex items-center justify-between">

                                <div>
                                    <p className="text-sm text-green-100">
                                        Available Balance
                                    </p>

                                    <p className="mt-2 text-3xl font-extrabold">
                                        ₦
                                        {Number(
                                            wallet?.balance ||
                                            0
                                        ).toLocaleString(
                                            "en-NG"
                                        )}
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                                    <Wallet size={25} />
                                </div>

                            </div>

                            <p className="mt-5 text-sm text-green-100">
                                Funds available for bank
                                transfers.
                            </p>

                        </div>

                        {/* VERIFIED RECIPIENT */}

                        {accountResolved && (
                            <div className="rounded-3xl border border-green-200 bg-green-50 p-6">

                                <div className="flex items-center gap-3">

                                    <CheckCircle2
                                        size={23}
                                        className="text-green-600"
                                    />

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                                            Verified Recipient
                                        </p>

                                        <p className="mt-1 font-bold text-slate-900">
                                            {
                                                accountName
                                            }
                                        </p>
                                    </div>

                                </div>

                            </div>
                        )}

                        {/* SECURITY */}

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                <ShieldCheck
                                    size={23}
                                />
                            </div>

                            <h2 className="mt-5 text-lg font-bold text-slate-900">
                                Secure Transfer
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Every transfer requires your
                                transaction PIN before funds
                                can be sent.
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
                                            Select bank
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Choose the recipient's
                                            bank.
                                        </p>
                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                                        2
                                    </div>

                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            Verify account
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Enter the account number
                                            and verify the recipient.
                                        </p>
                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                                        3
                                    </div>

                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            Send money
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Enter amount and PIN,
                                            then complete the transfer.
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