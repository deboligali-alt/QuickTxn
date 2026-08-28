"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WaecConfirmPage() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const saved = sessionStorage.getItem("waec");

        if (!saved) {
            router.push("/waec");
            return;
        }

        setData(JSON.parse(saved));
    }, [router]);

    if (!data) return null;

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
                Confirm Purchase
            </h1>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-3">
                        <GraduationCap
                            className="text-blue-600"
                            size={24}
                        />
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Result Checker
                        </p>
                        <h2 className="font-bold uppercase">
                            {data.exam}
                        </h2>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-gray-500">
                            Exam Number
                        </span>
                        <span className="font-semibold">
                            {data.examNumber}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">
                            Year
                        </span>
                        <span className="font-semibold">
                            {data.examYear}
                        </span>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between">
                            <span className="text-gray-500">
                                Price
                            </span>
                            <span className="text-2xl font-bold text-green-600">
                                ₦1,500
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={() => router.push("/waec/pay")}
                className="mt-8 w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white"
            >
                Continue to Pay
            </button>
        </main>
    );
}