"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";
import { resetPassword } from "@/services/auth.service";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const email = searchParams.get("email") || "";

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await resetPassword({
                email,
                otp,
                newPassword,
            });

            setSuccess(res.message);

            setTimeout(() => {
                router.replace("/login");
            }, 2000);
        } catch (err: any) {
            toast.error(
                err.response?.data?.message || "Password reset failed."
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

                <h1 className="text-2xl font-bold">Reset Password</h1>

                <p className="mt-2 text-sm text-gray-500">
                    Enter the OTP sent to{" "}
                    <span className="font-medium">{email}</span>
                </p>

                {success && (
                    <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
                        ✅ {success}
                    </div>
                )}

                <form onSubmit={handleReset} className="mt-6 space-y-4">
                    <input
                        autoFocus
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) =>
                            setOtp(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="6-digit OTP"
                        className="w-full rounded-xl border p-3 text-center text-lg tracking-[0.3em] outline-none focus:border-green-600"
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
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                            autoComplete="new-password"
                            className="w-full rounded-xl border p-3 pl-11 outline-none focus:border-green-600"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                    >
                        {loading ? "Updating..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <main className="flex min-h-screen items-center justify-center bg-gray-50">
                    <p className="text-gray-500">Loading...</p>
                </main>
            }
        >
            <ResetPasswordForm />
        </Suspense>
    );
}