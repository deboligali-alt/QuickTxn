"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { getAllSwaps } from "@/services/admin.service";
import api from "@/lib/api";

interface Conversion {
    id: string;
    full_name: string;
    email: string;
    network: string;
    phone_number: string;
    airtime_amount: number | string;
    receivable_amount: number | string;
    rate: number | string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    transaction_reference: string;
    created_at: string;
}

interface ConversionTableProps {
    search?: string;
    status?: string;
}

export default function ConversionTable({
    search = "",
    status = "All",
}: ConversionTableProps) {
    const [conversions, setConversions] = useState<Conversion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadSwaps = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");
            if (!token) {
                setError("You are not logged in.");
                return;
            }

            const response = await getAllSwaps(token);

            if (!response.success) {
                setError(response.message || "Unable to load swaps.");
                return;
            }

            setConversions(response.data || []);
        } catch {
            setError("Unable to load airtime swap requests.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSwaps();
    }, [loadSwaps]);

    const approveSwap = async (id: string) => {
        try {
            await api.patch(`/admin/airtime-swaps/${id}/approve`);
            alert("Wallet credited successfully.");
            loadSwaps();
        } catch (err: any) {
            alert(err.response?.data?.message || "Approval failed");
        }
    };

    const rejectSwap = async (id: string) => {
        const reason =
            prompt("Reason for rejection") || "Rejected by admin";

        try {
            await api.patch(`/admin/airtime-swaps/${id}/reject`, {
                rejectionReason: reason,
            });

            alert("Swap rejected.");
            loadSwaps();
        } catch (err: any) {
            alert(err.response?.data?.message || "Rejection failed");
        }
    };

    const filtered = conversions.filter((item) => {
        const q = search.toLowerCase().trim();

        const matchesSearch =
            !q ||
            item.full_name?.toLowerCase().includes(q) ||
            item.email?.toLowerCase().includes(q) ||
            item.phone_number?.toLowerCase().includes(q) ||
            item.transaction_reference?.toLowerCase().includes(q) ||
            item.network?.toLowerCase().includes(q);

        const matchesStatus =
            status === "All" || item.status === status.toUpperCase();

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="rounded-2xl bg-white p-10 text-center shadow">
                Loading airtime conversions...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl bg-white p-10 text-center shadow">
                <p className="font-semibold text-red-600">{error}</p>

                <button
                    onClick={loadSwaps}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white"
                >
                    <RefreshCw size={16} />
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow">
            <div className="flex items-center justify-between border-b p-4">
                <div>
                    <h3 className="font-bold">Airtime Conversions</h3>
                    <p className="text-sm text-gray-500">
                        {filtered.length} of {conversions.length} requests
                    </p>
                </div>

                <button
                    onClick={loadSwaps}
                    className="flex items-center gap-2 rounded-lg border px-3 py-2"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 text-left">Reference</th>
                            <th className="p-4 text-left">Customer</th>
                            <th className="p-4 text-left">Network</th>
                            <th className="p-4 text-left">Airtime</th>
                            <th className="p-4 text-left">Receive</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Time</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="p-10 text-center text-gray-500"
                                >
                                    No requests found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="p-4 font-semibold">
                                        {item.transaction_reference}
                                    </td>

                                    <td className="p-4">
                                        <p className="font-semibold">
                                            {item.full_name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {item.phone_number}
                                        </p>
                                    </td>

                                    <td className="p-4">{item.network}</td>

                                    <td className="p-4">
                                        ₦
                                        {Number(
                                            item.airtime_amount
                                        ).toLocaleString("en-NG")}
                                    </td>

                                    <td className="p-4 font-bold text-green-600">
                                        ₦
                                        {Number(
                                            item.receivable_amount
                                        ).toLocaleString("en-NG")}
                                    </td>

                                    <td className="p-4">
                                        <StatusBadge status={item.status} />
                                    </td>

                                    <td className="p-4 text-sm">
                                        {new Date(item.created_at).toLocaleString(
                                            "en-NG"
                                        )}
                                    </td>

                                    <td className="p-4">
                                        {item.status === "PENDING" ? (
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => approveSwap(item.id)}
                                                    className="flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                                                >
                                                    <CheckCircle2 size={15} />
                                                    Approve
                                                </button>

                                                <button
                                                    onClick={() => rejectSwap(item.id)}
                                                    className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                                                >
                                                    <XCircle size={15} />
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">
                                                Completed
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}