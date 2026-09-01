"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, Shield, KeyRound, Lock } from "lucide-react";

export default function SecurityPage() {
    const router = useRouter();

    const [hasPin, setHasPin] = useState(false);

    const [currentPin, setCurrentPin] = useState("");
    const [newPin, setNewPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const checkPin = async () => {
            try {
                const res = await api.get("/pin/status");
                setHasPin(res.data.hasPin);
            } catch (err) {
                console.error(err);
            }
        };

        checkPin();
    }, []);

    const clearAlert = () => {
        setMessage("");
        setError("");
    };

    const submitPin = async () => {
        clearAlert();

        if (newPin.length !== 4 || confirmPin.length !== 4) {
            setError("PIN must be exactly 4 digits.");
            return;
        }

        if (newPin !== confirmPin) {
            setError("New PIN and Confirm PIN do not match.");
            return;
        }

        try {
            setLoading(true);

            if (hasPin) {
                await api.patch("/pin/change", {
                    currentPin,
                    newPin,
                });

                setMessage("Transaction PIN changed successfully.");
            } else {
                await api.post("/pin/create", {
                    pin: newPin,
                });

                setHasPin(true);
                setMessage("Transaction PIN created successfully.");
            }

            setCurrentPin("");
            setNewPin("");
            setConfirmPin("");
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Unable to complete request."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-md p-4 pb-24">
                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="mb-4 flex items-center gap-2 text-gray-700"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {/* Header */}
                <div className="rounded-3xl bg-gradient-to-r from-green-700 to-emerald-500 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <Shield size={30} />

                        <div>
                            <p className="text-sm text-green-100">
                                Protect Your Wallet
                            </p>

                            <h1 className="text-2xl font-bold">
                                Security Center
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Success */}
                {message && (
                    <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-3 text-center font-semibold text-green-700">
                        ✅ {message}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-center font-semibold text-red-700">
                        {error}
                    </div>
                )}

                {/* PIN Card */}
                <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
                    <div className="mb-5 flex items-center gap-3">
                        <KeyRound
                            className="text-green-600"
                            size={24}
                        />

                        <div>
                            <h2 className="text-lg font-bold">
                                {hasPin
                                    ? "Change Transaction PIN"
                                    : "Create Transaction PIN"}
                            </h2>

                            <p className="text-xs text-gray-500">
                                {hasPin
                                    ? "Update your existing 4-digit PIN"
                                    : "Create a secure 4-digit PIN"}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {hasPin && (
                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-4 top-4 text-gray-400"
                                />

                                <input
                                    type="password"
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={currentPin}
                                    onChange={(e) =>
                                        setCurrentPin(
                                            e.target.value.replace(/\D/g, "")
                                        )
                                    }
                                    placeholder="Current PIN"
                                    className="w-full rounded-xl border p-3 pl-11 text-center tracking-[0.5em] outline-none focus:border-green-600"
                                />
                            </div>
                        )}

                        <div className="relative">
                            <KeyRound
                                size={18}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            <input
                                type="password"
                                inputMode="numeric"
                                maxLength={4}
                                value={newPin}
                                onChange={(e) =>
                                    setNewPin(
                                        e.target.value.replace(/\D/g, "")
                                    )
                                }
                                placeholder={
                                    hasPin ? "New PIN" : "Create PIN"
                                }
                                className="w-full rounded-xl border p-3 pl-11 text-center tracking-[0.5em] outline-none focus:border-green-600"
                            />
                        </div>

                        <div className="relative">
                            <KeyRound
                                size={18}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            <input
                                type="password"
                                inputMode="numeric"
                                maxLength={4}
                                value={confirmPin}
                                onChange={(e) =>
                                    setConfirmPin(
                                        e.target.value.replace(/\D/g, "")
                                    )
                                }
                                placeholder="Confirm PIN"
                                className="w-full rounded-xl border p-3 pl-11 text-center tracking-[0.5em] outline-none focus:border-green-600"
                            />
                        </div>

                        <button
                            onClick={submitPin}
                            disabled={loading}
                            className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                        >
                            {loading
                                ? "Please wait..."
                                : hasPin
                                    ? "Change PIN"
                                    : "Create PIN"}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}