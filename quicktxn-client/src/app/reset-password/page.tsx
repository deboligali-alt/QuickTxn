"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";
import { resetPassword } from "@/services/auth.service";

export default function ResetPasswordPage() {
    const router = useRouter();
    const params = useSearchParams();

    const email = params.get("email") || "";

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await resetPassword({
                email,
                otp,
                newPassword,
            });

            toast.success(res.message);

            router.replace("/login");
        } catch (err: any) {
            toast.error(
                err.response?.data?.message ||
                "Password reset failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lg">
                <button
                    onClick={() => router.back()}
                    className="mb-5 flex items-center gap-2 text-gray-600"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <h1 className="text-2xl font-bold">
                    Reset Password
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Enter the OTP sent to **{email}**
                </p>

                <form
                    onSubmit={handleReset}
                    className="mt-6 space-y-4"
                >
                    <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="6-digit OTP"
                        maxLength={6}
                        className="w-full rounded-xl border p-3 text-center text-lg tracking-[0.3em]"
                        required
                    />

                    <div className="relative">
                        <Lock
                            size={18}
                            className="absolute left-4 top-4 text-gray-400"
                        />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            placeholder="New password"
                            className="w-full rounded-xl border p-3 pl-11"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white"
                    >
                        {loading
                            ? "Updating..."
                            : "Reset Password"}
                    </button>
                </form>
            </div>
        </main>
    );
}