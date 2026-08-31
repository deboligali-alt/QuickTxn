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
import api from "@/lib/api";

export default function DashboardPage() {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [userId, setUserId] = useState<string>();
    const [dashboard, setDashboard] = useState<any>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const loadDashboard = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const data = await getDashboardData();
            setDashboard(data);

            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserId(payload.id);

            // Load unread notifications
            const unread = await api.get("/notifications/unread-count");
            setUnreadCount(unread.data.count);
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

    // Payment + Cashback Toast
    useEffect(() => {
        const success = sessionStorage.getItem("payment_success");
        const cashback = sessionStorage.getItem("cashback_amount");

        if (success) {
            if (cashback && Number(cashback) > 0) {
                setToastMessage(
                    `₦${Number(cashback).toLocaleString()} cashback has been credited to your wallet.`
                );
            } else {
                setToastMessage(
                    "Your wallet and transaction history have been updated."
                );
            }

            setShowToast(true);

            sessionStorage.removeItem("payment_success");
            sessionStorage.removeItem("cashback_amount");

            setTimeout(() => setShowToast(false), 4000);
        }
    }, []);

    useDashboardRealtime(userId, loadDashboard, () => {
        setToastMessage("A new transaction has been received.");
        setShowToast(true);

        // Refresh dashboard & notification count
        loadDashboard();

        setTimeout(() => setShowToast(false), 3500);
    });

    return (
        <>
            <Toast
                show={showToast}
                title="Payment Successful 🎉"
                message={toastMessage}
                onClose={() => setShowToast(false)}
            />

            <main className="min-h-screen bg-gray-50">
                <div className="mx-auto w-full max-w-7xl px-4 py-5 pb-28 sm:px-6 lg:px-8">
                    <DashboardHeader
                        fullName={dashboard?.user?.full_name}
                        verified={dashboard?.user?.is_verified}
                        unreadCount={unreadCount}
                    />

                    <div className="mt-4">
                        <WalletBalanceCard wallet={dashboard?.wallet} />
                    </div>

                    <ServicesGrid />

                    <div className="mt-6">
                        <RecentTransactions
                            transactions={dashboard?.transactions || []}
                        />
                    </div>

                    <div className="mt-6">
                        <AnalyticsCard
                            transactions={dashboard?.transactions || []}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}