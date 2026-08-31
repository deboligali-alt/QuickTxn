"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react";

export default function PasswordPage() {
    const router = useRouter();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);

    const changePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            return alert("Complete all fields");
        }

        if (newPassword !== confirmPassword) {
            return alert("Passwords do not match");
        }

        if (newPassword.length < 6) {
            return alert("Password must be at least 6 characters");
        }

        try {
            setLoading(true);

            await api.patch("/user/change-password", {
                currentPassword,
                newPassword,
            });

            alert("Password changed successfully");

            router.back();
        } catch (err: any) {
            alert(
                err.response?.data?.message || "Unable to change password"
            );
        } finally {
            setLoading(false);
        }
    };

    const PasswordInput = ({
        value,
        setValue,
        show,
        setShow,
        placeholder,
    }: any) => (
        <div className="relative">
            <input
                type={show ? "text" : "password"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border p-3 pr-12 outline-none focus:border-green-500"
            />

            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-3 text-gray-500"
            >
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
    );

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-md p-4 pb-24">
                <button
                    onClick={() => router.back()}
                    className="mb-4 flex items-center gap-2 text-gray-700"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <Lock size={30} />
                        <div>
                            <p className="text-sm text-green-100">Account Security</p>
                            <h1 className="text-2xl font-bold">Change Password</h1>
                        </div>
                    </div>
                </div>

                <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-lg font-bold">Update Login Password</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Current Password
                            </label>

                            <PasswordInput
                                value={currentPassword}
                                setValue={setCurrentPassword}
                                show={showCurrent}
                                setShow={setShowCurrent}
                                placeholder="Enter current password"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                New Password
                            </label>

                            <PasswordInput
                                value={newPassword}
                                setValue={setNewPassword}
                                show={showNew}
                                setShow={setShowNew}
                                placeholder="Enter new password"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Confirm Password
                            </label>

                            <PasswordInput
                                value={confirmPassword}
                                setValue={setConfirmPassword}
                                show={showConfirm}
                                setShow={setShowConfirm}
                                placeholder="Confirm new password"
                            />
                        </div>
                    </div>

                    <button
                        onClick={changePassword}
                        disabled={loading}
                        className="mt-6 w-full rounded-xl bg-green-600 py-4 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                    >
                        {loading ? "Updating..." : "Change Password"}
                    </button>
                </div>
            </div>
        </main>
    );
}