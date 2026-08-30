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
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface UserProfile {
    full_name: string;
    email: string;
    phone: string;
}

export default function ProfilePage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [profile, setProfile] = useState<UserProfile>({
        full_name: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get("/auth/profile");
                setProfile(res.data.user);
            } catch {
                toast.error("Unable to load profile");
            }
        };

        loadProfile();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    const saveProfile = async () => {
        try {
            setLoading(true);

            await api.put("/auth/profile", profile);

            toast.success("Profile updated successfully");
        } catch {
            toast.error("Update failed");
        } finally {
            setLoading(false);
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

                            <button className="absolute bottom-0 right-0 rounded-full bg-white p-2 text-green-600 shadow">
                                <Camera size={16} />
                            </button>
                        </div>

                        <h1 className="mt-4 text-xl font-bold">
                            {profile.full_name || "QuickTxn User"}
                        </h1>

                        <p className="text-sm text-green-100">
                            Edit your profile information
                        </p>
                    </div>
                </motion.div>

                <div className="mt-5 space-y-4 rounded-3xl bg-white p-5 shadow-sm">
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
                                name="email"
                                type="email"
                                value={profile.email}
                                onChange={handleChange}
                                className="w-full rounded-xl border p-3 pl-11 outline-none focus:border-green-600"
                            />
                        </div>
                    </div>

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

                    <button
                        onClick={saveProfile}
                        disabled={loading}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-semibold text-white disabled:opacity-60"
                    >
                        <Save size={18} />
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </main>
    );
}