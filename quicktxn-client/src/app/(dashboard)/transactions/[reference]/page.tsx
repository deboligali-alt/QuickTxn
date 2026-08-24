"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    Copy,
    FileText,
    XCircle,
} from "lucide-react";

import {
    getTransactionByReference,
} from "@/services/transaction.service";

interface Transaction {
    id: string;
    reference: string;
    type: string;
    amount: number;
    status: string;
    description: string;
    created_at: string;
    sender_email?: string;
    receiver_email?: string;
}

export default function TransactionDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const [transaction, setTransaction] =
        useState<Transaction | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [copied, setCopied] =
        useState(false);

    const reference =
        Array.isArray(params.reference)
            ? params.reference[0]
            : params.reference;

    useEffect(() => {
        const loadTransaction = async () => {
            try {
                setLoading(true);
                setErrorMessage("");

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    setErrorMessage(
                        "Please login to continue."
                    );
                    return;
                }

                if (!reference) {
                    setErrorMessage(
                        "Transaction reference not found."
                    );
                    return;
                }

                const response =
                    await getTransactionByReference(
                        token,
                        reference
                    );

                setTransaction(
                    response.transaction
                );

            } catch (error: unknown) {
                console.error(error);

                if (
                    axios.isAxiosError<{
                        message?: string;
                    }>(error)
                ) {
                    setErrorMessage(
                        error.response?.data?.message ||
                        "Unable to load transaction."
                    );
                } else {
                    setErrorMessage(
                        "Unable to load transaction."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        loadTransaction();
    }, [reference]);

    const copyReference = async () => {
        if (!transaction?.reference) {
            return;
        }

        try {
            await navigator.clipboard.writeText(
                transaction.reference
            );

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);

        } catch (error) {
            console.error(
                "Failed to copy reference:",
                error
            );
        }
    };

    const getStatus = () => {
        const status =
            transaction?.status?.toUpperCase();

        if (
            status === "SUCCESS" ||
            status === "COMPLETED"
        ) {
            return {
                label: transaction?.status,
                icon: CheckCircle2,
                wrapper:
                    "bg-green-50 text-green-700 border-green-100",
                iconBg:
                    "bg-green-100 text-green-600",
            };
        }

        if (
            status === "PENDING" ||
            status === "PROCESSING"
        ) {
            return {
                label: transaction?.status,
                icon: Clock3,
                wrapper:
                    "bg-yellow-50 text-yellow-700 border-yellow-100",
                iconBg:
                    "bg-yellow-100 text-yellow-600",
            };
        }

        return {
            label: transaction?.status,
            icon: XCircle,
            wrapper:
                "bg-red-50 text-red-700 border-red-100",
            iconBg:
                "bg-red-100 text-red-600",
        };
    };

    const formatAmount = (
        amount: number
    ) => {
        return `₦${Number(
            amount || 0
        ).toLocaleString(
            "en-NG",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`;
    };

    const formatDate = (
        date: string
    ) => {
        return new Date(
            date
        ).toLocaleString(
            "en-NG",
            {
                dateStyle: "full",
                timeStyle: "short",
            }
        );
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">

                <div className="mx-auto max-w-3xl">

                    <div className="mb-6 h-10 w-40 animate-pulse rounded-xl bg-slate-200" />

                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

                        <div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-slate-200" />

                        <div className="mx-auto mt-6 h-8 w-48 animate-pulse rounded-lg bg-slate-200" />

                        <div className="mx-auto mt-3 h-5 w-64 animate-pulse rounded-lg bg-slate-100" />

                        <div className="mt-10 space-y-4">

                            {[1, 2, 3, 4].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="h-16 animate-pulse rounded-xl bg-slate-100"
                                    />
                                )
                            )}

                        </div>

                    </div>

                </div>

            </main>
        );
    }

    if (errorMessage || !transaction) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">

                <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">

                        <XCircle
                            size={30}
                            className="text-red-600"
                        />

                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-slate-900">
                        Transaction Not Found
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        {errorMessage ||
                            "We could not find this transaction."}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/transactions"
                            )
                        }
                        className="mt-6 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                    >
                        Back to Transactions
                    </button>

                </div>

            </main>
        );
    }

    const status = getStatus();
    const StatusIcon = status.icon;

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-3xl">

                {/* BACK */}

                <button
                    type="button"
                    onClick={() =>
                        router.push(
                            "/transactions"
                        )
                    }
                    className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-green-600"
                >
                    <ArrowLeft size={18} />

                    Back to Transactions
                </button>

                {/* CARD */}

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                    {/* HEADER */}

                    <div className="border-b border-slate-100 px-6 py-8 text-center sm:px-10">

                        <div
                            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${status.iconBg}`}
                        >
                            <StatusIcon size={34} />
                        </div>

                        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-400">
                            Transaction
                        </p>

                        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
                            {formatAmount(
                                transaction.amount
                            )}
                        </h1>

                        <span
                            className={`mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${status.wrapper}`}
                        >
                            <StatusIcon size={16} />

                            {status.label}
                        </span>

                    </div>

                    {/* DETAILS */}

                    <div className="p-6 sm:p-10">

                        <h2 className="text-lg font-bold text-slate-900">
                            Transaction Details
                        </h2>

                        <div className="mt-6 divide-y divide-slate-100">

                            {/* TYPE */}

                            <div className="flex items-center justify-between gap-6 py-4">

                                <span className="text-sm text-slate-500">
                                    Type
                                </span>

                                <span className="text-right text-sm font-semibold capitalize text-slate-900">
                                    {transaction.type}
                                </span>

                            </div>

                            {/* AMOUNT */}

                            <div className="flex items-center justify-between gap-6 py-4">

                                <span className="text-sm text-slate-500">
                                    Amount
                                </span>

                                <span className="text-right text-sm font-bold text-slate-900">
                                    {formatAmount(
                                        transaction.amount
                                    )}
                                </span>

                            </div>

                            {/* DESCRIPTION */}

                            <div className="flex items-start justify-between gap-6 py-4">

                                <span className="text-sm text-slate-500">
                                    Description
                                </span>

                                <span className="max-w-[60%] text-right text-sm font-semibold text-slate-900">
                                    {transaction.description ||
                                        "No description"}
                                </span>

                            </div>

                            {/* REFERENCE */}

                            <div className="flex items-start justify-between gap-6 py-4">

                                <span className="text-sm text-slate-500">
                                    Reference
                                </span>

                                <button
                                    type="button"
                                    onClick={
                                        copyReference
                                    }
                                    className="flex max-w-[65%] items-center gap-2 text-right"
                                >

                                    <span className="break-all font-mono text-xs font-semibold text-slate-700">
                                        {
                                            transaction.reference
                                        }
                                    </span>

                                    {copied ? (
                                        <CheckCircle2
                                            size={16}
                                            className="shrink-0 text-green-600"
                                        />
                                    ) : (
                                        <Copy
                                            size={16}
                                            className="shrink-0 text-slate-400"
                                        />
                                    )}

                                </button>

                            </div>

                            {/* DATE */}

                            <div className="flex items-start justify-between gap-6 py-4">

                                <span className="text-sm text-slate-500">
                                    Date
                                </span>

                                <span className="max-w-[65%] text-right text-sm font-semibold text-slate-900">
                                    {formatDate(
                                        transaction.created_at
                                    )}
                                </span>

                            </div>

                            {/* SENDER */}

                            {transaction.sender_email && (
                                <div className="flex items-center justify-between gap-6 py-4">

                                    <span className="text-sm text-slate-500">
                                        Sender
                                    </span>

                                    <span className="max-w-[65%] truncate text-right text-sm font-semibold text-slate-900">
                                        {
                                            transaction.sender_email
                                        }
                                    </span>

                                </div>
                            )}

                            {/* RECEIVER */}

                            {transaction.receiver_email && (
                                <div className="flex items-center justify-between gap-6 py-4">

                                    <span className="text-sm text-slate-500">
                                        Receiver
                                    </span>

                                    <span className="max-w-[65%] truncate text-right text-sm font-semibold text-slate-900">
                                        {
                                            transaction.receiver_email
                                        }
                                    </span>

                                </div>
                            )}

                        </div>

                        {/* REFERENCE BOX */}

                        <div className="mt-8 rounded-2xl border border-green-100 bg-green-50 p-5">

                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                    <FileText
                                        size={19}
                                    />
                                </div>

                                <div className="min-w-0">

                                    <p className="text-sm font-bold text-slate-900">
                                        Transaction Reference
                                    </p>

                                    <p className="mt-1 break-all font-mono text-xs text-slate-600">
                                        {
                                            transaction.reference
                                        }
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
}