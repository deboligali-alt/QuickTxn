
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Smartphone,
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";
import { buyAirtime } from "@/services/airtime.service";

const networks = [
    { name: "MTN", logo: "/networks/mtn.png" },
    { name: "AIRTEL", logo: "/networks/airtel.png" },
    { name: "GLO", logo: "/networks/glo.png" },
    { name: "9MOBILE", logo: "/networks/9mobile.png" },
];

const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

export default function AirtimePage() {
    const router = useRouter();

    const [network, setNetwork] = useState("MTN");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");

    const [loading, setLoading] = useState(false);

    const [responseMessage, setResponseMessage] = useState("");
    const [responseStatus, setResponseStatus] = useState<
        "SUCCESS" | "FAILED" | "PENDING" | ""
    >("");

    useEffect(() => {
        const saved = localStorage.getItem("user_phone");
        if (saved) setPhoneNumber(saved);
    }, []);

    const handlePurchase = async () => {
        setResponseMessage("");
        setResponseStatus("");

        if (!phoneNumber || phoneNumber.length !== 11) {
            setResponseStatus("FAILED");
            setResponseMessage("Enter a valid 11-digit phone number.");
            return;
        }

        if (!amount || Number(amount) < 50) {
            setResponseStatus("FAILED");
            setResponseMessage("Minimum airtime is ₦50.");
            return;
        }

        if (pin.length !== 4) {
            setResponseStatus("FAILED");
            setResponseMessage("Enter your 4-digit transaction PIN.");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                setResponseStatus("FAILED");
                setResponseMessage("Please login again.");
                return;
            }

            const res = await buyAirtime(token, {
                network,
                phoneNumber,
                amount: Number(amount),
                pin,
            });

            const status = (
                res.data?.status || "SUCCESS"
            ).toUpperCase() as "SUCCESS" | "FAILED" | "PENDING";

            setResponseStatus(status);
            setResponseMessage(res.message);

            if (status === "SUCCESS") {
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
                }, 2000);
            }
        } catch (err: any) {
            setResponseStatus("FAILED");
            setResponseMessage(
                err.response?.data?.message || "Airtime purchase failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-md p-4 pb-24">
                {/* Header */}
                <button
                    onClick={() => router.back()}
                    className="mb-4 flex items-center gap-2 text-gray-700"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {/* Hero */}
                <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <Smartphone size={28} />
                        <div>
                            <p className="text-sm text-green-100">Instant Recharge</p>
                            <h1 className="text-2xl font-bold">Buy Airtime</h1>
                        </div>
                    </div>
                </div>

                {/* Backend Response */}
                {responseMessage && (
                    <div
                        className={`mt-4 flex items-center gap-2 rounded-xl border p-3 ${responseStatus === "SUCCESS"
                                ? "border-green-200 bg-green-50 text-green-700"
                                : responseStatus === "PENDING"
                                    ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                                    : "border-red-200 bg-red-50 text-red-700"
                            }`}
                    >
                        {responseStatus === "SUCCESS" && <CheckCircle2 size={18} />}
                        {responseStatus === "PENDING" && <Clock3 size={18} />}
                        {responseStatus === "FAILED" && <XCircle size={18} />}

                        <span className="font-medium">{responseMessage}</span>
                    </div>
                )}

                {/* Network */}
                <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm">
                    <h2 className="mb-3 text-lg font-bold text-gray-900">
                        Select Network
                    </h2>

                    <div className="grid grid-cols-4 gap-3">
                        {networks.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => setNetwork(item.name)}
                                className={`rounded-xl border-2 p-3 transition ${network === item.name
                                        ? "border-green-600 bg-green-50"
                                        : "border-gray-200 bg-white"
                                    }`}
                            >
                                <div className="flex justify-center">
                                    <Image
                                        src={item.logo}
                                        alt={item.name}
                                        width={42}
                                        height={42}
                                        className="h-10 w-10 object-contain"
                                    />
                                </div>

                                <p className="mt-2 text-center text-[11px] font-bold text-gray-700">
                                    {item.name}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Phone */}
                <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                    <label className="mb-2 block font-semibold">Phone Number</label>

                    <input
                        type="tel"
                        maxLength={11}
                        value={phoneNumber}
                        onChange={(e) =>
                            setPhoneNumber(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="08012345678"
                        className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                    />
                </div>

                {/* Amount */}
                <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                    <label className="mb-2 block font-semibold">Amount</label>

                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full rounded-xl border p-3 outline-none focus:border-green-600"
                    />

                    <div className="mt-3 grid grid-cols-3 gap-2">
                        {quickAmounts.map((amt) => (
                            <button
                                key={amt}
                                onClick={() => setAmount(String(amt))}
                                className="rounded-lg border py-2 font-semibold transition hover:bg-green-50"
                            >
                                ₦{amt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* PIN */}
                <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                    <label className="mb-2 block font-semibold">Transaction PIN</label>

                    <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                        placeholder="••••"
                        className="w-full rounded-xl border p-3 text-center tracking-[0.4em] outline-none focus:border-green-600"
                    />
                </div>

                {/* Button */}
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