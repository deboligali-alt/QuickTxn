"use client";

import { CheckCircle2, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TransferSuccessPage() {
    const router = useRouter();

    const data =
        typeof window !== "undefined"
            ? JSON.parse(sessionStorage.getItem("last_transfer") || "{}")
            : {};

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-lg">
                <CheckCircle2
                    size={70}
                    className="mx-auto text-green-600"
                />

                <h1 className="mt-4 text-2xl font-bold">
                    Transfer Successful
                </h1>

                <p className="mt-2 text-gray-500">
                    Your money has been sent successfully.
                </p>

                <div className="mt-6 rounded-2xl bg-gray-50 p-5 text-left">
                    <div className="mb-3 flex justify-between">
                        <span className="text-gray-500">Recipient</span>
                        <span className="font-semibold">
                            {data.accountName}
                        </span>
                    </div>

                    <div className="mb-3 flex justify-between">
                        <span className="text-gray-500">Amount</span>
                        <span className="font-bold text-green-600">
                            ₦{Number(data.amount || 0).toLocaleString()}
                        </span>
                    </div>

                    <div className="mb-3 flex justify-between">
                        <span className="text-gray-500">Bank</span>
                        <span>{data.bankName}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Account</span>
                        <span>{data.accountNumber}</span>
                    </div>
                </div>

                <button
                    onClick={() => router.push("/dashboard")}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold text-white"
                >
                    <Home size={18} />
                    Back to Dashboard
                </button>
            </div>
        </main>
    );
}