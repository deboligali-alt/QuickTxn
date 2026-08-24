"use client";

import {
    CheckCircle,
    XCircle,
    Smartphone,
    User,
    Wallet,
    RefreshCw,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    getSwap,
    approveSwap,
    rejectSwap,
} from "@/services/admin.service";

interface Swap {
    id: string;
    user_id: string;
    full_name: string;
    email: string;
    phone: string;
    network: string;
    phone_number: string;
    airtime_amount: number | string;
    rate: number | string;
    receivable_amount: number | string;
    status: string;
    transaction_reference: string;
    admin_note?: string | null;
    rejection_reason?: string | null;
    screenshot?: string | null;
    created_at: string;
    updated_at: string;
    approved_by?: string | null;
    approved_at?: string | null;
}

export default function ConversionDetailsPage() {

    const params = useParams();
    const router = useRouter();

    const id = params.id as string;

    const [swap, setSwap] = useState<Swap | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    const loadSwap = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setError("You are not logged in.");
                return;
            }

            const response = await getSwap(token, id);

            if (!response?.success) {
                setError(
                    response?.message ||
                    "Unable to load airtime swap."
                );
                return;
            }
            console.log("Swap response:", response.data);

            setSwap(response.data);

        } catch (err) {
            console.error("Failed to load swap:", err);

            setError(
                "Unable to load airtime conversion details."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadSwap();
        }
    }, [id]);

    const handleApprove = async () => {
        if (!swap || swap.status !== "PENDING") return;

        const confirmed = window.confirm(
            `Approve ${swap.transaction_reference} and credit ₦${Number(
                swap.receivable_amount
            ).toLocaleString()} to the user's wallet?`
        );

        if (!confirmed) return;

        try {
            setProcessing(true);
            setError("");

            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You are not logged in.");
                return;
            }

            const res = await approveSwap(token, swap.id);

            if (!res.success) {
                toast.error(res.message);
                return;
            }

            toast.success("Airtime swap approved successfully!");
            await loadSwap();
        } catch (err: any) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Approval failed."
            );
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!swap || swap.status !== "PENDING") return;

        const reason = window.prompt("Enter rejection reason:");

        if (!reason?.trim()) {
            toast.error("Rejection reason is required.");
            return;
        }

        try {
            setProcessing(true);
            setError("");

            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You are not logged in.");
                return;
            }

            const res = await rejectSwap(
                token,
                swap.id,
                reason.trim()
            );

            if (!res.success) {
                toast.error(res.message);
                return;
            }

            toast.success("Airtime swap rejected successfully!");
            await loadSwap();
        } catch (err: any) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Rejection failed."
            );
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <main className="flex min-h-[500px] items-center justify-center">

                <div className="flex items-center gap-3 text-slate-500">

                    <RefreshCw
                        size={20}
                        className="animate-spin"
                    />

                    Loading conversion details...

                </div>

            </main>
        );
    }

    if (error && !swap) {
        return (
            <main className="mx-auto max-w-4xl">

                <div className="rounded-2xl bg-white p-10 text-center shadow">

                    <p className="font-semibold text-red-600">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadSwap}
                        className="mt-5 rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
                    >
                        Try Again
                    </button>

                </div>

            </main>
        );
    }

    if (!swap) {
        return null;
    }

    const isPending =
        swap.status === "PENDING";

    const airtimeAmount =
        Number(swap.airtime_amount);

    const receivableAmount =
        Number(swap.receivable_amount);

    const profit =
        airtimeAmount - receivableAmount;

    return (
        <main className="mx-auto max-w-6xl space-y-8">

            {/* Header */}

            <div>

                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-4 text-sm font-medium text-green-600 hover:underline"
                >
                    ← Back to Airtime Conversions
                </button>

                <h1 className="text-4xl font-bold">
                    Airtime Conversion Details
                </h1>

                <p className="mt-2 text-slate-500">
                    Review this conversion request.
                </p>

            </div>

            {/* Error */}

            {error && (
                <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600">
                    {error}
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-3">

                {/* Customer Information */}

                <div className="rounded-2xl bg-white p-6 shadow lg:col-span-2">

                    <h2 className="mb-6 text-2xl font-semibold">
                        Customer Information
                    </h2>

                    <div className="grid gap-6 md:grid-cols-2">

                        <Info
                            icon={<User size={20} />}
                            label="Customer"
                            value={swap.full_name || "Unknown"}
                        />

                        <Info
                            icon={<Smartphone size={20} />}
                            label="Phone"
                            value={swap.phone_number}
                        />

                        <Info
                            icon={<Wallet size={20} />}
                            label="Network"
                            value={swap.network}
                        />

                        <Info
                            icon={<Wallet size={20} />}
                            label="Reference"
                            value={swap.transaction_reference}
                        />

                        <Info
                            icon={<Wallet size={20} />}
                            label="Airtime Amount"
                            value={`₦${airtimeAmount.toLocaleString(
                                "en-NG",
                                {
                                    minimumFractionDigits: 2,
                                }
                            )}`}
                        />

                        <Info
                            icon={<Wallet size={20} />}
                            label="Cash to Credit"
                            value={`₦${receivableAmount.toLocaleString(
                                "en-NG",
                                {
                                    minimumFractionDigits: 2,
                                }
                            )}`}
                        />

                        <Info
                            icon={<Wallet size={20} />}
                            label="Exchange Rate"
                            value={`${Number(swap.rate)}%`}
                        />

                        <Info
                            icon={<Wallet size={20} />}
                            label="Status"
                            value={swap.status}
                        />

                    </div>

                </div>

                {/* Summary */}

                <div className="rounded-2xl bg-white p-6 shadow">

                    <h2 className="mb-6 text-xl font-semibold">
                        Quick Summary
                    </h2>

                    <div className="space-y-4">

                        <Summary
                            title="Receive Airtime"
                            value={`₦${airtimeAmount.toLocaleString(
                                "en-NG"
                            )}`}
                        />

                        <Summary
                            title="Wallet Credit"
                            value={`₦${receivableAmount.toLocaleString(
                                "en-NG"
                            )}`}
                        />

                        <Summary
                            title="Profit"
                            value={`₦${profit.toLocaleString(
                                "en-NG"
                            )}`}
                        />

                        <Summary
                            title="Status"
                            value={swap.status}
                        />

                    </div>

                </div>

            </div>

            {/* Screenshot */}

            <div className="rounded-2xl bg-white p-6 shadow">

                <h2 className="mb-6 text-2xl font-semibold">
                    Airtime Transfer Proof
                </h2>

                {swap.screenshot ? (

                    <img
                        src={swap.screenshot}
                        alt="Airtime transfer proof"
                        className="max-h-[600px] rounded-xl object-contain"
                    />

                ) : (

                    <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed text-slate-400">
                        No transfer screenshot uploaded.
                    </div>

                )}

            </div>

            {/* Actions */}

            {isPending && (

                <div className="flex flex-wrap gap-4">

                    <button
                        type="button"
                        onClick={handleApprove}
                        disabled={processing}
                        className="flex items-center gap-2 rounded-xl bg-green-600 px-8 py-4 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        <CheckCircle size={20} />

                        {processing
                            ? "Processing..."
                            : "Approve Conversion"}

                    </button>

                    <button
                        type="button"
                        onClick={handleReject}
                        disabled={processing}
                        className="flex items-center gap-2 rounded-xl bg-red-600 px-8 py-4 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        <XCircle size={20} />

                        Reject Conversion

                    </button>

                </div>

            )}

            {!isPending && (

                <div className="rounded-xl bg-slate-100 p-5">

                    <p className="font-semibold">
                        This conversion has already been{" "}
                        {swap.status.toLowerCase()}.
                    </p>

                    {swap.approved_at && (
                        <p className="mt-1 text-sm text-slate-500">
                            Approved at:{" "}
                            {new Date(
                                swap.approved_at
                            ).toLocaleString("en-NG")}
                        </p>
                    )}

                    {swap.rejection_reason && (
                        <p className="mt-1 text-sm text-red-600">
                            Reason: {swap.rejection_reason}
                        </p>
                    )}

                </div>

            )}

        </main>
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
        <div className="rounded-xl bg-slate-50 p-4">

            <div className="mb-2 flex items-center gap-2 text-slate-500">
                {icon}
                {label}
            </div>

            <p className="break-words text-lg font-semibold">
                {value}
            </p>

        </div>
    );
}

function Summary({
    title,
    value,
}: {
    title: string;
    value: string;
}) {
    return (
        <div className="flex justify-between gap-4 border-b pb-3">

            <span className="text-slate-500">
                {title}
            </span>

            <strong>
                {value}
            </strong>

        </div>
    );
}