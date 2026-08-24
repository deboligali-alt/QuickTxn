"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    ShieldCheck,
    CalendarDays,
    Edit3,
    Lock,
    CheckCircle2,
    Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { getProfile } from "@/services/dashboard.service";

interface Profile {
    id?: string;
    full_name: string;
    email: string;
    phone?: string;
    created_at?: string;
    is_verified?: boolean;
    status?: string;
}

export default function ProfilePage() {
    const router = useRouter();

    const [profile, setProfile] =
        useState<Profile | null>(null);

    const [loading, setLoading] =
        useState(true);

    const loadProfile = useCallback(async () => {
        try {
            setLoading(true);

            const token =
                localStorage.getItem("token");

            if (!token) {
                router.replace("/login");
                return;
            }

            const response =
                await getProfile(token);

            /*
             * Your dashboard currently uses:
             * profileRes.user
             */
            setProfile(
                response.user || response.data || response
            );
        } catch (error: unknown) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ||
                    "Unable to load profile."
                );
            } else {
                toast.error(
                    "Unable to load profile."
                );
            }
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const getInitials = () => {
        if (!profile?.full_name) {
            return "U";
        }

        return profile.full_name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((name) =>
                name.charAt(0).toUpperCase()
            )
            .join("");
    };

    const formatDate = (
        date?: string
    ) => {
        if (!date) {
            return "Not available";
        }

        return new Date(date).toLocaleDateString(
            "en-NG",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );
    };

    if (loading) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center">

                <div className="text-center">

                    <Loader2
                        size={36}
                        className="mx-auto animate-spin text-green-600"
                    />

                    <p className="mt-4 font-medium text-slate-500">
                        Loading your profile...
                    </p>

                </div>

            </main>
        );
    }

    if (!profile) {
        return (
            <main className="flex min-h-[70vh] items-center justify-center">

                <div className="text-center">

                    <User
                        size={42}
                        className="mx-auto text-slate-400"
                    />

                    <h2 className="mt-4 text-xl font-bold text-slate-900">
                        Profile unavailable
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        We could not load your profile.
                    </p>

                    <button
                        type="button"
                        onClick={loadProfile}
                        className="mt-5 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                    >
                        Try Again
                    </button>

                </div>

            </main>
        );
    }

    return (
        <main className="min-h-full bg-slate-50">

            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

                {/* BACK */}

                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-green-600"
                >
                    <ArrowLeft size={17} />
                    Back
                </button>

                {/* HEADER */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="mb-8"
                >

                    <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                        My Profile
                    </h1>

                    <p className="mt-2 text-slate-500">
                        View and manage your QuickTxn
                        account information.
                    </p>

                </motion.div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* =========================
                        PROFILE CARD
                    ========================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        className="lg:col-span-1"
                    >

                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                            {/* GREEN HEADER */}

                            <div className="h-28 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500" />

                            <div className="px-6 pb-7">

                                {/* AVATAR */}

                                <div className="-mt-14">

                                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-green-100 text-3xl font-extrabold text-green-700 shadow-lg">
                                        {getInitials()}
                                    </div>

                                </div>

                                {/* NAME */}

                                <h2 className="mt-5 text-2xl font-extrabold text-slate-900">
                                    {profile.full_name}
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {profile.email}
                                </p>

                                {/* STATUS */}

                                <div className="mt-4">

                                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">

                                        <CheckCircle2
                                            size={14}
                                        />

                                        Active Account

                                    </span>

                                </div>

                                {/* EDIT */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push(
                                            "/settings"
                                        )
                                    }
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-green-600 py-3 font-semibold text-green-600 transition hover:bg-green-50"
                                >

                                    <Edit3 size={18} />

                                    Edit Profile

                                </button>

                            </div>

                        </div>

                    </motion.div>

                    {/* =========================
                        RIGHT SIDE
                    ========================= */}

                    <div className="space-y-6 lg:col-span-2">

                        {/* PERSONAL INFORMATION */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 0.1,
                            }}
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                        >

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        Personal Information
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Your account details
                                    </p>

                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">

                                    <User size={22} />

                                </div>

                            </div>

                            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">

                                {/* NAME */}

                                <div className="rounded-2xl bg-slate-50 p-5">

                                    <div className="flex items-center gap-2 text-sm text-slate-500">

                                        <User size={16} />

                                        Full Name

                                    </div>

                                    <p className="mt-2 font-bold text-slate-900">
                                        {profile.full_name ||
                                            "Not provided"}
                                    </p>

                                </div>

                                {/* EMAIL */}

                                <div className="rounded-2xl bg-slate-50 p-5">

                                    <div className="flex items-center gap-2 text-sm text-slate-500">

                                        <Mail size={16} />

                                        Email Address

                                    </div>

                                    <p className="mt-2 break-all font-bold text-slate-900">
                                        {profile.email ||
                                            "Not provided"}
                                    </p>

                                </div>

                                {/* PHONE */}

                                <div className="rounded-2xl bg-slate-50 p-5">

                                    <div className="flex items-center gap-2 text-sm text-slate-500">

                                        <Phone size={16} />

                                        Phone Number

                                    </div>

                                    <p className="mt-2 font-bold text-slate-900">
                                        {profile.phone ||
                                            "Not provided"}
                                    </p>

                                </div>

                                {/* JOINED */}

                                <div className="rounded-2xl bg-slate-50 p-5">

                                    <div className="flex items-center gap-2 text-sm text-slate-500">

                                        <CalendarDays
                                            size={16}
                                        />

                                        Member Since

                                    </div>

                                    <p className="mt-2 font-bold text-slate-900">
                                        {formatDate(
                                            profile.created_at
                                        )}
                                    </p>

                                </div>

                            </div>

                        </motion.div>

                        {/* ACCOUNT SECURITY */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 0.15,
                            }}
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                        >

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">

                                    <ShieldCheck
                                        size={24}
                                    />

                                </div>

                                <div className="flex-1">

                                    <h2 className="text-xl font-bold text-slate-900">
                                        Account Security
                                    </h2>

                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        Manage your password and
                                        transaction security.
                                    </p>

                                </div>

                            </div>

                            <div className="mt-7 space-y-4">

                                {/* PASSWORD */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push(
                                            "/settings"
                                        )
                                    }
                                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 p-5 text-left transition hover:border-green-200 hover:bg-green-50/50"
                                >

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">

                                            <Lock
                                                size={19}
                                            />

                                        </div>

                                        <div>

                                            <p className="font-bold text-slate-900">
                                                Password
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Change your account
                                                password
                                            </p>

                                        </div>

                                    </div>

                                    <span className="text-sm font-semibold text-green-600">
                                        Manage
                                    </span>

                                </button>

                                {/* PIN */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push(
                                            "/settings/pin"
                                        )
                                    }
                                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 p-5 text-left transition hover:border-green-200 hover:bg-green-50/50"
                                >

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">

                                            <ShieldCheck
                                                size={19}
                                            />

                                        </div>

                                        <div>

                                            <p className="font-bold text-slate-900">
                                                Transaction PIN
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Manage your 4-digit
                                                transaction PIN
                                            </p>

                                        </div>

                                    </div>

                                    <span className="text-sm font-semibold text-green-600">
                                        Manage
                                    </span>

                                </button>

                            </div>

                        </motion.div>

                        {/* SECURITY MESSAGE */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                delay: 0.2,
                            }}
                            className="rounded-3xl bg-gradient-to-r from-green-700 to-emerald-500 p-6 text-white shadow-lg"
                        >

                            <div className="flex items-start gap-4">

                                <ShieldCheck
                                    size={30}
                                    className="shrink-0"
                                />

                                <div>

                                    <h3 className="text-lg font-bold">
                                        Keep your account secure
                                    </h3>

                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-green-50">
                                        Never share your password,
                                        OTP or transaction PIN with
                                        anyone. QuickTxn should never
                                        ask you to disclose your PIN.
                                    </p>

                                </div>

                            </div>

                        </motion.div>

                    </div>

                </div>

            </div>

        </main>
    );
}