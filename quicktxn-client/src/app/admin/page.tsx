"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Users,
    Wallet,
    ArrowLeftRight,
    Smartphone,
    Clock3,
    CheckCircle2,
    XCircle,
    TrendingUp,
    ShieldCheck,
} from "lucide-react";
import { getDashboardStats } from "@/services/admin.service";

interface DashboardStats {
    totalUsers: number;
    totalWalletBalance: number;
    totalTransactions: number;
    totalAirtimeSwaps: number;
    pendingSwaps: number;
    approvedSwaps: number;
    rejectedSwaps: number;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    const loadDashboard = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await getDashboardStats(token);
            setStats(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    if (loading) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center">
                <p className="text-lg text-slate-500">Loading dashboard...</p>
            </main>
        );
    }

    if (!stats) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center">
                <p className="text-lg text-red-600">Unable to load dashboard.</p>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl space-y-8 p-8">
            {/* Hero */}
            <section className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-8 text-white shadow-lg">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <ShieldCheck size={20} />
                            <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
                                ADMIN PANEL
                            </span>
                        </div>

                        <h1 className="text-4xl font-bold">QuickTxn Control Center</h1>

                        <p className="mt-3 max-w-xl text-green-50">
                            Monitor users, wallet balances, airtime swaps and platform
                            transactions in real time.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white/15 p-6 backdrop-blur">
                        <p className="text-sm text-green-100">Platform Wallet</p>
                        <h2 className="mt-2 text-3xl font-bold">
                            ₦{Number(stats.totalWalletBalance).toLocaleString("en-NG")}
                        </h2>
                        <div className="mt-4 flex items-center gap-2 text-sm">
                            <TrendingUp size={16} />
                            Live platform balance
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Stats */}
            <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={Users}
                    color="bg-green-100 text-green-700"
                />

                <StatCard
                    title="Transactions"
                    value={stats.totalTransactions}
                    icon={ArrowLeftRight}
                    color="bg-blue-100 text-blue-700"
                />

                <StatCard
                    title="Airtime Swaps"
                    value={stats.totalAirtimeSwaps}
                    icon={Smartphone}
                    color="bg-purple-100 text-purple-700"
                />

                <StatCard
                    title="Wallet Balance"
                    value={`₦${Number(stats.totalWalletBalance).toLocaleString("en-NG")}`}
                    icon={Wallet}
                    color="bg-amber-100 text-amber-700"
                />
            </section>

            {/* Conversion Analytics */}
            <section className="rounded-3xl bg-white p-6 shadow">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Airtime Conversion Analytics</h2>
                        <p className="text-slate-500">
                            Current status of all airtime conversion requests.
                        </p>
                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                        Live Data
                    </span>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <MiniCard
                        title="Pending"
                        value={stats.pendingSwaps}
                        icon={Clock3}
                        color="yellow"
                    />

                    <MiniCard
                        title="Approved"
                        value={stats.approvedSwaps}
                        icon={CheckCircle2}
                        color="green"
                    />

                    <MiniCard
                        title="Rejected"
                        value={stats.rejectedSwaps}
                        icon={XCircle}
                        color="red"
                    />
                </div>
            </section>

            {/* Quick Actions */}
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <ActionCard
                    title="Manage Users"
                    desc="View and control registered users"
                    color="bg-blue-50"
                />

                <ActionCard
                    title="Airtime Swaps"
                    desc="Approve or reject conversions"
                    color="bg-green-50"
                />

                <ActionCard
                    title="Transactions"
                    desc="Review wallet activities"
                    color="bg-purple-50"
                />

                <ActionCard
                    title="Platform Wallet"
                    desc="Monitor total wallet balance"
                    color="bg-amber-50"
                />
            </section>
        </main>
    );
}

function StatCard({
    title,
    value,
    icon: Icon,
    color,
}: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
}) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-500">{title}</p>
                    <h2 className="mt-3 text-3xl font-bold">{value}</h2>
                </div>

                <div className={`rounded-xl p-4 ${color}`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
}

function MiniCard({
    title,
    value,
    icon: Icon,
    color,
}: {
    title: string;
    value: number;
    icon: any;
    color: "green" | "yellow" | "red";
}) {
    const styles = {
        green: "bg-green-50 text-green-700",
        yellow: "bg-yellow-50 text-yellow-700",
        red: "bg-red-50 text-red-700",
    };

    return (
        <div className={`rounded-2xl p-5 ${styles[color]}`}>
            <div className="mb-3 flex items-center gap-2">
                <Icon size={20} />
                <span>{title}</span>
            </div>

            <h3 className="text-3xl font-bold">{value}</h3>
        </div>
    );
}

function ActionCard({
    title,
    desc,
    color,
}: {
    title: string;
    desc: string;
    color: string;
}) {
    return (
        <div className={`rounded-2xl p-5 ${color} transition hover:shadow`}>
            <h3 className="font-bold">{title}</h3>
            <p className="mt-2 text-sm text-slate-600">{desc}</p>
        </div>
    );
}