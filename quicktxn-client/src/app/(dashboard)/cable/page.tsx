"use client";

import { useState } from "react";
import { ArrowLeft, Tv } from "lucide-react";
import { useRouter } from "next/navigation";

const providers = [
    { id: "dstv", name: "DSTV" },
    { id: "gotv", name: "GOtv" },
    { id: "startimes", name: "Startimes" },
];

const bouquets = {
    dstv: [
        { name: "Compact", price: 19000 },
        { name: "Premium", price: 37000 },
    ],
    gotv: [
        { name: "Jinja", price: 3900 },
        { name: "Max", price: 8500 },
    ],
    startimes: [
        { name: "Basic", price: 3300 },
        { name: "Classic", price: 5000 },
    ],
};

export default function CablePage() {
    const router = useRouter();

    const [provider, setProvider] = useState("");
    const [smartCard, setSmartCard] = useState("");
    const [bouquet, setBouquet] = useState("");
    const [amount, setAmount] = useState("");

    const continuePayment = () => {
        if (!provider || !smartCard || !bouquet || !amount) {
            alert("Complete all fields");
            return;
        }

        sessionStorage.setItem(
            "cable",
            JSON.stringify({
                provider,
                smartCard,
                bouquet,
                amount,
            })
        );

        router.push("/cable/confirm");
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
                Cable TV
            </h1>

            <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-600 p-6 text-white">
                <div className="flex items-center gap-3">
                    <Tv size={30} />
                    <div>
                        <p className="text-sm text-indigo-100">
                            Renew Subscription
                        </p>
                        <h2 className="text-xl font-bold">
                            DSTV • GOtv • Startimes
                        </h2>
                    </div>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <select
                    value={provider}
                    onChange={(e) => {
                        setProvider(e.target.value);
                        setBouquet("");
                        setAmount("");
                    }}
                    className="w-full rounded-2xl border bg-white p-4"
                >
                    <option value="">Select Provider</option>

                    {providers.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>

                <input
                    value={smartCard}
                    onChange={(e) => setSmartCard(e.target.value)}
                    placeholder="Smart Card Number"
                    className="w-full rounded-2xl border bg-white p-4"
                />

                <select
                    value={bouquet}
                    onChange={(e) => {
                        const selected = bouquets[
                            provider as keyof typeof bouquets
                        ]?.find((b) => b.name === e.target.value);

                        setBouquet(e.target.value);
                        setAmount(String(selected?.price || ""));
                    }}
                    className="w-full rounded-2xl border bg-white p-4"
                    disabled={!provider}
                >
                    <option value="">Select Bouquet</option>

                    {provider &&
                        bouquets[
                            provider as keyof typeof bouquets
                        ]?.map((item) => (
                            <option key={item.name} value={item.name}>
                                {item.name} - ₦{item.price.toLocaleString()}
                            </option>
                        ))}
                </select>

                <input
                    readOnly
                    value={amount ? `₦${Number(amount).toLocaleString()}` : ""}
                    placeholder="Amount"
                    className="w-full rounded-2xl border bg-gray-100 p-4 font-bold"
                />
            </div>

            <button
                onClick={continuePayment}
                className="mt-8 w-full rounded-2xl bg-green-600 py-4 font-semibold text-white"
            >
                Continue
            </button>
        </main>
    );
}