"use client";

import { useState } from "react";
import { ArrowLeft, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

const discos = [
    "IKEDC",
    "EKEDC",
    "AEDC",
    "IBEDC",
    "KEDCO",
    "PHED",
    "EEDC",
    "BEDC",
];

export default function ElectricityPage() {
    const router = useRouter();

    const [disco, setDisco] = useState("");
    const [meterType, setMeterType] = useState("prepaid");
    const [meterNumber, setMeterNumber] = useState("");
    const [amount, setAmount] = useState("");

    const continuePayment = () => {
        if (!disco || !meterNumber || !amount) {
            alert("Complete all fields");
            return;
        }

        sessionStorage.setItem(
            "electricity",
            JSON.stringify({
                disco,
                meterType,
                meterNumber,
                amount,
            })
        );

        router.push("/electricity/confirm");
    };

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
                Electricity Bill
            </h1>

            <div className="rounded-3xl bg-gradient-to-br from-yellow-500 to-orange-500 p-6 text-white">
                <div className="flex items-center gap-3">
                    <Zap size={30} />
                    <div>
                        <p className="text-sm text-yellow-100">
                            Pay Instantly
                        </p>
                        <h2 className="text-xl font-bold">
                            All DISCOs
                        </h2>
                    </div>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Distribution Company
                    </label>

                    <select
                        value={disco}
                        onChange={(e) => setDisco(e.target.value)}
                        className="w-full rounded-2xl border bg-white p-4"
                    >
                        <option value="">Select DISCO</option>

                        {discos.map((d) => (
                            <option key={d}>{d}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Meter Type
                    </label>

                    <select
                        value={meterType}
                        onChange={(e) => setMeterType(e.target.value)}
                        className="w-full rounded-2xl border bg-white p-4"
                    >
                        <option value="prepaid">Prepaid</option>
                        <option value="postpaid">Postpaid</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Meter Number
                    </label>

                    <input
                        value={meterNumber}
                        onChange={(e) => setMeterNumber(e.target.value)}
                        placeholder="12345678901"
                        className="w-full rounded-2xl border bg-white p-4"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Amount
                    </label>

                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="₦1000"
                        className="w-full rounded-2xl border bg-white p-4 text-xl font-bold"
                    />
                </div>
            </div>

            <button
                onClick={continuePayment}
                className="mt-8 w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white"
            >
                Continue
            </button>
        </main>
    );
}