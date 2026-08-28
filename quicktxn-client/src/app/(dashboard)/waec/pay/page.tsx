"use client";

import { useEffect, useState } from "react";
import { Loader2, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function WaecPayPage() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const saved = sessionStorage.getItem("waec");

        if (!saved) {
            router.push("/waec");
            return;
        }

        setData(JSON.parse(saved));
    }, [router]);

    const buyPin = async () => {
        try {
            setLoading(true);

            const res = await api.post("/waec/purchase", {
                exam: data.exam,
                examNumber: data.examNumber,
                examYear: data.examYear,
            });

            sessionStorage.setItem(
                "waec_receipt",
                JSON.stringify(res.data.data)
            );

            sessionStorage.setItem("payment_success", "true");

            router.push("/waec/success");
        } catch (error: any) {
            alert(
                error.response?.data?.message ||
                "Purchase failed"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!data) return null;

    return (
        <main className="mx-auto flex min-h-screen max-w-md items-center justify-center bg-gray-50 p-4">
            <div className="w-full rounded-3xl bg-white p-6 text-center shadow">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <GraduationCap
                        className="text-blue-600"
                        size={32}
                    />
                </div>

                <h1 className="mt-4 text-2xl font-bold">
                    Buy Result Checker PIN
                </h1>

                <p className="mt-2 text-gray-500 uppercase">
                    {data.exam} • {data.examYear}
                </p>

                <h2 className="mt-6 text-4xl font-bold text-green-600">
                    ₦1,500
                </h2>

                <button
                    onClick={buyPin}
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
                        "Buy PIN"
                    )}
                </button>
            </div>
        </main>
    );
}