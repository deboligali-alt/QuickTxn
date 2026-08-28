"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Copy, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ElectricitySuccessPage() {
    const router = useRouter();
    const [receipt, setReceipt] = useState<any>(null);

    useEffect(() => {
        const data = sessionStorage.getItem("electricity_receipt");

        if (!data) {
            router.push("/dashboard");
            return;
        }

        setReceipt(JSON.parse(data));
    }, [router]);

    const copyToken = async () => {
        if (!receipt?.token) return;

        await navigator.clipboard.writeText(receipt.token);
        alert("Token copied!");
    };

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
                        Payment Successful
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Your electricity bill has been paid.
                    </p>
                </div>

                <div className="mt-8 space-y-4 rounded-2xl bg-gray-50 p-5">
                    <div className="flex justify-between">
                        <span className="text-gray-500">DISCO</span>
                        <span className="font-semibold">
                            {receipt.disco}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Meter</span>
                        <span className="font-semibold">
                            {receipt.meterNumber}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Amount</span>
                        <span className="text-lg font-bold text-green-600">
                            ₦{Number(receipt.amount).toLocaleString()}
                        </span>
                    </div>

                    <div className="border-t pt-4">
                        <p className="mb-2 text-sm text-gray-500">
                            Electricity Token
                        </p>

                        <div className="rounded-xl bg-white p-3">
                            <p className="break-all text-center font-mono text-lg font-bold tracking-wider">
                                {receipt.token || "Token unavailable"}
                            </p>
                        </div>

                        <button
                            onClick={copyToken}
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border py-3 font-medium"
                        >
                            <Copy size={18} />
                            Copy Token
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => {
                        sessionStorage.removeItem("electricity");
                        sessionStorage.removeItem("electricity_receipt");
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