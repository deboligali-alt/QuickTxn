"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    CheckCircle2,
    Copy,
    ArrowLeft,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface Transaction {
    reference: string;
    type: string;
    amount: number;
    status: string;
    description: string;
    createdAt: string;
}

export default function TransactionDetailsPage() {
    const { reference } = useParams();
    const router = useRouter();

    const [tx, setTx] = useState<Transaction | null>(null);
    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const res = await api.get(`/transactions/${reference}`);
                setTx(res.data.transaction);
            } catch (error) {
                console.error("Failed to load transaction:", error);
            }
        };

        if (reference) {
            fetchTransaction();
        }
    }, [reference]);

    const copyReference = () => {
        if (!tx) return;

        navigator.clipboard.writeText(tx.reference);
        alert("Reference copied");
    };

    if (!tx) {
        return (
            <main className="mx-auto flex min-h-screen max-w-md items-center justify-center bg-gray-50">
                Loading...
            </main>
        );
    }

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4 pb-24">
            <button
                onClick={() => router.back()}
                className="mb-5 flex items-center gap-2 text-gray-600"
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex flex-col items-center">
                    <div className="rounded-full bg-green-100 p-4">
                        <CheckCircle2
                            className="text-green-600"
                            size={42}
                        />
                    </div>

                    <h1 className="mt-4 text-xl font-bold">
                        Transaction Successful
                    </h1>

                    <p className="mt-1 text-gray-500">
                        {tx.type}
                    </p>

                    <h2 className="mt-4 text-4xl font-bold text-green-600">
                        ₦{Number(tx.amount).toLocaleString()}
                    </h2>

                    <span className="mt-3 rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">
                        {tx.status}
                    </span>
                </div>

                <div className="my-6 border-t border-dashed" />

                <div className="space-y-4">
                    <Row
                        label="Reference"
                        value={tx.reference}
                        action={
                            <button onClick={copyReference}>
                                <Copy size={16} />
                            </button>
                        }
                    />

                    <Row
                        label="Description"
                        value={tx.description}
                    />

                    <Row
                        label="Date"
                        value={new Date(
                            tx.createdAt
                        ).toLocaleString("en-NG")}
                    />
                </div>
            </div>

            <button
                onClick={() => window.print()}
                className="mt-6 w-full rounded-2xl bg-green-600 py-4 font-semibold text-white"
            >
                Share / Download Receipt
            </button>
        </main>
    );
}

function Row({
    label,
    value,
    action,
}: {
    label: string;
    value: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs text-gray-500">
                    {label}
                </p>
                <p className="font-medium">{value}</p>
            </div>

            {action}
        </div>
    );
}