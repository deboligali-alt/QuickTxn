"use client";

import { useCallback, useEffect, useState } from "react";
import {
    RefreshCcw,
    ArrowLeft,
    History,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

import { getSwapHistory } from "@/services/airtimeSwap.service";

interface SwapHistory {
    id: string;
    network: string;
    phone_number: string;
    airtime_amount: number;
    rate: number;
    receivable_amount: number;
    status: string;
    transaction_reference: string;
    created_at: string;
}

export default function AirtimeSwapHistoryPage() {
    const [history, setHistory] = useState<SwapHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const loadHistory = useCallback(async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const token = localStorage.getItem("token");

            if (!token) {
                setErrorMessage(
                    "Please login to view your swap history."
                );
                return;
            }

            const response = await getSwapHistory(token);

            setHistory(response.data || []);
        } catch (error: unknown) {
            console.error(
                "Failed to load swap history:",
                error
            );

            if (axios.isAxiosError<{ message?: string }>(error)) {
                setErrorMessage(
                    error.response?.data?.message ||
                    "Unable to load swap history."
                );
            } else {
                setErrorMessage(
                    "Unable to load swap history."
                );
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const statusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case "APPROVED":
            case "SUCCESS":
                return "bg-green-100 text-green-700";

            case "REJECTED":
            case "FAILED":
                return "bg-red-100 text-red-700";

            case "PENDING":
            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    const networkColor = (network: string) => {
        switch (network.toLowerCase()) {
            case "mtn":
                return "bg-yellow-100 text-yellow-800";

            case "airtel":
                return "bg-red-100 text-red-700";

            case "glo":
                return "bg-green-100 text-green-700";

            case "9mobile":
                return "bg-emerald-100 text-emerald-700";

            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 p-6 sm:p-8">
                <div className="mx-auto max-w-6xl">
                    <div className="flex items-center gap-3">
                        <RefreshCcw
                            size={22}
                            className="animate-spin text-green-600"
                        />

                        <p className="text-slate-600">
                            Loading swap history...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 p-6 sm:p-8">

            <div className="mx-auto max-w-6xl">

                {/* Header */}

                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <Link
                            href="/airtime-swap"
                            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700"
                        >
                            <ArrowLeft size={16} />
                            Back to Airtime Swap
                        </Link>

                        <div className="flex items-center gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                                <History size={24} />
                            </div>

                            <div>

                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                                    Swap History
                                </h1>

                                <p className="mt-1 text-sm text-slate-500">
                                    View all your airtime-to-cash
                                    swap requests.
                                </p>

                            </div>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={loadHistory}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-green-300 hover:text-green-600 disabled:opacity-60"
                    >
                        <RefreshCcw size={17} />
                        Refresh
                    </button>

                </div>

                {/* Error */}

                {errorMessage && (
                    <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
                        {errorMessage}
                    </div>
                )}

                {/* Empty State */}

                {!errorMessage && history.length === 0 && (
                    <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                            <History size={30} />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            No swap history yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Your airtime swap transactions will
                            appear here after you submit your first
                            swap request.
                        </p>

                        <Link
                            href="/airtime-swap"
                            className="mt-6 inline-flex rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                        >
                            Start Airtime Swap
                        </Link>

                    </div>
                )}

                {/* History */}

                {history.length > 0 && (
                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-100 px-6 py-5">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="font-bold text-slate-900">
                                        Your Swap Requests
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {history.length} transaction
                                        {history.length !== 1
                                            ? "s"
                                            : ""}
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[900px]">

                                <thead className="bg-slate-50">

                                    <tr>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Network
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Airtime
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Rate
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Receive
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Status
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Reference
                                        </th>

                                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                            Date
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {history.map((swap) => (

                                        <tr
                                            key={swap.id}
                                            className="border-t border-slate-100 transition hover:bg-slate-50"
                                        >

                                            <td className="px-6 py-5">

                                                <span
                                                    className={`inline-flex rounded-lg px-3 py-1.5 text-xs font-bold ${networkColor(
                                                        swap.network
                                                    )}`}
                                                >
                                                    {swap.network}
                                                </span>

                                            </td>

                                            <td className="px-6 py-5">

                                                <p className="font-bold text-slate-900">
                                                    ₦
                                                    {Number(
                                                        swap.airtime_amount
                                                    ).toLocaleString(
                                                        "en-NG"
                                                    )}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    {swap.phone_number}
                                                </p>

                                            </td>

                                            <td className="px-6 py-5">

                                                <span className="font-semibold text-green-600">
                                                    {Number(
                                                        swap.rate
                                                    )}
                                                    %
                                                </span>

                                            </td>

                                            <td className="px-6 py-5">

                                                <p className="font-bold text-slate-900">
                                                    ₦
                                                    {Number(
                                                        swap.receivable_amount
                                                    ).toLocaleString(
                                                        "en-NG"
                                                    )}
                                                </p>

                                            </td>

                                            <td className="px-6 py-5">

                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusColor(
                                                        swap.status
                                                    )}`}
                                                >
                                                    {swap.status}
                                                </span>

                                            </td>

                                            <td className="px-6 py-5">

                                                <span className="font-mono text-xs text-slate-500">
                                                    {swap.transaction_reference}
                                                </span>

                                            </td>

                                            <td className="px-6 py-5 text-sm text-slate-500">

                                                {new Date(
                                                    swap.created_at
                                                ).toLocaleString(
                                                    "en-NG"
                                                )}

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>
                )}

            </div>

        </main>
    );
}