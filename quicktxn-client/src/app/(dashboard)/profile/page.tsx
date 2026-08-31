"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
    ArrowLeft,
    Camera,
    User,
    Mail,
    Phone,
    Save,
    ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface UserProfile {
    full_name: string;
    email: string;
    phone: string;
    is_verified: boolean;
}

export default function EditProfilePage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [profile, setProfile] = useState<UserProfile>({
        full_name: "",
        email: "",
        phone: "",
        is_verified: false,
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get("/user/profile");

                setProfile({
                    full_name: res.data.data.full_name,
                    email: res.data.data.email,
                    phone: res.data.data.phone,
                    is_verified: res.data.data.is_verified,
                });
            } catch {
                toast.error("Unable to load profile");
            }
        };

        loadProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    const saveProfile = async () => {
        if (!profile.full_name || !profile.phone) {
            return toast.error("Complete all fields");
        }

        try {
            setLoading(true);

            await api.patch("/user/profile", {
                fullName: profile.full_name,
                phone: profile.phone,
            });

            toast.success("Profile updated successfully");
            router.back();
        } catch (err: any) {
            toast.error(
                err.response?.data?.message || "Update failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-md p-4 pb-24">
                {/* Back */}
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
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-4xl font-bold">
                                {profile.full_name
                                    ? profile.full_name.charAt(0).toUpperCase()
                                    : "Q"}
                            </div>

                            <button
                                type="button"
                                className="absolute bottom-0 right-0 rounded-full bg-white p-2 text-green-600 shadow"
                            >
                                <Camera size={16} />
                            </button>
                        </div>

                        <h1 className="mt-4 text-xl font-bold">
                            {profile.full_name || "QuickTxn User"}
                        </h1>

                        <div className="mt-2 flex items-center justify-center gap-2">
                            <p className="text-sm text-green-100">
                                {profile.email}
                            </p>

                            {profile.is_verified && (
                                <div className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-1">
                                    <ShieldCheck size={14} />
                                    <span className="text-xs font-medium">
                                        Verified
                                    </span>
                                </div>
                            )}
                        </div>

                        <p className="mt-2 text-xs text-green-100">
                            Edit your profile information
                        </p>
                    </div>
                </motion.div>

                {/* Form */}
                <div className="mt-5 space-y-4 rounded-3xl bg-white p-5 shadow-sm">
                    {/* Full Name */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Full Name
                        </label>

                        <div className="relative">
                            <User
                                size={18}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            <input
                                name="full_name"
                                value={profile.full_name}
                                onChange={handleChange}
                                className="w-full rounded-xl border p-3 pl-11 outline-none focus:border-green-600"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email Address
                        </label>

                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            <input
                                readOnly
                                value={profile.email}
                                className="w-full rounded-xl border bg-gray-100 p-3 pl-11 text-gray-500"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>

                        <div className="relative">
                            <Phone
                                size={18}
                                className="absolute left-4 top-4 text-gray-400"
                            />

                            <input
                                name="phone"
                                value={profile.phone}
                                onChange={handleChange}
                                className="w-full rounded-xl border p-3 pl-11 outline-none focus:border-green-600"
                            />
                        </div>
                    </div>

                    {/* Save */}
                    <button
                        onClick={saveProfile}
                        disabled={loading}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                    >
                        <Save size={18} />
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </main>
    );
}