"use client";

import { Search } from "lucide-react";

interface ConversionSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export default function ConversionSearch({
    value,
    onChange,
}: ConversionSearchProps) {
    return (
        <div className="relative">

            <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search by customer, phone or reference..."
                className="w-full rounded-xl border bg-white py-3 pl-11 pr-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />

        </div>
    );
}