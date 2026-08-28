"use client";

import { useEffect, useState } from "react";
import {
    CheckCircle2,
    Copy,
    Home,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function WaecSuccessPage() {
    const router = useRouter();
    const [receipt, setReceipt] = useState<any>(null);

    useEffect(() => {
        const data = sessionStorage.getItem("waec_receipt");

        if (!data) {
            router.push("/dashboard");
            return;
        }

        setReceipt(JSON.parse(data));
    }, [router]);

    const copyPin = async () => {
        await navigator.clipboard.writeText(receipt.pin);
        alert("PIN copied");
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
                        Purchase Successful
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Your Result Checker PIN is ready.
                    </p>
                </div>

                <div className="mt-6 space-y-4 rounded-2xl bg-gray-50 p-5">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Exam</span>
                        <span>{receipt.exam}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Serial</span>
                        <span>{receipt.serial}</span>
                    </div>

                    <div className="border-t pt-4">
                        <p className="mb-2 text-sm text-gray-500">
                            PIN
                        </p>

                        <div className="rounded-xl bg-white p-3">
                            <p className="text-center font-mono text-xl font-bold tracking-wider">
                                {receipt.pin}
                            </p>
                        </div>

                        <button
                            onClick={copyPin}
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border py-3"
                        >
                            <Copy size={18} />
                            Copy PIN
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => router.push("/dashboard")}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 py-4 font-semibold text-white"
                >
                    <Home size={18} />
                    Back to Dashboard
                </button>
            </div>
        </main>
    );
}