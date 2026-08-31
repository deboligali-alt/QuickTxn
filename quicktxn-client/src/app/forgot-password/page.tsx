"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { forgotPassword } from "@/services/auth.service";

export default function ForgotPasswordPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await forgotPassword(email.trim().toLowerCase());

            toast.success(res.message);

            router.push(
                `/reset-password?email=${encodeURIComponent(email)}`
            );
        } catch (err: any) {
            toast.error(
                err.response?.data?.message ||
                "Unable to send OTP."
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
                    Forgot Password
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Enter your registered email to receive a 6-digit OTP.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                >
                    <div className="relative">
                        <Mail
                            size={18}
                            className="absolute left-4 top-4 text-gray-400"
                        />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border p-3 pl-11 outline-none focus:border-green-600"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white"
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                </form>
            </div>
        </main>
    );
}