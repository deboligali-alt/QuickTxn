"use client";

import { Search } from "lucide-react";

interface Props {
    search: string;
    setSearch: (value: string) => void;
    filter: string;
    setFilter: (value: string) => void;
}

export default function TransactionFilter({
    search,
    setSearch,
    filter,
    setFilter,
}: Props) {
    return (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                    type="text"
                    placeholder="Search transactions..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border bg-white py-3 pl-10 pr-4 outline-none focus:border-green-500"
                />
            </div>

            <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-xl border bg-white px-4 py-3 outline-none focus:border-green-500"
            >
                <option value="ALL">All</option>
                <option value="CREDIT">Credit</option>
                <option value="DEBIT">Debit</option>
            </select>
        </div>
    );
}