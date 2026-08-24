"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/services/auth.service";

export default function ForgotPasswordPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {

            setLoading(true);

            const response =
                await forgotPassword(email);

            alert(response.message);

            router.push(
                `/reset-password?email=${email}`
            );

        } catch (error: unknown) {

            if (axios.isAxiosError(error)) {
                alert(
                    error.response?.data?.message ??
                    "Unable to send OTP."
                );
            } else {
                alert("Unable to send OTP.");
            }

        } finally {

            setLoading(false);

        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-100">

            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

                <h1 className="text-3xl font-bold text-center">
                    Forgot Password
                </h1>

                <p className="mt-3 text-center text-slate-500">
                    Enter your email address.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5"
                >

                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="w-full rounded-xl border p-4"
                        required
                    />

                    <button
                        disabled={loading}
                        className="w-full rounded-xl bg-green-600 py-4 text-white"
                    >
                        {loading
                            ? "Sending..."
                            : "Send OTP"}
                    </button>

                </form>

            </div>

        </main>
    );
}