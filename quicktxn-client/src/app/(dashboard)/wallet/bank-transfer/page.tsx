"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ShieldCheck } from "lucide-react";

export default function BankTransferPinPage() {
    const router = useRouter();

    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);

    const transferData = JSON.parse(
        sessionStorage.getItem("transferData") || "{}"
    );

    const pressNumber = (num: string) => {
        if (pin.length < 4) {
            setPin(pin + num);
        }
    };

    const removeDigit = () => {
        setPin(pin.slice(0, -1));
    };

    const submitTransfer = async () => {
        if (pin.length !== 4) {
            alert("Enter your 4-digit PIN");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/wallet/bank-transfer`,
                {
                    ...transferData,
                    pin,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            sessionStorage.setItem("payment_success", "true");
            sessionStorage.removeItem("transferData");

            router.push("/dashboard");
        } catch (error: any) {
            alert(
                error.response?.data?.message || "Transfer failed"
            );
        } finally {
            setLoading(false);
        }
    };

    const numbers = [
        "1", "2", "3",
        "4", "5", "6",
        "7", "8", "9",
        "", "0", "⌫",
    ];

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4 pb-12">
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <ShieldCheck
                        className="text-green-600"
                        size={38}
                    />
                </div>

                <h1 className="text-2xl font-bold">
                    Confirm Transfer
                </h1>

                <p className="mt-2 text-gray-500">
                    Enter your transaction PIN
                </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
                <div className="border-b pb-4">
                    <p className="text-sm text-gray-500">
                        Recipient
                    </p>

                    <h2 className="font-semibold">
                        {transferData.accountName}
                    </h2>

                    <p className="text-xs text-gray-400">
                        {transferData.accountNumber}
                    </p>
                </div>

                <div className="pt-4 text-center">
                    <p className="text-sm text-gray-500">
                        Amount
                    </p>

                    <h3 className="mt-1 text-3xl font-bold text-green-600">
                        ₦
                        {Number(
                            transferData.amount || 0
                        ).toLocaleString()}
                    </h3>
                </div>
            </div>

            <div className="my-8 flex justify-center gap-3">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`h-4 w-4 rounded-full ${i < pin.length
                                ? "bg-green-600"
                                : "bg-gray-300"
                            }`}
                    />
                ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
                {numbers.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            if (item === "⌫") return removeDigit();
                            if (item !== "") pressNumber(item);
                        }}
                        className="flex h-16 items-center justify-center rounded-2xl bg-white text-2xl font-semibold shadow-sm active:scale-95"
                    >
                        {item}
                    </button>
                ))}
            </div>

            <button
                onClick={submitTransfer}
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white disabled:opacity-60"
            >
                {loading
                    ? "Processing..."
                    : "Complete Transfer"}
            </button>
        </main>
    );
}