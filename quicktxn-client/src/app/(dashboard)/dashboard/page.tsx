"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Wallet as WalletIcon,
    ArrowLeftRight,
    Bell,
    RefreshCw,
    ShieldCheck,
    TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import WalletCard from "@/components/layout/dashboard/WalletCard";
import QuickActions from "@/components/layout/dashboard/QuickActions";
import RecentTransactions from "@/components/layout/dashboard/RecentTransactions";
import NotificationCard from "@/components/layout/dashboard/NotificationCard";
import AirtimeSwapHero from "@/components/layout/dashboard/AirtimeSwapHero";
import NotificationListener from "@/components/NotificationListener";

import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";

import {
    getProfile,
    getWallet,
    getTransactions,
    getNotifications,
} from "@/services/dashboard.service";

interface Profile {
    full_name: string;
}

interface Wallet {
    balance: number;
}

interface Transaction {
    id: string;
    amount: number;
    type: string;
    status: string;
    description: string;
    created_at: string;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export default function DashboardPage() {
    const router = useRouter();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadDashboard = useCallback(
        async (showRefresh = false) => {
            try {
                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const token = localStorage.getItem("token");

                if (!token) {
                    router.replace("/login");
                    return;
                }

                const [
                    profileRes,
                    walletRes,
                    transactionRes,
                    notificationRes,
                ] = await Promise.all([
                    getProfile(token),
                    getWallet(token),
                    getTransactions(token),
                    getNotifications(token),
                ]);

                setProfile(profileRes.user as Profile);
                setWallet(walletRes.data as Wallet);

                setTransactions(
                    (transactionRes.transactions || []) as Transaction[]
                );

                setNotifications(
                    (notificationRes.data || []) as Notification[]
                );
            } catch (error: unknown) {
                console.error("Dashboard error:", error);

                setError(
                    "Unable to load your dashboard. Please try again."
                );

                if (showRefresh) {
                    toast.error("Failed to refresh dashboard.");
                }
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [router]
    );

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const balance = Number(wallet?.balance || 0);

    const unreadNotifications = notifications.filter(
        (notification) => !notification.is_read
    ).length;

    const successfulTransactions = transactions.filter(
        (transaction) =>
            transaction.status.toLowerCase() === "success"
    ).length;

    if (loading) {
        return (
            <main className="space-y-8">

                <div className="animate-pulse space-y-6">

                    <div className="h-24 rounded-2xl bg-slate-200" />

                    <div className="h-48 rounded-3xl bg-slate-200" />

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

                        {Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-32 rounded-2xl bg-slate-200"
                            />
                        ))}

                    </div>

                    <div className="h-40 rounded-2xl bg-slate-200" />

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                        <div className="h-96 rounded-2xl bg-slate-200" />

                        <div className="h-96 rounded-2xl bg-slate-200" />

                    </div>

                </div>

            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center">

                <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <RefreshCw size={25} />
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-slate-900">
                        Unable to load dashboard
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        {error}
                    </p>

                    <button
                        onClick={() => loadDashboard(true)}
                        className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                    >
                        Try Again
                    </button>

                </div>

            </main>
        );
    }

    return (
        <>
            <NotificationListener />

            <main className="space-y-8">

                {/* =========================
          HEADER
      ========================= */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <PageHeader
                        name={profile?.full_name || "User"}
                    />

                    <button
                        onClick={() => loadDashboard(true)}
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            size={17}
                            className={refreshing ? "animate-spin" : ""}
                        />

                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>

                </div>

                {/* =========================
          AIRTIME SWAP
      ========================= */}

                <AirtimeSwapHero />

                {/* =========================
          WALLET
      ========================= */}

                <WalletCard balance={balance} />

                {/* =========================
          STATISTICS
      ========================= */}

                <section>

                    <div className="mb-4 flex items-center gap-2">

                        <TrendingUp
                            size={20}
                            className="text-green-600"
                        />

                        <h2 className="text-lg font-bold text-slate-900">
                            Account Overview
                        </h2>

                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                        <StatCard
                            title="Wallet Balance"
                            value={`₦${balance.toLocaleString()}`}
                            icon={<WalletIcon size={25} />}
                        />

                        <StatCard
                            title="Transactions"
                            value={transactions.length}
                            icon={<ArrowLeftRight size={25} />}
                            color="bg-blue-500"
                        />

                        <StatCard
                            title="Successful"
                            value={successfulTransactions}
                            icon={<ShieldCheck size={25} />}
                            color="bg-emerald-500"
                        />

                        <StatCard
                            title="Unread Notifications"
                            value={unreadNotifications}
                            icon={<Bell size={25} />}
                            color="bg-orange-500"
                        />

                    </div>

                </section>

                {/* =========================
          QUICK ACTIONS
      ========================= */}

                <section>

                    <div className="mb-4">

                        <h2 className="text-lg font-bold text-slate-900">
                            Quick Actions
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Quickly access your most-used services.
                        </p>

                    </div>

                    <QuickActions />

                </section>

                {/* =========================
          TRANSACTIONS + NOTIFICATIONS
      ========================= */}

                <section>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                        <RecentTransactions
                            transactions={transactions}
                        />

                        <NotificationCard
                            notifications={notifications}
                        />

                    </div>

                </section>

            </main>
        </>
    );
}