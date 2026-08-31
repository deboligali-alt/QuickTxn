"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import ConversionStats from "@/components/admin/airtime/ConversionStats";
import ConversionSearch from "@/components/admin/airtime/ConversionSearch";
import ConversionFilters from "@/components/admin/airtime/ConversionFilters";
import ConversionTable from "@/components/admin/airtime/ConversionTable";

export default function AirtimeConversionsPage() {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");

    return (
        <main className="space-y-8">
            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-gray-100 hover:shadow-md active:scale-95"
            >
                <ArrowLeft size={20} className="text-gray-700" />
            </button>

            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold">
                    Airtime Conversion Center
                </h1>

                <p className="mt-2 text-slate-500">
                    Review, approve and manage all airtime-to-cash conversion requests.
                </p>
            </div>

            {/* Statistics */}
            <ConversionStats />

            {/* Search */}
            <ConversionSearch
                value={search}
                onChange={setSearch}
            />

            {/* Filters */}
            <ConversionFilters
                value={status}
                onChange={setStatus}
            />

            {/* Real API Data */}
            <ConversionTable
                search={search}
                status={status}
            />
        </main>
    );
}