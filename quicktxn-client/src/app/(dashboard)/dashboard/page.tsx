"use client";


import DashboardHeader from "@/components/layout/dashboard/DashboardHeader";
import WalletBalanceCard from "@/components/layout/dashboard/WalletBalanceCard";
import ServicesGrid from "@/components/layout/dashboard/ServicesGrid";
import RecentTransactions from "@/components/layout/dashboard/RecentTransactions";
import BottomNavigation from "@/components/layout/dashboard/BottomNavigation";
import Toast from "@/components/ui/Toast";
import { useCallback, useEffect, useState } from "react";
import useDashboardRealtime from "@/hooks/useDashboardRealtime";
export default function DashboardPage() {
    const [showToast, setShowToast] = useState(false);
    const [userId, setUserId] = useState<string>();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) return;

        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.id);
    }, []);

    const refreshDashboard = useCallback(() => {
        window.location.reload();
    }, []);
    useEffect(() => {
        const success = sessionStorage.getItem("payment_success");

        if (success) {
            setShowToast(true);
            sessionStorage.removeItem("payment_success");

            setTimeout(() => {
                setShowToast(false);
            }, 4000);
        }
    }, []);
    useDashboardRealtime(userId, refreshDashboard);
    return (
        <>
            <Toast
                show={showToast}
                title="Payment Successful"
                message="₦1,000 has been added to your wallet."
                onClose={() => setShowToast(false)}
            />

            <main className="mx-auto min-h-screen max-w-md bg-gray-50 pb-24">
                <DashboardHeader />
                <WalletBalanceCard />
                <ServicesGrid />
                <RecentTransactions />
            </main>

            <BottomNavigation />
        </>
    );
}