"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
    ArrowLeft,
    Lock,
    ShieldCheck,
    Eye,
    EyeOff,
    Save,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function SecurityPage() {
    const router = useRouter();

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const [loadingPassword, setLoadingPassword] = useState(false);
    const [loadingPin, setLoadingPin] = useState(false);

    const [password, setPassword] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    const [pin, setPin] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    const changePassword = async () => {
        if (
            !password.current ||
            !password.new ||
            !password.confirm
        ) {
            return toast.error("Complete all password fields");
        }

        if (password.new !== password.confirm) {
            return toast.error("New passwords do not match");
        }

        try {
            setLoadingPassword(true);

            await api.put("/auth/change-password", password);

            toast.success("Password updated successfully");

            setPassword({
                current: "",
                new: "",
                confirm: "",
            });
        } catch (err: any) {
            toast.error(
                err.response?.data?.message ||
                "Password update failed"
            );
        } finally {
            setLoadingPassword(false);
        }
    };

    const changePin = async () => {
        if (!pin.current || !pin.new || !pin.confirm) {
            return toast.error("Complete all PIN fields");
        }

        if (pin.new.length !== 4) {
            return toast.error("PIN must be 4 digits");
        }

        if (pin.new !== pin.confirm) {
            return toast.error("PIN does not match");
        }

        try {
            setLoadingPin(true);

            await api.put("/wallet/change-pin", pin);

            toast.success("Transaction PIN updated");

            setPin({
                current: "",
                new: "",
                confirm: "",
            });
        } catch (err: any) {
            toast.error(
                err.response?.data?.message ||
                "PIN update failed"
            );
        } finally {
            setLoadingPin(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-md p-4 pb-24">
                <button
                    onClick={() => router.back()}
                    className="mb-4 flex items-center gap-2 text-gray-600"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white shadow-lg"
                >
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={34} />

                        <div>
                            <h1 className="text-2xl font-bold">
                                Security
                            </h1>
                            <p className="text-sm text-green-100">
                                Protect your QuickTxn account
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Change Password */}
                <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-lg font-bold">
                        Change Password
                    </h2>

                    <div className="space-y-3">
                        <Input
                            icon={<Lock size={18} />}
                            type={showOld ? "text" : "password"}
                            placeholder="Current Password"
                            value={password.current}
                            onChange={(v) =>
                                setPassword({
                                    ...password,
                                    current: v,
                                })
                            }
                            toggle={() => setShowOld(!showOld)}
                            visible={showOld}
                        />

                        <Input
                            icon={<Lock size={18} />}
                            type={showNew ? "text" : "password"}
                            placeholder="New Password"
                            value={password.new}
                            onChange={(v) =>
                                setPassword({
                                    ...password,
                                    new: v,
                                })
                            }
                            toggle={() => setShowNew(!showNew)}
                            visible={showNew}
                        />

                        <Input
                            icon={<Lock size={18} />}
                            type="password"
                            placeholder="Confirm Password"
                            value={password.confirm}
                            onChange={(v) =>
                                setPassword({
                                    ...password,
                                    confirm: v,
                                })
                            }
                        />

                        <button
                            onClick={changePassword}
                            disabled={loadingPassword}
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold text-white"
                        >
                            <Save size={18} />
                            {loadingPassword
                                ? "Updating..."
                                : "Update Password"}
                        </button>
                    </div>
                </div>

                {/* Change PIN */}
                <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-lg font-bold">
                        Transaction PIN
                    </h2>

                    <div className="space-y-3">
                        <input
                            maxLength={4}
                            value={pin.current}
                            onChange={(e) =>
                                setPin({
                                    ...pin,
                                    current: e.target.value.replace(/\D/g, ""),
                                })
                            }
                            placeholder="Current PIN"
                            className="w-full rounded-xl border p-3 text-center text-lg tracking-[8px] outline-none focus:border-green-600"
                        />

                        <input
                            maxLength={4}
                            value={pin.new}
                            onChange={(e) =>
                                setPin({
                                    ...pin,
                                    new: e.target.value.replace(/\D/g, ""),
                                })
                            }
                            placeholder="New PIN"
                            className="w-full rounded-xl border p-3 text-center text-lg tracking-[8px] outline-none focus:border-green-600"
                        />

                        <input
                            maxLength={4}
                            value={pin.confirm}
                            onChange={(e) =>
                                setPin({
                                    ...pin,
                                    confirm: e.target.value.replace(/\D/g, ""),
                                })
                            }
                            placeholder="Confirm PIN"
                            className="w-full rounded-xl border p-3 text-center text-lg tracking-[8px] outline-none focus:border-green-600"
                        />

                        <button
                            onClick={changePin}
                            disabled={loadingPin}
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 font-semibold text-white"
                        >
                            <ShieldCheck size={18} />
                            {loadingPin
                                ? "Updating..."
                                : "Update PIN"}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

function Input({
    icon,
    type,
    placeholder,
    value,
    onChange,
    toggle,
    visible,
}: {
    icon: React.ReactNode;
    type: string;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    toggle?: () => void;
    visible?: boolean;
}) {
    return (
        <div className="relative">
            <div className="absolute left-4 top-4 text-gray-400">
                {icon}
            </div>

            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border p-3 pl-11 pr-11 outline-none focus:border-green-600"
            />

            {toggle && (
                <button
                    type="button"
                    onClick={toggle}
                    className="absolute right-4 top-4 text-gray-400"
                >
                    {visible ? (
                        <EyeOff size={18} />
                    ) : (
                        <Eye size={18} />
                    )}
                </button>
            )}
        </div>
    );
}