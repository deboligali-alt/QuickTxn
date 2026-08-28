"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
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
                <div className="flex">
                    <Sidebar />

                    <div className="flex-1 bg-gray-50 pb-28">
                        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            <DashboardHeader fullName={dashboard?.user?.full_name} />

                            <div className="mt-6 grid gap-6 xl:grid-cols-3">
                                <div className="xl:col-span-2">
                                    <WalletBalanceCard wallet={dashboard?.wallet} />
                                </div>

                                <div className="rounded-3xl bg-white p-5 shadow-sm">
                                    <p className="text-sm text-gray-500">Quick Stats</p>

                                    <div className="mt-5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">
                                                Total Transactions
                                            </span>
                                            <span className="font-bold">
                                                {dashboard?.transactions?.length || 0}
                                            </span>
                                        </div>

                                        <div className="border-t" />

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">
                                                Notifications
                                            </span>
                                            <span className="font-bold">
                                                {dashboard?.notifications?.length || 0}
                                            </span>
                                        </div>

                                        <div className="border-t" />

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Status</span>

                                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <ServicesGrid />

                            <div className="mt-6">
                                <AnalyticsCard
                                    transactions={dashboard?.transactions || []}
                                />
                            </div>

                            <RecentTransactions
                                transactions={dashboard?.transactions || []}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}