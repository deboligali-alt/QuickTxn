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
import { useRouter } from "next/navigation";
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
    const router = useRouter();

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
            <main className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-lg text-slate-500">
                    Loading dashboard...
                </p>
            </main>
        );
    }

    if (!stats) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-50">
                <p className="text-lg text-red-600">
                    Unable to load dashboard.
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
                {/* Hero */}
                <section className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white shadow-lg sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="mb-3 flex items-center gap-2">
                                <ShieldCheck size={20} />
                                <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
                                    ADMIN PANEL
                                </span>
                            </div>

                            <h1 className="text-3xl font-bold sm:text-4xl">
                                QuickTxn Control Center
                            </h1>

                            <p className="mt-3 max-w-xl text-green-50">
                                Monitor users, wallet balances, airtime swaps and platform
                                transactions in real time.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white/15 p-5 backdrop-blur sm:p-6">
                            <p className="text-sm text-green-100">
                                Platform Wallet
                            </p>

                            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                                ₦
                                {Number(stats.totalWalletBalance).toLocaleString(
                                    "en-NG"
                                )}
                            </h2>

                            <div className="mt-4 flex items-center gap-2 text-sm">
                                <TrendingUp size={16} />
                                Live platform balance
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Stats */}
                <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
                        title="Swaps"
                        value={stats.totalAirtimeSwaps}
                        icon={Smartphone}
                        color="bg-purple-100 text-purple-700"
                    />

                    <StatCard
                        title="Wallet"
                        value={`₦${Number(
                            stats.totalWalletBalance
                        ).toLocaleString("en-NG")}`}
                        icon={Wallet}
                        color="bg-amber-100 text-amber-700"
                    />
                </section>

                {/* Analytics */}
                <section className="rounded-3xl bg-white p-5 shadow sm:p-6">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-bold sm:text-2xl">
                                Airtime Conversion Analytics
                            </h2>

                            <p className="text-sm text-slate-500">
                                Current status of all airtime conversion requests.
                            </p>
                        </div>

                        <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                            Live Data
                        </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
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
                <section>
                    <h2 className="mb-4 text-xl font-bold">
                        Quick Actions
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <ActionCard
                            title="Manage Users"
                            desc="View and control users"
                            color="bg-blue-50"
                            onClick={() => router.push("/admin/users")}
                        />

                        <ActionCard
                            title="Airtime Swaps"
                            desc="Approve requests"
                            color="bg-green-50"
                            onClick={() => router.push("/admin/airtime-swaps")}
                        />

                        <ActionCard
                            title="Transactions"
                            desc="Review wallet activity"
                            color="bg-purple-50"
                            onClick={() => router.push("/admin/transactions")}
                        />

                        <ActionCard
                            title="Wallet"
                            desc="Monitor balances"
                            color="bg-amber-50"
                            onClick={() => router.push("/admin/wallet")}
                        />
                    </div>
                </section>
            </div>
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
        <div className="rounded-2xl bg-white p-4 shadow transition hover:-translate-y-1 hover:shadow-lg sm:p-6">
            <div className="flex items-center justify-between">
                <div className="min-w-0">
                    <p className="text-sm text-slate-500">{title}</p>

                    <h2 className="mt-2 truncate text-xl font-bold sm:text-3xl">
                        {value}
                    </h2>
                </div>

                <div className={`rounded-xl p-3 sm:p-4 ${color}`}>
                    <Icon size={22} />
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
    onClick,
}: {
    title: string;
    desc: string;
    color: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`rounded-2xl p-5 text-left transition hover:scale-[1.02] hover:shadow ${color}`}
        >
            <h3 className="font-bold">{title}</h3>

            <p className="mt-2 text-sm text-slate-600">{desc}</p>
        </button>
    );
}