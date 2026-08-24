"use client";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { register } from "@/services/auth.service";

export default function RegisterPage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone: "",
        password: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await register(form);

            toast.success(response.message);

            router.push(
                `/verify-otp?email=${form.email}`
            );

        } catch (error: unknown) {

            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ??
                    "Registration failed."
                );
            } else {
                toast.error("Registration failed.");
            }

        } finally {

            setLoading(false);

        }
    };

    return (
        <main className="grid min-h-screen lg:grid-cols-2">

            {/* Left Side */}

            <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-16 text-white">

                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-6xl font-bold">
                        QuickTxn
                    </h1>

                    <p className="mt-8 text-xl leading-9 text-green-100">
                        Join thousands of users making secure
                        payments, transfers, airtime and data
                        purchases with QuickTxn.
                    </p>
                </motion.div>

            </div>

            {/* Right Side */}

            <div className="flex items-center justify-center bg-slate-100 p-8">

                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg rounded-3xl bg-white p-10 shadow-2xl"
                >

                    <h2 className="text-4xl font-bold">
                        Create Account
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Open your QuickTxn account
                    </p>

                    <form
                        onSubmit={handleRegister}
                        className="mt-8 space-y-5"
                    >

                        {/* Full Name */}

                        <div className="relative">

                            <User
                                className="absolute left-4 top-4 text-slate-400"
                                size={20}
                            />

                            <input
                                name="full_name"
                                placeholder="Full Name"
                                value={form.full_name}
                                onChange={handleChange}
                                className="w-full rounded-xl border py-4 pl-12 pr-4 outline-none focus:border-green-600"
                                required
                            />

                        </div>

                        {/* Email */}

                        <div className="relative">

                            <Mail
                                className="absolute left-4 top-4 text-slate-400"
                                size={20}
                            />

                            <input
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full rounded-xl border py-4 pl-12 pr-4 outline-none focus:border-green-600"
                                required
                            />

                        </div>

                        {/* Phone */}

                        <div className="relative">

                            <Phone
                                className="absolute left-4 top-4 text-slate-400"
                                size={20}
                            />

                            <input
                                name="phone"
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={handleChange}
                                className="w-full rounded-xl border py-4 pl-12 pr-4 outline-none focus:border-green-600"
                                required
                            />

                        </div>

                        {/* Password */}

                        <div className="relative">

                            <Lock
                                className="absolute left-4 top-4 text-slate-400"
                                size={20}
                            />

                            <input
                                name="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full rounded-xl border py-4 pl-12 pr-12 outline-none focus:border-green-600"
                                required
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="absolute right-4 top-4"
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>

                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-green-600 py-4 font-semibold text-white transition hover:bg-green-700"
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>

                    </form>

                    <p className="mt-8 text-center">

                        Already have an account?

                        <Link
                            href="/login"
                            className="ml-2 font-semibold text-green-600"
                        >
                            Login
                        </Link>

                    </p>

                </motion.div>

            </div>

        </main>
    );
}