"use client";

import { useState } from "react";
import axios from "axios";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChangePinPage() {
    const router = useRouter();

    const [currentPin, setCurrentPin] = useState("");
    const [newPin, setNewPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePin = async () => {
        if (
            currentPin.length !== 4 ||
            newPin.length !== 4 ||
            confirmPin.length !== 4
        ) {
            return alert("PIN must be 4 digits.");
        }

        if (newPin !== confirmPin) {
            return alert("New PIN does not match.");
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/users/change-pin`,
                {
                    currentPin,
                    newPin,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Transaction PIN updated successfully.");
            router.push("/settings");
        } catch (error: any) {
            alert(
                error.response?.data?.message || "Unable to change PIN"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4">
            <div className="mb-8 flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-3">
                    <Lock className="text-green-600" size={24} />
                </div>

                <div>
                    <h1 className="text-2xl font-bold">
                        Change PIN
                    </h1>
                    <p className="text-sm text-gray-500">
                        Secure your transactions
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <input
                    type="password"
                    maxLength={4}
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value)}
                    placeholder="Current PIN"
                    className="w-full rounded-2xl border bg-white p-4 text-center text-xl tracking-[0.5em] outline-none"
                />

                <input
                    type="password"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="New PIN"
                    className="w-full rounded-2xl border bg-white p-4 text-center text-xl tracking-[0.5em] outline-none"
                />

                <input
                    type="password"
                    maxLength={4}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="Confirm New PIN"
                    className="w-full rounded-2xl border bg-white p-4 text-center text-xl tracking-[0.5em] outline-none"
                />
            </div>

            <button
                onClick={handleChangePin}
                disabled={loading}
                className="mt-8 w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white disabled:opacity-60"
            >
                {loading ? "Updating..." : "Update PIN"}
            </button>
        </main>
    );
}