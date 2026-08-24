"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { getAllSwaps } from "@/services/admin.service";

interface Conversion {
    id: string;
    full_name: string;
    email: string;
    network: string;
    phone_number: string;
    airtime_amount: number | string;
    receivable_amount: number | string;
    rate: number | string;
    status: string;
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

            if (!response?.success) {
                setError(
                    response?.message ||
                    "Unable to load airtime swaps."
                );
                return;
            }

            setConversions(response.data || []);

        } catch (err) {
            console.error("Failed to load airtime swaps:", err);

            setError(
                "Unable to load airtime swap requests."
            );

        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSwaps();
    }, [loadSwaps]);

    const filteredConversions = conversions.filter((item) => {

        const searchValue = search
            .toLowerCase()
            .trim();

        const matchesSearch =
            !searchValue ||
            item.full_name
                ?.toLowerCase()
                .includes(searchValue) ||
            item.email
                ?.toLowerCase()
                .includes(searchValue) ||
            item.phone_number
                ?.toLowerCase()
                .includes(searchValue) ||
            item.transaction_reference
                ?.toLowerCase()
                .includes(searchValue) ||
            item.network
                ?.toLowerCase()
                .includes(searchValue);

        const matchesStatus =
            status === "All" ||
            item.status === status.toUpperCase();

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="rounded-2xl bg-white p-10 text-center shadow">
                <p className="text-slate-500">
                    Loading airtime conversions...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl bg-white p-10 text-center shadow">
                <p className="font-semibold text-red-600">
                    {error}
                </p>

                <button
                    type="button"
                    onClick={loadSwaps}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                >
                    <RefreshCw size={16} />
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow">

            <div className="flex items-center justify-between border-b p-4">

                <div>
                    <p className="font-semibold">
                        Airtime Conversions
                    </p>

                    <p className="text-sm text-slate-500">
                        Showing {filteredConversions.length} of{" "}
                        {conversions.length} requests
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadSwaps}
                    className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full min-w-[1000px]">

                    <thead className="bg-slate-100">

                        <tr>

                            <th className="p-4 text-left">
                                Reference
                            </th>

                            <th className="p-4 text-left">
                                Customer
                            </th>

                            <th className="p-4 text-left">
                                Network
                            </th>

                            <th className="p-4 text-left">
                                Amount
                            </th>

                            <th className="p-4 text-left">
                                Receive
                            </th>

                            <th className="p-4 text-left">
                                Status
                            </th>

                            <th className="p-4 text-left">
                                Time
                            </th>

                            <th className="p-4 text-center">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredConversions.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={8}
                                    className="p-10 text-center text-slate-500"
                                >
                                    No airtime conversions found.
                                </td>

                            </tr>

                        ) : (

                            filteredConversions.map((item) => (

                                <tr
                                    key={item.id}
                                    className="border-t hover:bg-slate-50"
                                >

                                    <td className="p-4 font-semibold">
                                        {item.transaction_reference}
                                    </td>

                                    <td className="p-4">

                                        <p className="font-semibold">
                                            {item.full_name}
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            {item.phone_number}
                                        </p>

                                    </td>

                                    <td className="p-4">
                                        {item.network}
                                    </td>

                                    <td className="p-4">
                                        ₦
                                        {Number(
                                            item.airtime_amount
                                        ).toLocaleString("en-NG", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </td>

                                    <td className="p-4 font-semibold text-green-600">
                                        ₦
                                        {Number(
                                            item.receivable_amount
                                        ).toLocaleString("en-NG", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </td>

                                    <td className="p-4">

                                        <StatusBadge
                                            status={item.status}
                                        />

                                    </td>

                                    <td className="p-4">

                                        {new Date(
                                            item.created_at
                                        ).toLocaleString(
                                            "en-NG",
                                            {
                                                dateStyle: "short",
                                                timeStyle: "short",
                                            }
                                        )}

                                    </td>

                                    <td className="p-4 text-center">

                                        <Link
                                            href={`/admin/airtime-swaps/${item.id}`}
                                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                                        >
                                            View
                                        </Link>

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