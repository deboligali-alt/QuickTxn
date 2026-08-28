"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ElectricityConfirmPage() {
    const router = useRouter();

    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const saved = sessionStorage.getItem("electricity");

        if (!saved) {
            router.push("/electricity");
            return;
        }

        setData(JSON.parse(saved));
    }, [router]);

    const continuePayment = () => {
        router.push("/electricity/pay");
    };

    if (!data) return null;

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4 pb-24">
            <button
                onClick={() => router.back()}
                className="mb-4 flex items-center gap-2"
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <h1 className="mb-6 text-2xl font-bold">
                Confirm Payment
            </h1>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-full bg-yellow-100 p-3">
                        <Zap className="text-yellow-600" size={24} />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Electricity Bill
                        </p>
                        <h2 className="font-bold">
                            {data.disco}
                        </h2>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-gray-500">
                            Meter Type
                        </span>
                        <span className="font-semibold capitalize">
                            {data.meterType}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">
                            Meter Number
                        </span>
                        <span className="font-semibold">
                            {data.meterNumber}
                        </span>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Amount
                            </span>
                            <span className="text-2xl font-bold text-green-600">
                                ₦{Number(data.amount).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={continuePayment}
                className="mt-8 w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white"
            >
                Continue to Pay
            </button>
        </main>
    );
}