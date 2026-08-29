"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardHeader from "@/components/layout/dashboard/DashboardHeader";
import WalletBalanceCard from "@/components/layout/dashboard/WalletBalanceCard";
import ServicesGrid from "@/components/layout/dashboard/ServicesGrid";
import RecentTransactions from "@/components/layout/dashboard/RecentTransactions";
import AnalyticsCard from "@/components/layout/dashboard/AnalyticsCard";
import Toast from "@/components/ui/Toast";
import useDashboardRealtime from "@/hooks/useDashboardRealtime";
import { getDashboardData } from "@/lib/dashboard";

export default function DashboardPage() {
    const [showToast, setShowToast] = useState(false);
    const [userId, setUserId] = useState<string>();
    const [dashboard, setDashboard] = useState<any>(null);

    const loadDashboard = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const data = await getDashboardData();
            setDashboard(data);

            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserId(payload.id);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    useEffect(() => {
        if (sessionStorage.getItem("refresh_dashboard")) {
            loadDashboard();
            sessionStorage.removeItem("refresh_dashboard");
        }
    }, [loadDashboard]);

    useEffect(() => {
        const success = sessionStorage.getItem("payment_success");

        if (success) {
            setShowToast(true);
            sessionStorage.removeItem("payment_success");

            setTimeout(() => setShowToast(false), 4000);
        }
    }, []);

    useDashboardRealtime(userId, loadDashboard, () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3500);
    });

    return (
        <>
            <Toast
                show={showToast}
                title="Transaction Successful"
                message="Your wallet and transaction history have been updated."
                onClose={() => setShowToast(false)}
            />

            <main className="min-h-screen bg-gray-50">
                <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 pb-28">
                    <DashboardHeader fullName={dashboard?.user?.full_name} />

                    {/* Wallet + Desktop Stats */}
                    <div className="mt-6 grid gap-6 xl:grid-cols-3">
                        <div className="xl:col-span-2">
                            <WalletBalanceCard wallet={dashboard?.wallet} />
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-2">
                            <StatCard
                                title="Transactions"
                                value={dashboard?.transactions?.length || 0}
                                color="green"
                            />

                            <StatCard
                                title="Notifications"
                                value={dashboard?.notifications?.length || 0}
                                color="blue"
                            />

                            <StatCard
                                title="Beneficiaries"
                                value={dashboard?.beneficiaries?.length || 0}
                                color="purple"
                            />

                            <StatCard
                                title="Status"
                                value="Active"
                                color="emerald"
                            />
                        </div>
                    </div>

                    <ServicesGrid />

                    <div className="mt-6">
                        <AnalyticsCard
                            transactions={dashboard?.transactions || []}
                        />
                    </div>

                    <div className="mt-6">
                        <RecentTransactions
                            transactions={dashboard?.transactions || []}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}

function StatCard({
    title,
    value,
    color,
}: {
    title: string;
    value: string | number;
    color: "green" | "blue" | "purple" | "emerald";
}) {
    const styles = {
        green: "bg-green-50 text-green-700",
        blue: "bg-blue-50 text-blue-700",
        purple: "bg-purple-50 text-purple-700",
        emerald: "bg-emerald-50 text-emerald-700",
    };

    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div
                className={`mb-3 inline-flex rounded-xl px-3 py-1 text-xs font-semibold ${styles[color]}`}
            >
                {title}
            </div>

            <h3 className="text-2xl font-bold text-gray-900">
                {value}
            </h3>
        </div>
    );
}