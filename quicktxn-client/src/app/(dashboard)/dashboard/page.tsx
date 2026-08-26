"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardHeader from "@/components/layout/dashboard/DashboardHeader";
import WalletBalanceCard from "@/components/layout/dashboard/WalletBalanceCard";
import ServicesGrid from "@/components/layout/dashboard/ServicesGrid";
import RecentTransactions from "@/components/layout/dashboard/RecentTransactions";
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
            const data = await getDashboardData(); // ✅ Fixed
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
        const success = sessionStorage.getItem("payment_success");

        if (success) {
            setShowToast(true);
            sessionStorage.removeItem("payment_success");

            setTimeout(() => setShowToast(false), 4000);
        }
    }, []);

    useDashboardRealtime(userId, loadDashboard, () => {
        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
        }, 3500);
    });

    return (
        <>
            <Toast
                show={showToast}
                title="Transaction Successful"
                message="Your wallet and transaction history have been updated."
                onClose={() => setShowToast(false)}
            />

            <main className="mx-auto min-h-screen w-full max-w-md bg-gray-50 pb-28">
                <DashboardHeader fullName={dashboard?.user?.full_name} />

                <WalletBalanceCard wallet={dashboard?.wallet} />

                <ServicesGrid />

                <RecentTransactions
                    transactions={dashboard?.transactions || []}
                />
            </main>
        </>
    );
}