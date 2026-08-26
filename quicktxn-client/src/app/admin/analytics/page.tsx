
"use client";

import { useEffect, useState } from "react";
import {
    TrendingUp,
    Wallet,
    Users,
    ArrowLeftRight,
    Smartphone,
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";
import api from "@/lib/api";

interface Analytics {
    totalUsers: number;
    totalWalletBalance: number;
    totalTransactions: number;
    totalAirtimeSwaps: number;
    pendingSwaps: number;
    approvedSwaps: number;
    rejectedSwaps: number;
}

export default function AnalyticsPage() {
    const [data, setData] = useState<Analytics | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get("/admin/dashboard");
                setData(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };

        load();
    }, []);

    if (!data) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center">
                Loading analytics...
            </main>
        );
    }

    const approvalRate = Math.round(
        (data.approvedSwaps /
            Math.max(data.totalAirtimeSwaps, 1)) *
        100
    );

    return (
        <main className="mx-auto max-w-7xl space-y-8 p-8">

            {/* Hero */}

            <section className="rounded-3xl bg-gradient-to-r from-emerald-600 to-green-500 p-8 text-white">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="mb-2 text-green-100">
                            SUPER ADMIN
                        </p>

                        <h1 className="text-4xl font-bold">
                            Platform Analytics
                        </h1>

                        <p className="mt-2 text-green-100">
                            Real-time business performance overview
                        </p>

                    </div>

                    <TrendingUp size={60} />

                </div>

            </section>

            {/* Main Metrics */}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <MetricCard
                    title="Users"
                    value={data.totalUsers}
                    icon={Users}
                    color="bg-green-100 text-green-700"
                />

                <MetricCard
                    title="Wallet"
                    value={`₦${Number(data.totalWalletBalance).toLocaleString("en-NG")}`}
                    icon={Wallet}
                    color="bg-blue-100 text-blue-700"
                />

                <MetricCard
                    title="Transactions"
                    value={data.totalTransactions}
                    icon={ArrowLeftRight}
                    color="bg-purple-100 text-purple-700"
                />

                <MetricCard
                    title="Airtime Swaps"
                    value={data.totalAirtimeSwaps}
                    icon={Smartphone}
                    color="bg-yellow-100 text-yellow-700"
                />

            </div>

            {/* Analytics */}

            <div className="grid gap-6 lg:grid-cols-3">

                <div className="rounded-3xl bg-white p-6 shadow">

                    <h3 className="mb-5 text-xl font-bold">
                        Swap Status
                    </h3>

                    <StatusRow
                        icon={Clock3}
                        label="Pending"
                        value={data.pendingSwaps}
                        color="text-yellow-600"
                    />

                    <StatusRow
                        icon={CheckCircle2}
                        label="Approved"
                        value={data.approvedSwaps}
                        color="text-green-600"
                    />

                    <StatusRow
                        icon={XCircle}
                        label="Rejected"
                        value={data.rejectedSwaps}
                        color="text-red-600"
                    />

                </div>

                <div className="rounded-3xl bg-white p-6 shadow lg:col-span-2">

                    <h3 className="mb-5 text-xl font-bold">
                        Approval Performance
                    </h3>

                    <div className="mb-4 flex items-end justify-between">

                        <span className="text-slate-500">
                            Success Rate
                        </span>

                        <span className="text-4xl font-bold text-green-600">
                            {approvalRate}%
                        </span>

                    </div>

                    <div className="h-4 overflow-hidden rounded-full bg-slate-200">

                        <div
                            className="h-full rounded-full bg-green-600"
                            style={{ width: `${approvalRate}%` }}
                        />

                    </div>

                    <div className="mt-8 grid grid-cols-3 gap-4 text-center">

                        <div>

                            <p className="text-sm text-slate-500">
                                Approved
                            </p>

                            <h4 className="text-2xl font-bold text-green-600">
                                {data.approvedSwaps}
                            </h4>

                        </div>

                        <div>

                            <p className="text-sm text-slate-500">
                                Pending
                            </p>

                            <h4 className="text-2xl font-bold text-yellow-600">
                                {data.pendingSwaps}
                            </h4>

                        </div>

                        <div>

                            <p className="text-sm text-slate-500">
                                Rejected
                            </p>

                            <h4 className="text-2xl font-bold text-red-600">
                                {data.rejectedSwaps}
                            </h4>

                        </div>

                    </div>

                </div>

            </div>

            {/* Bottom Cards */}

            <div className="grid gap-6 md:grid-cols-2">

                <div className="rounded-3xl bg-white p-6 shadow">

                    <h3 className="mb-4 text-xl font-bold">
                        Revenue Insight
                    </h3>

                    <p className="text-slate-500">
                        Total value currently held in all user wallets.
                    </p>

                    <h2 className="mt-6 text-4xl font-bold text-green-600">
                        ₦{Number(data.totalWalletBalance).toLocaleString("en-NG")}
                    </h2>

                </div>

                <div className="rounded-3xl bg-white p-6 shadow">

                    <h3 className="mb-4 text-xl font-bold">
                        Platform Health
                    </h3>

                    <div className="space-y-4">

                        <Health label="Users" value={data.totalUsers} />

                        <Health
                            label="Transactions"
                            value={data.totalTransactions}
                        />

                        <Health
                            label="Conversions"
                            value={data.totalAirtimeSwaps}
                        />

                    </div>

                </div>

            </div>

        </main>
    );
}

function MetricCard({
    title,
    value,
    icon: Icon,
    color,
}: any) {
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

                <div className={`rounded-xl p-3 ${color}`}>
                    <Icon size={24} />
                </div>

            </div>

        </div>
    );
}

function StatusRow({
    icon: Icon,
    label,
    value,
    color,
}: any) {
    return (
        <div className="mb-4 flex items-center justify-between">

            <div className="flex items-center gap-3">

                <Icon
                    size={20}
                    className={color}
                />

                <span>{label}</span>

            </div>

            <strong>{value}</strong>

        </div>
    );
}

function Health({
    label,
    value,
}: any) {
    return (
        <div className="flex items-center justify-between border-b pb-3">

            <span>{label}</span>

            <strong>{value}</strong>

        </div>
    );
}