"use client";

import { useEffect, useState } from "react";
import {
    useRouter,
    useSearchParams,
} from "next/navigation";
import axios from "axios";

export default function WalletCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [status, setStatus] = useState(
        "Verifying your payment..."
    );

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                console.log(
                    "Callback URL:",
                    window.location.href
                );

                console.log(
                    "Query parameters:",
                    window.location.search
                );

                // Paystack can return either "reference"
                // or "trxref"
                const reference =
                    searchParams.get("reference") ||
                    searchParams.get("trxref");

                console.log(
                    "Payment reference:",
                    reference
                );

                if (!reference) {
                    setStatus(
                        "Payment reference was not found."
                    );
                    return;
                }

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    setStatus(
                        "Please login again."
                    );
                    return;
                }

                console.log(
                    "Verifying payment with reference:",
                    reference
                );

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/wallet/verify-payment/${reference}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                console.log(
                    "Verification response:",
                    response.data
                );

                if (response.data.success) {
                    setStatus(
                        "Payment successful! Updating your wallet..."
                    );

                    setTimeout(() => {
                        router.push("/dashboard");
                        router.refresh();
                    }, 1500);
                } else {
                    setStatus(
                        response.data.message ||
                        "Payment verification failed."
                    );
                }

            } catch (error: unknown) {
                console.error(
                    "Payment verification error:",
                    error
                );

                if (
                    axios.isAxiosError(error)
                ) {
                    setStatus(
                        error.response?.data?.message ||
                        "Payment verification failed."
                    );
                } else {
                    setStatus(
                        "Payment verification failed."
                    );
                }
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

                <p className="mt-3 text-slate-500">
                    {status}
                </p>

            </div>

        </main>
    );
}