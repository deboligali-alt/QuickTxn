"use client";

import axios from "axios";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    verifyOTP,
    resendOTP,
} from "@/services/auth.service";

export default function VerifyOTPClient() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const email = searchParams.get("email") || "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await verifyOTP({
                email,
                otp,
            });

            alert(response.message);

            router.push("/login");

        } catch (error: unknown) {

            if (axios.isAxiosError<{ message: string }>(error)) {
                alert(
                    error.response?.data?.message ??
                    "OTP verification failed."
                );
            } else {
                alert("OTP verification failed.");
            }

        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            const response = await resendOTP(email);

            alert(response.message);

        } catch (error: unknown) {

            if (axios.isAxiosError<{ message: string }>(error)) {
                alert(
                    error.response?.data?.message ??
                    "Unable to resend OTP."
                );
            } else {
                alert("Unable to resend OTP.");
            }
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-100">

            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

                <h1 className="text-3xl font-bold text-center text-green-600">
                    Verify Email
                </h1>

                <p className="mt-3 text-center text-slate-500">
                    Enter the OTP sent to
                </p>

                <p className="mt-1 text-center font-semibold">
                    {email}
                </p>

                <form
                    onSubmit={handleVerify}
                    className="mt-8 space-y-5"
                >
                    <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full rounded-xl border p-4 text-center text-2xl tracking-widest"
                        maxLength={6}
                        required
                    />

                    <button
                        disabled={loading}
                        className="w-full rounded-xl bg-green-600 py-4 font-semibold text-white"
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>

                <button
                    onClick={handleResend}
                    className="mt-6 w-full font-semibold text-green-600"
                >
                    Resend OTP
                </button>

            </div>

        </main>
    );
}