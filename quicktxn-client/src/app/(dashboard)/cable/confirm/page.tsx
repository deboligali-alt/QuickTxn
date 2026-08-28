"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Tv } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CableConfirmPage() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const saved = sessionStorage.getItem("cable");

        if (!saved) {
            router.push("/cable");
            return;
        }

        setData(JSON.parse(saved));
    }, [router]);

    if (!data) return null;

    const continuePayment = () => {
        router.push("/cable/pay");
    };

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4">
            <button
                onClick={() => router.back()}
                className="mb-4 flex items-center gap-2"
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <h1 className="mb-6 text-2xl font-bold">
                Confirm Subscription
            </h1>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-full bg-indigo-100 p-3">
                        <Tv className="text-indigo-600" size={24} />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            TV Subscription
                        </p>
                        <h2 className="font-bold uppercase">
                            {data.provider}
                        </h2>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-gray-500">
                            Smart Card
                        </span>
                        <span className="font-semibold">
                            {data.smartCard}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">
                            Bouquet
                        </span>
                        <span className="font-semibold">
                            {data.bouquet}
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