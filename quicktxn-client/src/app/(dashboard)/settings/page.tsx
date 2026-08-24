"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Lock,
    ShieldCheck,
    Bell,
    ChevronRight,
    Eye,
    EyeOff,
    Save,
    Loader2,
    CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { getProfile } from "@/services/dashboard.service";

interface Profile {
    id?: string;
    full_name: string;
    email: string;
    phone?: string;
}

export default function SettingsPage() {
    const router = useRouter();

    const [profile, setProfile] =
        useState<Profile | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [savingProfile, setSavingProfile] =
        useState(false);

    const [changingPassword, setChangingPassword] =
        useState(false);

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [fullName, setFullName] =
        useState("");

    const [phone, setPhone] =
        useState("");

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [emailNotifications, setEmailNotifications] =
        useState(true);

    const [transactionNotifications, setTransactionNotifications] =
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

            const user =
                response.user ||
                response.data ||
                response;

            setProfile(user);

            setFullName(
                user.full_name || ""
            );

            setPhone(
                user.phone || ""
            );
        } catch (error: unknown) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ||
                    "Unable to load settings."
                );
            } else {
                toast.error(
                    "Unable to load settings."
                );
            }
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleSaveProfile = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!fullName.trim()) {
            toast.error(
                "Full name cannot be empty."
            );
            return;
        }

        if (!phone.trim()) {
            toast.error(
                "Phone number cannot be empty."
            );
            return;
        }

        /*
         * Connect your actual update-profile
         * endpoint here.
         *
         * Example:
         *
         * await updateProfile(token, {
         *     full_name: fullName,
         *     phone,
         * });
         */

        try {
            setSavingProfile(true);

            const token =
                localStorage.getItem("token");

            if (!token) {
                router.replace("/login");
                return;
            }

            /*
             * UI-only for now until we confirm
             * your actual backend route.
             */

            setProfile((current) =>
                current
                    ? {
                        ...current,
                        full_name:
                            fullName,
                        phone,
                    }
                    : current
            );

            const storedUser =
                localStorage.getItem("user");

            if (storedUser) {
                try {
                    const parsedUser =
                        JSON.parse(
                            storedUser
                        );

                    localStorage.setItem(
                        "user",
                        JSON.stringify({
                            ...parsedUser,
                            full_name:
                                fullName,
                            phone,
                        })
                    );
                } catch {
                    // Ignore malformed local storage data.
                }
            }

            toast.success(
                "Profile information updated."
            );
        } catch (error) {
            console.error(error);

            toast.error(
                "Unable to update profile."
            );
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!currentPassword) {
            toast.error(
                "Enter your current password."
            );
            return;
        }

        if (newPassword.length < 6) {
            toast.error(
                "New password must be at least 6 characters."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error(
                "New passwords do not match."
            );
            return;
        }

        try {
            setChangingPassword(true);

            /*
             * Connect your actual change-password
             * endpoint here.
             *
             * Example:
             *
             * await changePassword(token, {
             *     currentPassword,
             *     newPassword,
             * });
             */

            toast.success(
                "Password validation completed. Connect the password API to save the change."
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error(error);

            toast.error(
                "Unable to change password."
            );
        } finally {
            setChangingPassword(false);
        }
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
                        Loading settings...
                    </p>

                </div>

            </main>
        );
    }

    return (
        <main className="min-h-full bg-slate-50">

            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

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
                        Settings
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage your QuickTxn account and
                        security preferences.
                    </p>

                </motion.div>

                <div className="space-y-6">

                    {/* =========================
                        PROFILE INFORMATION
                    ========================= */}

                    <motion.section
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                    >

                        <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                <User size={24} />
                            </div>

                            <div>

                                <h2 className="text-xl font-bold text-slate-900">
                                    Personal Information
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Update your basic account
                                    information.
                                </p>

                            </div>

                        </div>

                        <form
                            onSubmit={
                                handleSaveProfile
                            }
                            className="mt-7"
                        >

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                {/* FULL NAME */}

                                <div>

                                    <label
                                        htmlFor="fullName"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Full Name
                                    </label>

                                    <div className="relative">

                                        <User
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="fullName"
                                            value={fullName}
                                            onChange={(e) =>
                                                setFullName(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-300 py-3.5 pl-11 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                            placeholder="Your full name"
                                            required
                                        />

                                    </div>

                                </div>

                                {/* EMAIL */}

                                <div>

                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Email Address
                                    </label>

                                    <div className="relative">

                                        <Mail
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="email"
                                            type="email"
                                            value={
                                                profile?.email ||
                                                ""
                                            }
                                            disabled
                                            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3.5 pl-11 pr-4 text-slate-500 outline-none"
                                        />

                                    </div>

                                    <p className="mt-2 text-xs text-slate-400">
                                        Email address cannot be
                                        changed here.
                                    </p>

                                </div>

                                {/* PHONE */}

                                <div>

                                    <label
                                        htmlFor="phone"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Phone Number
                                    </label>

                                    <div className="relative">

                                        <Phone
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="phone"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-300 py-3.5 pl-11 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                            placeholder="08012345678"
                                            required
                                        />

                                    </div>

                                </div>

                            </div>

                            <button
                                type="submit"
                                disabled={
                                    savingProfile
                                }
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >

                                {savingProfile ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save
                                            size={18}
                                        />
                                        Save Changes
                                    </>
                                )}

                            </button>

                        </form>

                    </motion.section>

                    {/* =========================
                        CHANGE PASSWORD
                    ========================= */}

                    <motion.section
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.05,
                        }}
                        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                    >

                        <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <Lock size={24} />
                            </div>

                            <div>

                                <h2 className="text-xl font-bold text-slate-900">
                                    Change Password
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Keep your account protected with
                                    a strong password.
                                </p>

                            </div>

                        </div>

                        <form
                            onSubmit={
                                handleChangePassword
                            }
                            className="mt-7 space-y-5"
                        >

                            {/* CURRENT PASSWORD */}

                            <div>

                                <label
                                    htmlFor="currentPassword"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Current Password
                                </label>

                                <div className="relative">

                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="currentPassword"
                                        type={
                                            showCurrentPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={
                                            currentPassword
                                        }
                                        onChange={(e) =>
                                            setCurrentPassword(
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-300 py-3.5 pl-11 pr-12 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                        placeholder="Enter current password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowCurrentPassword(
                                                !showCurrentPassword
                                            )
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-600"
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff
                                                size={
                                                    18
                                                }
                                            />
                                        ) : (
                                            <Eye
                                                size={
                                                    18
                                                }
                                            />
                                        )}
                                    </button>

                                </div>

                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                {/* NEW PASSWORD */}

                                <div>

                                    <label
                                        htmlFor="newPassword"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        New Password
                                    </label>

                                    <div className="relative">

                                        <Lock
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="newPassword"
                                            type={
                                                showNewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                newPassword
                                            }
                                            onChange={(e) =>
                                                setNewPassword(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-300 py-3.5 pl-11 pr-12 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                            placeholder="Enter new password"
                                            required
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowNewPassword(
                                                    !showNewPassword
                                                )
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-600"
                                        >
                                            {showNewPassword ? (
                                                <EyeOff
                                                    size={
                                                        18
                                                    }
                                                />
                                            ) : (
                                                <Eye
                                                    size={
                                                        18
                                                    }
                                                />
                                            )}
                                        </button>

                                    </div>

                                </div>

                                {/* CONFIRM PASSWORD */}

                                <div>

                                    <label
                                        htmlFor="confirmPassword"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        Confirm New Password
                                    </label>

                                    <div className="relative">

                                        <Lock
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            id="confirmPassword"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                confirmPassword
                                            }
                                            onChange={(e) =>
                                                setConfirmPassword(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-300 py-3.5 pl-11 pr-12 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                            placeholder="Confirm new password"
                                            required
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-600"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff
                                                    size={
                                                        18
                                                    }
                                                />
                                            ) : (
                                                <Eye
                                                    size={
                                                        18
                                                    }
                                                />
                                            )}
                                        </button>

                                    </div>

                                </div>

                            </div>

                            <button
                                type="submit"
                                disabled={
                                    changingPassword
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >

                                {changingPassword ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Lock
                                            size={18}
                                        />
                                        Change Password
                                    </>
                                )}

                            </button>

                        </form>

                    </motion.section>

                    {/* =========================
                        NOTIFICATIONS
                    ========================= */}

                    <motion.section
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

                        <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                                <Bell size={24} />
                            </div>

                            <div>

                                <h2 className="text-xl font-bold text-slate-900">
                                    Notifications
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Choose how QuickTxn keeps you
                                    informed.
                                </p>

                            </div>

                        </div>

                        <div className="mt-7 divide-y divide-slate-100">

                            {/* EMAIL */}

                            <div className="flex items-center justify-between gap-5 py-5">

                                <div>

                                    <p className="font-semibold text-slate-900">
                                        Email Notifications
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Receive important account
                                        updates by email.
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEmailNotifications(
                                            !emailNotifications
                                        )
                                    }
                                    aria-pressed={
                                        emailNotifications
                                    }
                                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${emailNotifications
                                            ? "bg-green-600"
                                            : "bg-slate-300"
                                        }`}
                                >

                                    <span
                                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${emailNotifications
                                                ? "left-6"
                                                : "left-1"
                                            }`}
                                    />

                                </button>

                            </div>

                            {/* TRANSACTIONS */}

                            <div className="flex items-center justify-between gap-5 py-5">

                                <div>

                                    <p className="font-semibold text-slate-900">
                                        Transaction Notifications
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Get notified about wallet
                                        activity and transfers.
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setTransactionNotifications(
                                            !transactionNotifications
                                        )
                                    }
                                    aria-pressed={
                                        transactionNotifications
                                    }
                                    className={`relative h-7 w-12 shrink-0 rounded-full transition ${transactionNotifications
                                            ? "bg-green-600"
                                            : "bg-slate-300"
                                        }`}
                                >

                                    <span
                                        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${transactionNotifications
                                                ? "left-6"
                                                : "left-1"
                                            }`}
                                    />

                                </button>

                            </div>

                        </div>

                    </motion.section>

                    {/* =========================
                        SECURITY
                    ========================= */}

                    <motion.section
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
                        className="rounded-3xl border border-slate-200 bg-white shadow-sm"
                    >

                        <button
                            type="button"
                            onClick={() =>
                                router.push(
                                    "/settings/pin"
                                )
                            }
                            className="flex w-full items-center justify-between gap-4 p-6 text-left transition hover:bg-slate-50 sm:p-8"
                        >

                            <div className="flex items-center gap-4">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                    <ShieldCheck
                                        size={24}
                                    />
                                </div>

                                <div>

                                    <h2 className="font-bold text-slate-900">
                                        Transaction PIN
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Create or change your
                                        transaction PIN.
                                    </p>

                                </div>

                            </div>

                            <ChevronRight
                                size={22}
                                className="shrink-0 text-slate-400"
                            />

                        </button>

                    </motion.section>

                    {/* SECURITY NOTICE */}

                    <div className="rounded-3xl bg-gradient-to-r from-green-700 to-emerald-500 p-6 text-white shadow-lg sm:p-7">

                        <div className="flex items-start gap-4">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">

                                <CheckCircle2
                                    size={22}
                                />

                            </div>

                            <div>

                                <h3 className="font-bold">
                                    Your security matters
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-green-50">
                                    Never share your password,
                                    OTP or transaction PIN with
                                    anyone, including someone claiming
                                    to represent QuickTxn.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
}