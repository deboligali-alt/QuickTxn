"use client";

import { useState } from "react";
import api from "@/lib/api";
import { ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SetPinPage() {
    const router = useRouter();

    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [loading, setLoading] = useState(false);

    const createPin = async () => {
        if (pin.length !== 4 || confirmPin.length !== 4) {
            return alert("PIN must be exactly 4 digits.");
        }

        if (pin !== confirmPin) {
            return alert("PINs do not match.");
        }

        try {
            setLoading(true);

            await api.post("/user/set-pin", { pin });

            alert("Transaction PIN created successfully.");
            router.push("/settings");
        } catch (error: any) {
            alert(
                error.response?.data?.message || "Unable to create PIN"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4">
            <div className="mb-8 flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-3">
                    <ShieldCheck className="text-green-600" size={26} />
                </div>

                <div>
                    <h1 className="text-2xl font-bold">Create PIN</h1>
                    <p className="text-sm text-gray-500">
                        Set your 4-digit transaction PIN
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter 4-digit PIN"
                    className="w-full rounded-2xl border bg-white p-4 text-center text-2xl tracking-[0.5em] outline-none"
                />

                <input
                    type="password"
                    maxLength={4}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="Confirm PIN"
                    className="w-full rounded-2xl border bg-white p-4 text-center text-2xl tracking-[0.5em] outline-none"
                />
            </div>

            <button
                onClick={createPin}
                disabled={loading}
                className="mt-8 w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white disabled:opacity-60"
            >
                {loading ? "Creating..." : "Create PIN"}
            </button>
        </main>
    );
}