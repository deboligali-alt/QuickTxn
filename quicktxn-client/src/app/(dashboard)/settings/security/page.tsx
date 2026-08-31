"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
    ArrowLeft,
    Shield,
    Lock,
    KeyRound,
    Smartphone,
    CheckCircle2,
} from "lucide-react";

export default function SecurityPage() {
    const router = useRouter();

    const [currentPin, setCurrentPin] = useState("");
    const [newPin, setNewPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [biometric, setBiometric] = useState(false);

    const changePin = async () => {
        if (newPin !== confirmPin) {
            return alert("PIN does not match");
        }

        try {
            setLoading(true);

            await api.patch("/pin/change", {
                currentPin,
                newPin,
            });

            alert("Transaction PIN updated successfully");

            setCurrentPin("");
            setNewPin("");
            setConfirmPin("");
        } catch (err: any) {
            alert(err.response?.data?.message || "Unable to change PIN");
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
                <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <Shield size={30} />
                        <div>
                            <p className="text-sm text-slate-300">Protect Your Account</p>
                            <h1 className="text-2xl font-bold">Security Center</h1>
                        </div>
                    </div>
                </div>

                {/* Change PIN */}
                <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <KeyRound className="text-green-600" size={22} />
                        <h2 className="text-lg font-bold">Change Transaction PIN</h2>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="password"
                            maxLength={4}
                            value={currentPin}
                            onChange={(e) => setCurrentPin(e.target.value)}
                            placeholder="Current PIN"
                            className="w-full rounded-xl border p-3 text-center tracking-[0.5em]"
                        />

                        <input
                            type="password"
                            maxLength={4}
                            value={newPin}
                            onChange={(e) => setNewPin(e.target.value)}
                            placeholder="New PIN"
                            className="w-full rounded-xl border p-3 text-center tracking-[0.5em]"
                        />

                        <input
                            type="password"
                            maxLength={4}
                            value={confirmPin}
                            onChange={(e) => setConfirmPin(e.target.value)}
                            placeholder="Confirm PIN"
                            className="w-full rounded-xl border p-3 text-center tracking-[0.5em]"
                        />

                        <button
                            onClick={changePin}
                            disabled={loading}
                            className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white"
                        >
                            {loading ? "Updating..." : "Update PIN"}
                        </button>
                    </div>
                </div>

                {/* Biometric */}
                <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Smartphone className="text-indigo-600" size={22} />
                            <div>
                                <h3 className="font-semibold">Biometric Login</h3>
                                <p className="text-xs text-gray-500">
                                    Fingerprint / Face ID
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setBiometric(!biometric)}
                            className={`relative h-7 w-12 rounded-full transition ${biometric ? "bg-green-600" : "bg-gray-300"
                                }`}
                        >
                            <span
                                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${biometric ? "left-6" : "left-1"
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Password */}
                <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
                    <button
                        onClick={() => router.push("/settings/password")}
                        className="flex w-full items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <Lock className="text-blue-600" size={22} />
                            <div className="text-left">
                                <h3 className="font-semibold">Change Password</h3>
                                <p className="text-xs text-gray-500">
                                    Update your login password
                                </p>
                            </div>
                        </div>

                        <span>›</span>
                    </button>
                </div>

                {/* Active Device */}
                <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                        <CheckCircle2 className="text-green-600" size={20} />
                        <h3 className="font-semibold">Current Device</h3>
                    </div>

                    <p className="text-sm text-gray-600">Windows • Chrome Browser</p>
                    <p className="text-xs text-gray-500">Active now</p>
                </div>
            </div>
        </main>
    );
}