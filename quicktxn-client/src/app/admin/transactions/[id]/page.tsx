"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    CheckCircle2,
    Clock3,
    XCircle,
    Receipt,
    User,
    Wallet,
    Calendar,
    Hash,
} from "lucide-react";
import api from "@/lib/axios";

interface Transaction {
    id: string;
    reference: string;
    type: string;
    amount: number;
    status: string;
    description: string;
    created_at: string;
    sender_name?: string;
    receiver_name?: string;
    sender_email?: string;
    receiver_email?: string;
}

export default function TransactionDetailsPage() {
    const { id } = useParams();
    const router = useRouter();

    const [tx, setTx] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get(`/transactions/${id}`);
                setTx(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) load();
    }, [id]);

    if (loading) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center">
                Loading transaction...
            </main>
        );
    }

    if (!tx) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center">
                Transaction not found.
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-4xl space-y-8 p-8">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-green-600 hover:underline"
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-8 text-white shadow-xl">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-green-100">Transaction Receipt</p>
                        <h1 className="mt-2 text-3xl font-bold">
                            ₦{Number(tx.amount).toLocaleString("en-NG")}
                        </h1>
                    </div>

                    <div className="rounded-full bg-white/20 p-4">
                        <Receipt size={34} />
                    </div>
                </div>

                <div className="mt-6">
                    <StatusBadge status={tx.status} />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Info
                    icon={<Hash size={18} />}
                    label="Reference"
                    value={tx.reference}
                />

                <Info
                    icon={<Wallet size={18} />}
                    label="Transaction Type"
                    value={tx.type}
                />

                <Info
                    icon={<User size={18} />}
                    label="Sender"
                    value={tx.sender_name || "System"}
                />

                <Info
                    icon={<User size={18} />}
                    label="Receiver"
                    value={tx.receiver_name || "User"}
                />

                <Info
                    icon={<Calendar size={18} />}
                    label="Date"
                    value={new Date(tx.created_at).toLocaleString("en-NG")}
                />

                <Info
                    icon={<Receipt size={18} />}
                    label="Description"
                    value={tx.description}
                />
            </div>

            <div className="rounded-2xl bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-bold">
                    Transaction Summary
                </h2>

                <Row
                    title="Amount"
                    value={`₦${Number(tx.amount).toLocaleString("en-NG")}`}
                />

                <Row
                    title="Status"
                    value={tx.status}
                />

                <Row
                    title="Reference"
                    value={tx.reference}
                />

                <Row
                    title="Type"
                    value={tx.type}
                />
            </div>
        </main>
    );
}

function StatusBadge({
    status,
}: {
    status: string;
}) {
    if (status === "SUCCESS") {
        return (
            <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">
                <CheckCircle2 size={18} />
                SUCCESS
            </span>
        );
    }

    if (status === "PENDING") {
        return (
            <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 font-semibold text-yellow-700">
                <Clock3 size={18} />
                PENDING
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 font-semibold text-red-700">
            <XCircle size={18} />
            FAILED
        </span>
    );
}

function Info({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl bg-white p-5 shadow">
            <div className="mb-2 flex items-center gap-2 text-slate-500">
                {icon}
                {label}
            </div>

            <p className="break-all text-lg font-semibold">
                {value}
            </p>
        </div>
    );
}

function Row({
    title,
    value,
}: {
    title: string;
    value: string;
}) {
    return (
        <div className="flex justify-between border-b py-3">
            <span className="text-slate-500">{title}</span>
            <strong>{value}</strong>
        </div>
    );
}