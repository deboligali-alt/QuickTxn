"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Mail,
    ShieldCheck,
    User,
    Wallet,
    XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { transferMoney } from "@/services/transfer.service";

export default function TransferPage() {
    const [receiverEmail, setReceiverEmail] = useState("");
    const [amount, setAmount] = useState("");

    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [error, setError] = useState("");

    const numericAmount = Number(amount);

    const isValidAmount =
        numericAmount > 0 && Number.isFinite(numericAmount);

    const canContinue =
        receiverEmail.trim().length > 0 &&
        isValidAmount;

    const handleContinue = (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setError("");
        setSuccess(false);

        if (!receiverEmail.trim()) {
            setError("Please enter the receiver's email address.");
            return;
        }

        if (!isValidAmount) {
            setError("Please enter a valid transfer amount.");
            return;
        }

        setShowConfirmation(true);
    };

    const handleTransfer = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login first.");
                return;
            }

            const response = await transferMoney(token, {
                receiverEmail: receiverEmail.trim(),
                amount: numericAmount,
            });

            setSuccessMessage(
                response?.message ||
                "Transfer completed successfully."
            );

            setSuccess(true);
            setShowConfirmation(false);

            setReceiverEmail("");
            setAmount("");

            toast.success(
                response?.message ||
                "Transfer completed successfully."
            );

        } catch (error: unknown) {
            let message = "Transfer failed.";

            if (axios.isAxiosError(error)) {
                message =
                    error.response?.data?.message ??
                    "Transfer failed.";
            } else if (error instanceof Error) {
                message = error.message;
            }

            setError(message);
            setShowConfirmation(false);

            toast.error(message);

        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (loading) return;

        setShowConfirmation(false);
    };

    const handleReset = () => {
        setSuccess(false);
        setSuccessMessage("");
        setError("");
        setReceiverEmail("");
        setAmount("");
    };

    return (
        <main className="min-h-full bg-slate-50">

            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

                {/* =========================
                    HEADER
                ========================= */}

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
                    <Link
                        href="/dashboard"
                        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-green-600"
                    >
                        <ArrowLeft size={17} />
                        Back to Dashboard
                    </Link>

                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-green-600">
                            MONEY TRANSFER
                        </p>

                        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Send Money
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                            Send money securely to another QuickTxn
                            user using their registered email address.
                        </p>
                    </div>
                </motion.div>

                {/* =========================
                    SUCCESS STATE
                ========================= */}

                {success ? (
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.96,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        className="mx-auto max-w-xl rounded-3xl border border-green-100 bg-white p-8 text-center shadow-sm sm:p-10"
                    >
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <CheckCircle2 size={42} />
                        </div>

                        <h2 className="mt-6 text-2xl font-bold text-slate-900">
                            Transfer Successful
                        </h2>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                            {successMessage}
                        </p>

                        <div className="mt-8 grid gap-3 sm:grid-cols-2">

                            <button
                                type="button"
                                onClick={handleReset}
                                className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
                            >
                                Send Another
                            </button>

                            <Link
                                href="/transactions"
                                className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                View Transactions
                            </Link>

                        </div>
                    </motion.div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-3">

                        {/* =========================
                            TRANSFER FORM
                        ========================= */}

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
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                        <ArrowRight size={23} />
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">
                                            Transfer Details
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Enter the recipient and amount.
                                        </p>
                                    </div>

                                </div>

                                {error && (
                                    <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">

                                        <XCircle
                                            size={19}
                                            className="mt-0.5 shrink-0"
                                        />

                                        <p>{error}</p>

                                    </div>
                                )}

                                <form
                                    onSubmit={handleContinue}
                                    className="mt-8 space-y-6"
                                >

                                    {/* Receiver */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Receiver Email
                                        </label>

                                        <div className="relative">

                                            <Mail
                                                size={20}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                            />

                                            <input
                                                type="email"
                                                value={receiverEmail}
                                                onChange={(e) => {
                                                    setReceiverEmail(
                                                        e.target.value
                                                    );
                                                    setError("");
                                                }}
                                                placeholder="receiver@example.com"
                                                className="w-full rounded-xl border border-slate-300 bg-white py-4 pl-12 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-50"
                                                required
                                            />

                                        </div>

                                        <p className="mt-2 text-xs text-slate-500">
                                            The recipient must have a
                                            QuickTxn account.
                                        </p>

                                    </div>

                                    {/* Amount */}

                                    <div>

                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Amount
                                        </label>

                                        <div className="relative">

                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-500">
                                                ₦
                                            </span>

                                            <input
                                                type="number"
                                                min="1"
                                                step="0.01"
                                                value={amount}
                                                onChange={(e) => {
                                                    setAmount(
                                                        e.target.value
                                                    );
                                                    setError("");
                                                }}
                                                placeholder="0.00"
                                                className="w-full rounded-xl border border-slate-300 bg-white py-4 pl-10 pr-4 text-lg font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-50"
                                                required
                                            />

                                        </div>

                                        <div className="mt-2 flex items-center justify-between">

                                            <p className="text-xs text-slate-500">
                                                Enter the amount you want
                                                to send.
                                            </p>

                                            {isValidAmount && (
                                                <p className="text-xs font-semibold text-green-600">
                                                    ₦
                                                    {numericAmount.toLocaleString(
                                                        "en-NG",
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                    {/* Summary */}

                                    <div className="rounded-2xl bg-slate-50 p-5">

                                        <div className="flex items-center justify-between">

                                            <span className="text-sm text-slate-500">
                                                Amount
                                            </span>

                                            <span className="font-semibold text-slate-900">
                                                ₦
                                                {isValidAmount
                                                    ? numericAmount.toLocaleString(
                                                        "en-NG",
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )
                                                    : "0.00"}
                                            </span>

                                        </div>

                                        <div className="my-4 h-px bg-slate-200" />

                                        <div className="flex items-center justify-between">

                                            <span className="font-semibold text-slate-700">
                                                Total
                                            </span>

                                            <span className="text-xl font-bold text-green-600">
                                                ₦
                                                {isValidAmount
                                                    ? numericAmount.toLocaleString(
                                                        "en-NG",
                                                        {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )
                                                    : "0.00"}
                                            </span>

                                        </div>

                                    </div>

                                    <button
                                        type="submit"
                                        disabled={
                                            loading ||
                                            !canContinue
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                                    >
                                        Continue
                                        <ArrowRight size={19} />
                                    </button>

                                </form>

                            </div>
                        </motion.div>

                        {/* =========================
                            SIDE INFORMATION
                        ========================= */}

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
                            className="space-y-6"
                        >

                            {/* Secure Transfer */}

                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                    <ShieldCheck size={24} />
                                </div>

                                <h3 className="mt-5 text-lg font-bold text-slate-900">
                                    Secure Transfer
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Your transfer is protected by
                                    QuickTxn authentication and
                                    transaction security.
                                </p>

                            </div>

                            {/* Recipient */}

                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                        <User size={21} />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            QuickTxn User
                                        </h3>

                                        <p className="text-xs text-slate-500">
                                            Transfer between users
                                        </p>
                                    </div>

                                </div>

                                <div className="mt-5 rounded-xl bg-slate-50 p-4">

                                    <p className="text-xs leading-5 text-slate-500">
                                        Double-check the recipient's
                                        email address before confirming
                                        your transfer.
                                    </p>

                                </div>

                            </div>

                            {/* Wallet */}

                            <Link
                                href="/wallet"
                                className="block rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-green-200 hover:shadow-md"
                            >

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                                        <Wallet size={21} />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900">
                                            Check Wallet
                                        </h3>

                                        <p className="text-xs text-slate-500">
                                            View your available balance
                                        </p>
                                    </div>

                                </div>

                            </Link>

                        </motion.div>

                    </div>
                )}

            </div>

            {/* =========================
                CONFIRMATION MODAL
            ========================= */}

            {showConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
                    >

                        <div className="text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                                <ArrowRight size={28} />
                            </div>

                            <h2 className="mt-5 text-2xl font-bold text-slate-900">
                                Confirm Transfer
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Please confirm the details below.
                            </p>

                        </div>

                        <div className="mt-7 space-y-4 rounded-2xl bg-slate-50 p-5">

                            <div className="flex items-center justify-between gap-4">

                                <span className="text-sm text-slate-500">
                                    Recipient
                                </span>

                                <span className="max-w-[60%] break-all text-right text-sm font-semibold text-slate-900">
                                    {receiverEmail}
                                </span>

                            </div>

                            <div className="h-px bg-slate-200" />

                            <div className="flex items-center justify-between">

                                <span className="text-sm text-slate-500">
                                    Amount
                                </span>

                                <span className="text-xl font-bold text-green-600">
                                    ₦
                                    {numericAmount.toLocaleString(
                                        "en-NG",
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </span>

                            </div>

                        </div>

                        <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
                            Make sure the recipient's email and amount
                            are correct before continuing.
                        </div>

                        <div className="mt-7 grid grid-cols-2 gap-3">

                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleTransfer}
                                disabled={loading}
                                className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                                {loading
                                    ? "Processing..."
                                    : "Confirm Transfer"}
                            </button>

                        </div>

                    </motion.div>

                </div>
            )}

        </main>
    );
}