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
    ArrowLeft,
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

        if (loading) return;

        try {
            setLoading(true);

            const response = await register({
                full_name: form.full_name.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim(),
                password: form.password,
            });

            toast.success(response.message);

            router.push(
                `/verify-otp?email=${encodeURIComponent(form.email.trim())}`
            );
        } catch (error: any) {
            const message =
                error?.response?.data?.message ||
                "Registration failed.";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="grid min-h-screen bg-slate-100 lg:grid-cols-2">
            {/* Desktop Left */}
            <section className="hidden overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 p-16 text-white lg:flex lg:flex-col lg:justify-center">
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-6xl font-bold">
                        QuickTxn
                    </h1>

                    <p className="mt-8 text-xl leading-9 text-green-100">
                        Join thousands of users making secure
                        transfers, wallet funding, airtime,
                        data and bill payments with QuickTxn.
                    </p>
                </motion.div>
            </section>

            {/* Mobile + Right */}
            <section className="flex min-h-screen items-center justify-center px-4 py-6 sm:p-8">
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl sm:max-w-md sm:p-8"
                >
                    {/* Mobile Back */}
                    <Link
                        href="/"
                        className="mb-5 inline-flex items-center gap-2 text-sm text-slate-500 lg:hidden"
                    >
                        <ArrowLeft size={17} />
                        Back
                    </Link>

                    {/* Header */}
                    <div>
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                            <User size={22} />
                        </div>

                        <h2 className="text-2xl font-bold sm:text-3xl">
                            Create Account
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Open your QuickTxn account
                        </p>
                    </div>

                    <form
                        onSubmit={handleRegister}
                        className="mt-6 space-y-4"
                    >
                        {/* Name */}
                        <div className="relative">
                            <User
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                name="full_name"
                                placeholder="Full Name"
                                value={form.full_name}
                                onChange={handleChange}
                                className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                value={form.email}
                                onChange={handleChange}
                                className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div className="relative">
                            <Phone
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                name="phone"
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={handleChange}
                                className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
                                className="h-12 w-full rounded-xl border border-slate-300 pl-11 pr-11 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                required
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="h-12 w-full rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700 disabled:bg-slate-400"
                        >
                            {loading
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-500">
                        Already have an account?
                        <Link
                            href="/login"
                            className="ml-1 font-semibold text-green-600"
                        >
                            Login
                        </Link>
                    </p>
                </motion.div>
            </section>
        </main>
    );
}