"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";

export default function PaymentSuccessClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const reference = searchParams.get("reference");
                const token = localStorage.getItem("token");

                if (!reference) {
                    alert("Payment reference missing.");
                    return;
                }

                if (!token) {
                    router.push("/login");
                    return;
                }

                const response = await api.get(
                    `/wallet/verify-payment/${reference}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                alert(response.data.message);

                router.push("/dashboard");
            } catch (error) {
                console.error(error);
                alert("Payment verification failed.");
            }
        };

        verifyPayment();
    }, [router, searchParams]);

    return (
        <main className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold">
                Verifying Payment...
            </h1>
        </main>
    );
}