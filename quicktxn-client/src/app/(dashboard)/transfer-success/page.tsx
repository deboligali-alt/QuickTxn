"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    CheckCircle2,
    ArrowRight,
    Receipt,
    Copy,
    Home,
} from "lucide-react";

export default function TransferSuccessPage() {
    const router = useRouter();

    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const receipt = sessionStorage.getItem("last_transfer");

        if (!receipt) {
            router.replace("/dashboard");
            return;
        }

        setData(JSON.parse(receipt));
    }, [router]);

    if (!data) return null;

    const reference =
        data.reference || `TRX${Date.now()}`;

    const date = new Date().toLocaleString(
        "en-NG",
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    );

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-md p-4 pb-20">
                {/* Success Card */}
                <div className="rounded-3xl bg-gradient-to-b from-green-600 to-emerald-500 p-6 text-center text-white shadow-lg">
                    <CheckCircle2
                        size={60}
                        className="mx-auto"
                    />

                    <h1 className="mt-4 text-2xl font-bold">
                        Transfer Successful
                    </h1>

                    <p className="mt-1 text-green-100">
                        Your money has been sent successfully.
                    </p>

                    <h2 className="mt-6 text-4xl font-bold">
                        ₦
                        {Number(
                            data.amount
                        ).toLocaleString()}
                    </h2>
                </div>

                {/* Receipt */}
                <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <Receipt
                            className="text-green-600"
                            size={22}
                        />
                        <h3 className="text-lg font-bold">
                            Transaction Receipt
                        </h3>
                    </div>

                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Recipient
                            </span>
                            <span className="font-semibold">
                                {data.accountName}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Account Number
                            </span>
                            <span className="font-semibold">
                                {data.accountNumber}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Bank
                            </span>
                            <span className="font-semibold">
                                {data.bankName}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Amount
                            </span>
                            <span className="font-bold text-green-600">
                                ₦
                                {Number(
                                    data.amount
                                ).toLocaleString()}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Status
                            </span>
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                SUCCESS
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-gray-500">
                                Reference
                            </span>

                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        reference
                                    );
                                }}
                                className="flex items-center gap-1 font-semibold text-green-600"
                            >
                                {reference}
                                <Copy size={14} />
                            </button>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Date
                            </span>
                            <span className="font-medium">
                                {date}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 space-y-3">
                    <button
                        onClick={() =>
                            router.push("/transactions")
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-green-600 py-3 font-semibold text-green-600"
                    >
                        View Transactions
                        <ArrowRight size={18} />
                    </button>

                    <button
                        onClick={() =>
                            router.push("/dashboard")
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-3 font-semibold text-white"
                    >
                        <Home size={18} />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </main>
    );
}