"use client";

import { useEffect, useState } from "react";
import {
    Search,
    MessageSquare,
    Clock3,
    CheckCircle2,
    RefreshCw,
} from "lucide-react";
import api from "@/lib/api";

interface Ticket {
    id: string;
    full_name: string;
    email: string;
    subject: string;
    message: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
    created_at: string;
}

export default function SupportPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<Ticket | null>(null);

    const loadTickets = async () => {
        const res = await api.get("/admin/support");
        setTickets(res.data.data || []);
    };

    useEffect(() => {
        loadTickets();
    }, []);

    const updateStatus = async (
        id: string,
        status: string
    ) => {
        await api.patch(`/admin/support/${id}`, { status });
        loadTickets();
        setSelected(null);
    };

    const filtered = tickets.filter(
        (t) =>
            t.full_name
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            t.subject
                .toLowerCase()
                .includes(search.toLowerCase())
    );

    return (
        <main className="mx-auto max-w-7xl space-y-8 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold">
                        Support Tickets
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Resolve customer complaints and disputes.
                    </p>
                </div>

                <button
                    onClick={loadTickets}
                    className="rounded-xl bg-green-600 p-3 text-white"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            <div className="relative">
                <Search
                    className="absolute left-4 top-3.5 text-slate-400"
                    size={18}
                />

                <input
                    placeholder="Search customer or subject..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border py-3 pl-11 pr-4"
                />
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow">
                <table className="min-w-full">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="px-5 py-4 text-left">
                                Customer
                            </th>
                            <th className="px-5 py-4 text-left">
                                Subject
                            </th>
                            <th className="px-5 py-4 text-left">
                                Priority
                            </th>
                            <th className="px-5 py-4 text-left">
                                Status
                            </th>
                            <th className="px-5 py-4 text-left">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((ticket) => (
                            <tr
                                key={ticket.id}
                                className="border-b hover:bg-slate-50"
                            >
                                <td className="px-5 py-5">
                                    <p className="font-semibold">
                                        {ticket.full_name}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        {ticket.email}
                                    </p>
                                </td>

                                <td className="px-5 py-5">
                                    {ticket.subject}
                                </td>

                                <td className="px-5 py-5">
                                    <PriorityBadge
                                        value={ticket.priority}
                                    />
                                </td>

                                <td className="px-5 py-5">
                                    <StatusBadge
                                        value={ticket.status}
                                    />
                                </td>

                                <td className="px-5 py-5">
                                    <button
                                        onClick={() => setSelected(ticket)}
                                        className="rounded-lg bg-green-600 p-2 text-white"
                                    >
                                        <MessageSquare size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl rounded-3xl bg-white p-6">
                        <h2 className="mb-4 text-2xl font-bold">
                            {selected.subject}
                        </h2>

                        <p className="mb-4 text-slate-600">
                            {selected.message}
                        </p>

                        <textarea
                            rows={4}
                            placeholder="Write your reply..."
                            className="w-full rounded-xl border p-3"
                        />

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() =>
                                    updateStatus(
                                        selected.id,
                                        "IN_PROGRESS"
                                    )
                                }
                                className="flex-1 rounded-xl bg-yellow-500 py-3 text-white"
                            >
                                In Progress
                            </button>

                            <button
                                onClick={() =>
                                    updateStatus(
                                        selected.id,
                                        "RESOLVED"
                                    )
                                }
                                className="flex-1 rounded-xl bg-green-600 py-3 text-white"
                            >
                                Resolve
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

function PriorityBadge({
    value,
}: {
    value: string;
}) {
    const colors = {
        LOW: "bg-green-100 text-green-700",
        MEDIUM: "bg-yellow-100 text-yellow-700",
        HIGH: "bg-red-100 text-red-700",
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${colors[value as keyof typeof colors]}`}
        >
            {value}
        </span>
    );
}

function StatusBadge({
    value,
}: {
    value: string;
}) {
    const map = {
        OPEN: "bg-blue-100 text-blue-700",
        IN_PROGRESS:
            "bg-yellow-100 text-yellow-700",
        RESOLVED:
            "bg-green-100 text-green-700",
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${map[value as keyof typeof map]}`}
        >
            {value}
        </span>
    );
}