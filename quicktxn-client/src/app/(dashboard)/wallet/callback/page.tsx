"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

function WalletCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [status, setStatus] = useState(
        "Verifying your payment..."
    );

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const reference =
                    searchParams.get("reference") ||
                    searchParams.get("trxref");

                if (!reference) {
                    setStatus("Payment reference was not found.");
                    return;
                }

                const token = localStorage.getItem("token");

                if (!token) {
                    setStatus("Please login again.");
                    return;
                }

                const response = await api.get(
                    `/wallet/verify-payment/${reference}`
                );

                if (response.data.success) {
                    setStatus(
                        "Payment successful! Updating your wallet..."
                    );

                    sessionStorage.setItem(
                        "payment_success",
                        "true"
                    );
                    sessionStorage.setItem(
                        "refresh_dashboard",
                        "true"
                    );

                    setTimeout(() => {
                        router.replace("/dashboard");
                    }, 1500);
                } else {
                    setStatus(
                        response.data.message ||
                        "Payment verification failed."
                    );
                }
            } catch (error: any) {
                console.error(error);

                setStatus(
                    error.response?.data?.message ||
                    "Payment verification failed."
                );
            }
        };

        verifyPayment();
    }, [searchParams, router]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
                </div>

                <h1 className="mt-6 text-2xl font-bold text-slate-900">
                    Wallet Funding
                </h1>

                <p className="mt-3 text-slate-500">{status}</p>
            </div>
        </main>
    );
}

export default function WalletCallbackPage() {
    return (
        <Suspense
            fallback={
                <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
                    <div className="text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
                        <p className="mt-4 text-gray-600">Loading...</p>
                    </div>
                </main>
            }
        >
            <WalletCallbackContent />
        </Suspense>
    );
}