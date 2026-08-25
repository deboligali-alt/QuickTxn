"use client";

import { useState } from "react";
import { Smartphone, CheckCircle2 } from "lucide-react";

const networks = [
    { name: "MTN", color: "bg-yellow-400" },
    { name: "Airtel", color: "bg-red-500" },
    { name: "Glo", color: "bg-green-600" },
    { name: "9mobile", color: "bg-emerald-500" },
];

const dataTypes = ["SME", "Corporate", "Gifting"];

const plans = {
    MTN: [
        { size: "500MB", price: 180 },
        { size: "1GB", price: 350 },
        { size: "2GB", price: 700 },
        { size: "5GB", price: 1700 },
    ],
    Airtel: [
        { size: "500MB", price: 190 },
        { size: "1GB", price: 360 },
        { size: "2GB", price: 720 },
        { size: "5GB", price: 1750 },
    ],
    Glo: [
        { size: "500MB", price: 170 },
        { size: "1GB", price: 340 },
        { size: "2GB", price: 680 },
        { size: "5GB", price: 1650 },
    ],
    "9mobile": [
        { size: "500MB", price: 185 },
        { size: "1GB", price: 355 },
        { size: "2GB", price: 710 },
        { size: "5GB", price: 1720 },
    ],
};

export default function DataPage() {
    const [network, setNetwork] = useState("MTN");
    const [phone, setPhone] = useState("");
    const [type, setType] = useState("SME");
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [pin, setPin] = useState("");

    const currentPlans = plans[network as keyof typeof plans];

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4 pb-28">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Buy Data</h1>
                <p className="text-sm text-gray-500">
                    Fast & affordable internet bundles
                </p>
            </div>

            <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-5 text-white">
                <div className="flex items-center gap-3">
                    <Smartphone size={30} />
                    <div>
                        <p className="text-green-100 text-sm">Instant Purchase</p>
                        <h2 className="text-xl font-bold">Data Bundles</h2>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <label className="mb-3 block font-semibold">Select Network</label>

                <div className="grid grid-cols-2 gap-3">
                    {networks.map((item) => (
                        <button
                            key={item.name}
                            onClick={() => {
                                setNetwork(item.name);
                                setSelectedPlan(null);
                            }}
                            className={`rounded-2xl border p-4 transition ${network === item.name
                                    ? "border-green-600 bg-green-50"
                                    : "bg-white"
                                }`}
                        >
                            <div
                                className={`mx-auto mb-2 h-10 w-10 rounded-full ${item.color}`}
                            />

                            <p className="font-semibold">{item.name}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <label className="mb-2 block font-semibold">Phone Number</label>

                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08012345678"
                    className="w-full rounded-2xl border bg-white p-4 outline-none focus:border-green-600"
                />
            </div>

            <div className="mt-6">
                <label className="mb-3 block font-semibold">Data Type</label>

                <div className="flex gap-2">
                    {dataTypes.map((item) => (
                        <button
                            key={item}
                            onClick={() => setType(item)}
                            className={`flex-1 rounded-xl py-3 text-sm font-semibold ${type === item
                                    ? "bg-green-600 text-white"
                                    : "bg-white border"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <label className="mb-3 block font-semibold">
                    Select Data Plan
                </label>

                <div className="grid grid-cols-2 gap-3">
                    {currentPlans.map((plan) => (
                        <button
                            key={plan.size}
                            onClick={() => setSelectedPlan(plan)}
                            className={`rounded-2xl border p-4 text-left transition ${selectedPlan?.size === plan.size
                                    ? "border-green-600 bg-green-50"
                                    : "bg-white"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold">{plan.size}</h3>

                                {selectedPlan?.size === plan.size && (
                                    <CheckCircle2 className="text-green-600" size={18} />
                                )}
                            </div>

                            <p className="mt-2 text-2xl font-bold text-green-600">
                                ₦{plan.price}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">{type} Bundle</p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <label className="mb-2 block font-semibold">
                    Transaction PIN
                </label>

                <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="****"
                    className="w-full rounded-2xl border bg-white p-4 text-center tracking-[0.5em]"
                />
            </div>

            <button className="mt-8 w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white">
                Buy Data
            </button>
        </main>
    );
}