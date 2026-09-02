"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
    ArrowLeft,
    Shield,
    Lock,
    KeyRound,
    CheckCircle2,
    AlertCircle,
    Clock3,
} from "lucide-react";

export default function PinPage() {
    const router = useRouter();

    const [mode, setMode] = useState<"create" | "change">("create");

    const [currentPin, setCurrentPin] = useState("");
    const [newPin, setNewPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");

    const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState<
        "" | "SUCCESS" | "FAILED" | "PENDING"
    >("");
    const [message, setMessage] = useState("");

    const handleSubmit = async () => {
        setStatus("");
        setMessage("");

        if (newPin.length !== 4 || confirmPin.length !== 4) {
            setStatus("FAILED");
            setMessage("PIN must be exactly 4 digits.");
            return;
        }

        if (newPin !== confirmPin) {
            setStatus("FAILED");
            setMessage("PIN does not match.");
            return;
        }

        if (mode === "change" && currentPin.length !== 4) {
            setStatus("FAILED");
            setMessage("Enter your current PIN.");
            return;
        }

        try {
            setLoading(true);

            const res =
                mode === "create"
                    ? await api.post("/pin/create", {
                        pin: newPin,
                    })
                    : await api.patch("/pin/change", {
                        currentPin,
                        newPin,
                    });

            setStatus(res.data.status || "SUCCESS");
            setMessage(res.data.message);

            setCurrentPin("");
            setNewPin("");
            setConfirmPin("");

            setTimeout(() => {
                router.replace("/settings/security");
            }, 1800);
        } catch (err: any) {
            setStatus(err.response?.data?.status || "FAILED");
            setMessage(
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
                <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <Shield size={30} />
                        <div>
                            <p className="text-sm text-green-100">
                                Wallet Security
                            </p>
                            <h1 className="text-2xl font-bold">
                                Transaction PIN
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-5 flex rounded-2xl bg-white p-1 shadow-sm">
                    <button
                        onClick={() => {
                            setMode("create");
                            setStatus("");
                        }}
                        className={`flex-1 rounded-xl py-3 text-sm font-semibold transition ${mode === "create"
                                ? "bg-green-600 text-white"
                                : "text-gray-600"
                            }`}
                    >
                        Create PIN
                    </button>

                    <button
                        onClick={() => {
                            setMode("change");
                            setStatus("");
                        }}
                        className={`flex-1 rounded-xl py-3 text-sm font-semibold transition ${mode === "change"
                                ? "bg-green-600 text-white"
                                : "text-gray-600"
                            }`}
                    >
                        Change PIN
                    </button>
                </div>

                {/* Success */}
                {status === "SUCCESS" && (
                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
                        <CheckCircle2 size={20} />
                        <div>
                            <p className="font-semibold">Success</p>
                            <p className="text-sm">{message}</p>
                        </div>
                    </div>
                )}

                {/* Failed */}
                {status === "FAILED" && (
                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                        <AlertCircle size={20} />
                        <div>
                            <p className="font-semibold">Failed</p>
                            <p className="text-sm">{message}</p>
                        </div>
                    </div>
                )}

                {/* Pending */}
                {status === "PENDING" && (
                    <div className="mt-4 flex items-start gap-3 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
                        <Clock3 size={20} />
                        <div>
                            <p className="font-semibold">Pending</p>
                            <p className="text-sm">{message}</p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <KeyRound className="text-green-600" size={22} />
                        <h2 className="text-lg font-bold">
                            {mode === "create"
                                ? "Create New PIN"
                                : "Change PIN"}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {mode === "change" && (
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Current PIN
                                </label>
                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-4 text-gray-400"
                                    />
                                    <input
                                        type="password"
                                        maxLength={4}
                                        value={currentPin}
                                        onChange={(e) =>
                                            setCurrentPin(
                                                e.target.value.replace(/\D/g, "")
                                            )
                                        }
                                        placeholder="••••"
                                        className="w-full rounded-xl border p-3 pl-11 text-center tracking-[0.5em] outline-none focus:border-green-600"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                New PIN
                            </label>
                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-4 top-4 text-gray-400"
                                />
                                <input
                                    type="password"
                                    maxLength={4}
                                    value={newPin}
                                    onChange={(e) =>
                                        setNewPin(
                                            e.target.value.replace(/\D/g, "")
                                        )
                                    }
                                    placeholder="••••"
                                    className="w-full rounded-xl border p-3 pl-11 text-center tracking-[0.5em] outline-none focus:border-green-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Confirm PIN
                            </label>
                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-4 top-4 text-gray-400"
                                />
                                <input
                                    type="password"
                                    maxLength={4}
                                    value={confirmPin}
                                    onChange={(e) =>
                                        setConfirmPin(
                                            e.target.value.replace(/\D/g, "")
                                        )
                                    }
                                    placeholder="••••"
                                    className="w-full rounded-xl border p-3 pl-11 text-center tracking-[0.5em] outline-none focus:border-green-600"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                        >
                            {loading
                                ? "Processing..."
                                : mode === "create"
                                    ? "Create PIN"
                                    : "Update PIN"}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}