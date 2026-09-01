"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { buyAirtime } from "@/services/airtime.service";

const networks = [
    { name: "MTN", logo: "/networks/mtn.png" },
    { name: "AIRTEL", logo: "/networks/airtel.png" },
    { name: "GLO", logo: "/networks/glo.png" },
    { name: "9MOBILE", logo: "/networks/9mobile.png" },
];

const amounts = [100, 200, 500, 1000, 2000, 5000];

export default function AirtimePage() {
    const router = useRouter();

    const [network, setNetwork] = useState("MTN");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handlePurchase = async () => {
        setSuccess("");
        setError("");

        if (phoneNumber.length !== 11) {
            return setError("Enter a valid 11-digit phone number.");
        }

        if (!amount || Number(amount) < 50) {
            return setError("Minimum airtime amount is ₦50.");
        }

        if (pin.length !== 4) {
            return setError("Enter your 4-digit transaction PIN.");
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                return setError("Please login again.");
            }

            const res = await buyAirtime(token, {
                network,
                phoneNumber,
                amount: Number(amount),
                pin,
            });

            // Green success message
            setSuccess(res.message);

            // Dashboard toast
            sessionStorage.setItem("payment_success", "true");

            if (res.data?.cashback) {
                sessionStorage.setItem(
                    "cashback_amount",
                    String(res.data.cashback)
                );
            }

            setPin("");
            setAmount("");

            setTimeout(() => {
                router.replace("/dashboard");
            }, 1800);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Airtime purchase failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-md p-4 pb-24">

                <button
                    onClick={() => router.back()}
                    className="mb-4 flex items-center gap-2 text-gray-700"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white">
                    <h1 className="text-2xl font-bold">
                        Buy Airtime
                    </h1>
                    <p className="mt-1 text-sm text-green-100">
                        Recharge any Nigerian network instantly
                    </p>
                </div>

                {success && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-green-700">
                        <CheckCircle2 size={18} />
                        <span className="font-semibold">{success}</span>
                    </div>
                )}

                {error && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 font-semibold">
                        {error}
                    </div>
                )}

                <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
                    <h2 className="mb-3 font-bold">
                        Select Network
                    </h2>

                    <div className="grid grid-cols-4 gap-3">
                        {networks.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => setNetwork(item.name)}
                                className={`rounded-xl border-2 p-2 transition ${network === item.name
                                        ? "border-green-600 bg-green-50"
                                        : "border-gray-200"
                                    }`}
                            >
                                <div className="mx-auto flex h-10 w-10 items-center justify-center">
                                    <Image
                                        src={item.logo}
                                        alt={item.name}
                                        width={36}
                                        height={36}
                                        className="object-contain"
                                    />
                                </div>

                                <p className="mt-2 text-[11px] font-bold">
                                    {item.name}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                    <label className="mb-2 block font-semibold">
                        Phone Number
                    </label>

                    <input
                        type="tel"
                        maxLength={11}
                        value={phoneNumber}
                        onChange={(e) =>
                            setPhoneNumber(
                                e.target.value.replace(/\D/g, "")
                            )
                        }
                        placeholder="08012345678"
                        className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                    />
                </div>

                <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                    <label className="mb-2 block font-semibold">
                        Amount
                    </label>

                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                    />

                    <div className="mt-3 grid grid-cols-3 gap-2">
                        {amounts.map((amt) => (
                            <button
                                key={amt}
                                onClick={() => setAmount(String(amt))}
                                className="rounded-lg border py-2 font-semibold hover:bg-green-50"
                            >
                                ₦{amt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                    <label className="mb-2 block font-semibold">
                        Transaction PIN
                    </label>

                    <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={pin}
                        onChange={(e) =>
                            setPin(
                                e.target.value.replace(/\D/g, "")
                            )
                        }
                        placeholder="****"
                        className="w-full rounded-xl border p-3 text-center tracking-[0.4em] outline-none focus:border-green-600"
                    />
                </div>

                <button
                    onClick={handlePurchase}
                    disabled={loading}
                    className="mt-6 w-full rounded-2xl bg-green-600 py-4 text-lg font-bold text-white transition hover:bg-green-700 disabled:opacity-60"
                >
                    {loading
                        ? "Processing..."
                        : `Buy ₦${amount || "0"} Airtime`}
                </button>
            </div>
        </main>
    );
}