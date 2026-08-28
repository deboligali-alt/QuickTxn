"use client";

import { useEffect, useState } from "react";
import { Loader2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function ElectricityPayPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const saved = sessionStorage.getItem("electricity");

        if (!saved) {
            router.push("/electricity");
            return;
        }

        setData(JSON.parse(saved));
    }, [router]);

    const payBill = async () => {
        try {
            setLoading(true);

            const res = await api.post("/electricity/purchase", {
                disco: data.disco,
                meterType: data.meterType,
                meterNumber: data.meterNumber,
                amount: Number(data.amount),
            });

            sessionStorage.setItem(
                "electricity_receipt",
                JSON.stringify(res.data.data)
            );

            sessionStorage.setItem("payment_success", "true");

            router.push("/electricity/success");
        } catch (error: any) {
            alert(
                error.response?.data?.message ||
                "Electricity payment failed"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!data) return null;

    return (
        <main className="mx-auto flex min-h-screen max-w-md items-center justify-center bg-gray-50 p-4">
            <div className="w-full rounded-3xl bg-white p-6 text-center shadow">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                    <Zap className="text-yellow-600" size={32} />
                </div>

                <h1 className="mt-4 text-2xl font-bold">
                    Ready to Pay
                </h1>

                <p className="mt-2 text-gray-500">
                    {data.disco} • {data.meterNumber}
                </p>

                <h2 className="mt-6 text-4xl font-bold text-green-600">
                    ₦{Number(data.amount).toLocaleString()}
                </h2>

                <button
                    onClick={payBill}
                    disabled={loading}
                    className="mt-8 flex w-full items-center justify-center rounded-2xl bg-green-600 py-4 font-semibold text-white disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <Loader2
                                size={20}
                                className="mr-2 animate-spin"
                            />
                            Processing...
                        </>
                    ) : (
                        "Pay Electricity Bill"
                    )}
                </button>
            </div>
        </main>
    );
}