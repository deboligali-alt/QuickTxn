"use client";
import { Eye } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
    Search,
    ArrowDownLeft,
    ArrowUpRight,
    Wallet,
    Filter,
    RefreshCw,
} from "lucide-react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

const router = useRouter();

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
}

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");

    const loadTransactions = async () => {
        try {
            const res = await api.get("/transactions?limit=100");
            setTransactions(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    const filtered = useMemo(() => {
        return transactions.filter((tx) => {
            const matchesSearch =
                tx.reference.toLowerCase().includes(search.toLowerCase()) ||
                tx.description.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                status === "ALL" ? true : tx.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [transactions, search, status]);

    const totalVolume = filtered.reduce(
        (sum, tx) => sum + Number(tx.amount),
        0
    );

    const successful = filtered.filter(
        (tx) => tx.status === "SUCCESS"
    ).length;

    const pending = filtered.filter(
        (tx) => tx.status === "PENDING"
    ).length;

    return (
        <main className="mx-auto max-w-7xl space-y-8 p-8">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold">
                        Transactions
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Monitor all wallet and airtime transactions.
                    </p>
                </div>

                <button
                    onClick={loadTransactions}
                    className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                >
                    <RefreshCw size={18} />
                    Refresh
                </button>
            </div>

            {/* Stats */}

            <div className="grid gap-5 md:grid-cols-3">

                <StatCard
                    title="Total Volume"
                    value={`₦${totalVolume.toLocaleString("en-NG")}`}
                    icon={Wallet}
                    color="green"
                />

                <StatCard
                    title="Successful"
                    value={successful}
                    icon={ArrowDownLeft}
                    color="blue"
                />

                <StatCard
                    title="Pending"
                    value={pending}
                    icon={ArrowUpRight}
                    color="yellow"
                />

            </div>

            {/* Filters */}

            <div className="rounded-2xl bg-white p-5 shadow">

                <div className="flex flex-col gap-4 md:flex-row">

                    <div className="relative flex-1">

                        <Search
                            className="absolute left-4 top-3.5 text-slate-400"
                            size={18}
                        />

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search reference or description..."
                            className="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:border-green-600"
                        />

                    </div>

                    <div className="relative">

                        <Filter
                            className="absolute left-3 top-3.5 text-slate-400"
                            size={18}
                        />

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="rounded-xl border py-3 pl-10 pr-8 outline-none focus:border-green-600"
                        >
                            <option value="ALL">All Status</option>
                            <option value="SUCCESS">Success</option>
                            <option value="PENDING">Pending</option>
                            <option value="FAILED">Failed</option>
                        </select>

                    </div>

                </div>

            </div>

            {/* Table */}

            <div className="overflow-hidden rounded-2xl bg-white shadow">

                <table className="min-w-full">

                    <thead className="bg-slate-100 text-left text-sm">

                        <tr>

                            <th className="px-6 py-4">Reference</th>

                            <th className="px-6 py-4">Type</th>

                            <th className="px-6 py-4">Amount</th>

                            <th className="px-6 py-4">Status</th>

                            <th className="px-6 py-4">Date</th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>
                                <td
                                    colSpan={5}
                                    className="py-10 text-center"
                                >
                                    Loading...
                                </td>
                            </tr>

                        ) : filtered.length === 0 ? (

                            <tr>
                                <td
                                    colSpan={5}
                                    className="py-10 text-center text-slate-500"
                                >
                                    No transactions found.
                                </td>
                            </tr>

                        ) : (

                            filtered.map((tx) => (

                                <tr
                                    key={tx.id}
                                    className="border-b hover:bg-slate-50"
                                >

                                    <td className="px-6 py-5 font-medium">
                                        {tx.reference}
                                    </td>

                                    <td className="px-6 py-5">
                                        {tx.type}
                                    </td>

                                    <td className="px-6 py-5 font-semibold text-green-600">
                                        ₦{Number(tx.amount).toLocaleString("en-NG")}
                                    </td>

                                    <td className="px-6 py-5">

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${tx.status === "SUCCESS"
                                                ? "bg-green-100 text-green-700"
                                                : tx.status === "PENDING"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {tx.status}
                                        </span>

                                    </td>

                                    <td className="px-6 py-5">
                                        <button
                                            onClick={() => router.push(`/admin/transactions/${tx.id}`)}
                                            className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-700"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </main>
    );
}

function StatCard({
    title,
    value,
    icon: Icon,
    color,
}: any) {
    const colors = {
        green: "bg-green-100 text-green-700",
        blue: "bg-blue-100 text-blue-700",
        yellow: "bg-yellow-100 text-yellow-700",
    };

    return (
        <div className="rounded-2xl bg-white p-6 shadow">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-slate-500">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {value}
                    </h2>

                </div>

                <div
                    className={`rounded-xl p-3 ${colors[color as keyof typeof colors]}`}
                >
                    <Icon size={24} />
                </div>

            </div>

        </div>
    );
}