"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Home, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CableSuccessPage() {
    const router = useRouter();
    const [receipt, setReceipt] = useState<any>(null);

    useEffect(() => {
        const data = sessionStorage.getItem("cable_receipt");

        if (!data) {
            router.push("/dashboard");
            return;
        }

        setReceipt(JSON.parse(data));
    }, [router]);

    if (!receipt) return null;

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lg">
                <div className="text-center">
                    <CheckCircle2
                        size={70}
                        className="mx-auto text-green-600"
                    />

                    <h1 className="mt-4 text-2xl font-bold">
                        Subscription Successful
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Your TV subscription has been renewed successfully.
                    </p>
                </div>

                <div className="mt-8 space-y-4 rounded-2xl bg-gray-50 p-5">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Provider</span>
                        <span className="font-semibold uppercase">
                            {receipt.provider}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Smart Card</span>
                        <span className="font-semibold">
                            {receipt.smartCard}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Bouquet</span>
                        <span className="font-semibold">
                            {receipt.bouquet}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Amount</span>
                        <span className="text-lg font-bold text-green-600">
                            ₦{Number(receipt.amount).toLocaleString()}
                        </span>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Receipt size={16} />
                            <span>Reference</span>
                        </div>

                        <p className="mt-2 break-all rounded-lg bg-white p-3 font-mono text-sm">
                            {receipt.reference}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        sessionStorage.removeItem("cable");
                        sessionStorage.removeItem("cable_receipt");
                        router.push("/dashboard");
                    }}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-4 font-semibold text-white"
                >
                    <Home size={18} />
                    Back to Dashboard
                </button>
            </div>
        </main>
    );
}