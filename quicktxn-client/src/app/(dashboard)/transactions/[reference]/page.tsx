"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import {
    ArrowLeft,
    CheckCircle2,
    ArrowDownLeft,
    ArrowUpRight,
    Download,
    Share2,
    Receipt,
    Calendar,
    Hash,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Transaction {
    id: string;
    reference: string;
    type: "CREDIT" | "DEBIT";
    amount: number;
    description: string;
    status: string;
    created_at: string;
}

export default function TransactionReceiptPage() {
    const router = useRouter();
    const params = useParams();

    const reference = params.reference as string;

    const [transaction, setTransaction] =
        useState<Transaction | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTransaction = async () => {
            try {
                const res = await api.get(
                    `/transactions/${reference}`
                );

                setTransaction(res.data.transaction);
            } catch {
                toast.error("Transaction not found");
            } finally {
                setLoading(false);
            }
        };

        if (reference) loadTransaction();
    }, [reference]);

    const shareReceipt = async () => {
        if (!transaction) return;

        const text = `QuickTxn Receipt

Reference: ${transaction.reference}
Amount: ₦${Number(transaction.amount).toLocaleString()}
Description: ${transaction.description}
Status: ${transaction.status}`;

        if (navigator.share) {
            await navigator.share({ text });
        } else {
            await navigator.clipboard.writeText(text);
            toast.success("Receipt copied");
        }
    };

    const downloadReceipt = () => {
        toast.success("PDF download coming soon");
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
                    <p className="mt-3 text-gray-500">
                        Loading receipt...
                    </p>
                </div>
            </main>
        );
    }

    if (!transaction) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Receipt
                        size={48}
                        className="mx-auto text-gray-300"
                    />
                    <h2 className="mt-3 text-lg font-bold">
                        Receipt Not Found
                    </h2>

                    <button
                        onClick={() => router.back()}
                        className="mt-4 rounded-xl bg-green-600 px-5 py-2 text-white"
                    >
                        Go Back
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100">
            <div className="mx-auto max-w-md p-4 pb-24">
                <button
                    onClick={() => router.back()}
                    className="mb-4 flex items-center gap-2 text-gray-600"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden rounded-3xl bg-white shadow-xl"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-8 text-center text-white">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20">
                            <CheckCircle2 size={44} />
                        </div>

                        <h1 className="mt-4 text-xl font-bold">
                            Payment Successful
                        </h1>

                        <p className="mt-1 text-green-100">
                            Transaction completed successfully
                        </p>

                        <h2 className="mt-5 text-4xl font-bold">
                            ₦
                            {Number(
                                transaction.amount
                            ).toLocaleString()}
                        </h2>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        <div className="mb-5 flex items-center justify-between">
                            <span className="text-gray-500">
                                Transaction Type
                            </span>

                            <div className="flex items-center gap-2">
                                {transaction.type === "CREDIT" ? (
                                    <ArrowDownLeft
                                        size={18}
                                        className="text-green-600"
                                    />
                                ) : (
                                    <ArrowUpRight
                                        size={18}
                                        className="text-red-500"
                                    />
                                )}

                                <span
                                    className={`font-bold ${transaction.type === "CREDIT"
                                            ? "text-green-600"
                                            : "text-red-500"
                                        }`}
                                >
                                    {transaction.type}
                                </span>
                            </div>
                        </div>

                        <ReceiptRow
                            icon={<Receipt size={16} />}
                            label="Description"
                            value={transaction.description}
                        />

                        <ReceiptRow
                            icon={<Hash size={16} />}
                            label="Reference"
                            value={transaction.reference}
                        />

                        <ReceiptRow
                            icon={<Calendar size={16} />}
                            label="Date"
                            value={new Date(
                                transaction.created_at
                            ).toLocaleString("en-NG")}
                        />

                        <div className="mt-5 flex items-center justify-between border-t pt-5">
                            <span className="text-gray-500">
                                Status
                            </span>

                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold capitalize text-green-700">
                                {transaction.status}
                            </span>
                        </div>

                        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center">
                            <p className="text-xs text-gray-500">
                                QuickTxn Reference
                            </p>

                            <h3 className="mt-1 text-lg font-bold tracking-wide">
                                {transaction.reference}
                            </h3>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <button
                                onClick={downloadReceipt}
                                className="flex items-center justify-center gap-2 rounded-xl border py-3 font-semibold"
                            >
                                <Download size={18} />
                                PDF
                            </button>

                            <button
                                onClick={shareReceipt}
                                className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold text-white"
                            >
                                <Share2 size={18} />
                                Share
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

function ReceiptRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start justify-between py-3">
            <div className="flex items-center gap-2 text-gray-500">
                {icon}
                <span>{label}</span>
            </div>

            <span className="max-w-[180px] text-right font-semibold text-gray-900">
                {value}
            </span>
        </div>
    );
}