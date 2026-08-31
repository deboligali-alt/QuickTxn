"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { toast } from "sonner";

interface Swap {
    id: string;
    full_name: string;
    network: string;
    phone_number: string;
    airtime_amount: number;
    receivable_amount: number;
    rate: number;
    screenshot: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    created_at: string;
}

export default function ConversionTable({
    search,
    status,
}: {
    search: string;
    status: string;
}) {
    const [swaps, setSwaps] = useState<Swap[]>([]);
    const [selected, setSelected] = useState<Swap | null>(null);

    const loadSwaps = async () => {
        try {
            const res = await api.get("/admin/airtime-swaps");
            setSwaps(res.data.data);
        } catch {
            toast.error("Unable to load requests");
        }
    };

    useEffect(() => {
        loadSwaps();
    }, []);

    const filtered = swaps.filter((item) => {
        const matchSearch = item.full_name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchStatus =
            status === "All" || item.status === status;

        return matchSearch && matchStatus;
    });

    const approve = async (id: string) => {
        await api.patch(`/admin/airtime-swaps/${id}/approve`);
        toast.success("Wallet credited successfully");
        loadSwaps();
        setSelected(null);
    };

    const reject = async (id: string) => {
        await api.patch(`/admin/airtime-swaps/${id}/reject`, {
            rejectionReason: "Rejected by admin",
        });

        toast.success("Request rejected");
        loadSwaps();
        setSelected(null);
    };

    return (
        <>
            <div className="overflow-hidden rounded-2xl bg-white shadow">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr className="text-left text-sm">
                            <th className="p-4">User</th>
                            <th>Receive</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((swap) => (
                            <tr key={swap.id} className="border-t">
                                <td className="p-4">
                                    <p className="font-semibold">
                                        {swap.full_name}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {swap.network} • {swap.phone_number}
                                    </p>
                                </td>

                                <td>
                                    <p className="font-bold text-green-600">
                                        ₦
                                        {swap.receivable_amount.toLocaleString()}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        from ₦
                                        {swap.airtime_amount.toLocaleString()}
                                    </p>
                                </td>

                                <td>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs ${swap.status === "PENDING"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : swap.status === "APPROVED"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {swap.status}
                                    </span>
                                </td>

                                <td>
                                    <button
                                        onClick={() => setSelected(swap)}
                                        className="text-green-600"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Preview Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-6">
                        <h2 className="text-xl font-bold">
                            Airtime Conversion
                        </h2>

                        <div className="mt-4 space-y-2 text-sm">
                            <p>
                                <b>User:</b> {selected.full_name}
                            </p>

                            <p>
                                <b>Network:</b> {selected.network}
                            </p>

                            <p>
                                <b>Phone:</b> {selected.phone_number}
                            </p>

                            <p>
                                <b>Sent:</b> ₦
                                {selected.airtime_amount.toLocaleString()}
                            </p>

                            <p className="text-green-600">
                                <b>User Receives:</b> ₦
                                {selected.receivable_amount.toLocaleString()}
                            </p>

                            <p>
                                <b>Rate:</b> {selected.rate}%
                            </p>
                        </div>

                        <img
                            src={selected.screenshot}
                            alt="Receipt"
                            className="mt-5 h-64 w-full rounded-xl object-cover"
                        />

                        {selected.status === "PENDING" && (
                            <div className="mt-5 flex gap-3">
                                <button
                                    onClick={() => approve(selected.id)}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold text-white"
                                >
                                    <CheckCircle size={18} />
                                    Approve
                                </button>

                                <button
                                    onClick={() => reject(selected.id)}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold text-white"
                                >
                                    <XCircle size={18} />
                                    Reject
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => setSelected(null)}
                            className="mt-3 w-full rounded-xl border py-3"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}