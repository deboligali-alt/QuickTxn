"use client";

import { useEffect, useState } from "react";
import { Save, RefreshCw, Percent } from "lucide-react";
import api from "@/lib/api";

interface Rate {
    id: string;
    network: string;
    rate: number;
}

export default function AirtimeRatesPage() {
    const [rates, setRates] = useState<Rate[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState("");

    const loadRates = async () => {
        try {
            const res = await api.get("/airtime-rates");
            setRates(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRates();
    }, []);

    const updateRate = async (id: string, value: number) => {
        try {
            setSaving(id);

            await api.put(`/admin/airtime-rates/${id}`, {
                rate: value,
            });

            alert("Rate updated successfully.");

            loadRates();
        } catch (err) {
            console.error(err);
            alert("Unable to update rate.");
        } finally {
            setSaving("");
        }
    };

    const updateValue = (id: string, value: number) => {
        setRates((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, rate: value } : item
            )
        );
    };

    const colors: Record<string, string> = {
        MTN: "bg-yellow-400",
        AIRTEL: "bg-red-500",
        GLO: "bg-green-600",
        "9MOBILE": "bg-emerald-500",
    };

    return (
        <main className="mx-auto max-w-6xl space-y-8 p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-4xl font-bold">
                        Airtime Rates
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Update conversion percentages for each network.
                    </p>

                </div>

                <button
                    onClick={loadRates}
                    className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                >
                    <RefreshCw size={18} />
                    Refresh
                </button>

            </div>

            {loading ? (

                <div className="py-20 text-center">
                    Loading rates...
                </div>

            ) : (

                <div className="grid gap-6 md:grid-cols-2">

                    {rates.map((item) => (

                        <div
                            key={item.id}
                            className="rounded-3xl bg-white p-6 shadow transition hover:shadow-lg"
                        >

                            <div className="mb-6 flex items-center gap-4">

                                <div
                                    className={`flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold text-white ${colors[item.network]
                                        }`}
                                >
                                    {item.network === "9MOBILE"
                                        ? "9"
                                        : item.network.substring(0, 1)}
                                </div>

                                <div>

                                    <h2 className="text-2xl font-bold">
                                        {item.network}
                                    </h2>

                                    <p className="text-slate-500">
                                        Current conversion rate
                                    </p>

                                </div>

                            </div>

                            <div className="space-y-3">

                                <div className="flex items-center justify-between">

                                    <span className="text-slate-500">
                                        Percentage
                                    </span>

                                    <span className="text-3xl font-bold text-green-600">
                                        {item.rate}%
                                    </span>

                                </div>

                                <div className="relative">

                                    <Percent
                                        size={18}
                                        className="absolute left-4 top-3.5 text-slate-400"
                                    />

                                    <input
                                        type="number"
                                        min={1}
                                        max={100}
                                        value={item.rate}
                                        onChange={(e) =>
                                            updateValue(
                                                item.id,
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full rounded-xl border py-3 pl-11 pr-4 text-lg font-semibold outline-none focus:border-green-600"
                                    />

                                </div>

                                <button
                                    onClick={() =>
                                        updateRate(item.id, item.rate)
                                    }
                                    disabled={saving === item.id}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                                >

                                    <Save size={18} />

                                    {saving === item.id
                                        ? "Saving..."
                                        : "Save Rate"}

                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </main>
    );
}