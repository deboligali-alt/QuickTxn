"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
    ArrowLeft,
    Camera,
    Save,
} from "lucide-react";

export default function EditProfilePage() {
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get("/user/profile");
                const user = res.data.data;

                setFullName(user.full_name);
                setEmail(user.email);
                setPhone(user.phone);
            } catch (err) {
                console.error(err);
            }
        };

        loadProfile();
    }, []);

    const updateProfile = async () => {
        if (!fullName || !phone) {
            return alert("Complete all fields");
        }

        try {
            setLoading(true);

            await api.patch("/user/profile", {
                fullName,
                phone,
            });

            alert("Profile updated successfully");
            router.back();
        } catch (err: any) {
            alert(
                err.response?.data?.message ||
                "Unable to update profile"
            );
        } finally {
            setLoading(false);
        }
    };

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

                {/* Header */}
                <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                    <h1 className="text-2xl font-bold">
                        Edit Profile
                    </h1>
                    <p className="text-sm text-green-100">
                        Update your personal information
                    </p>
                </div>

                {/* Avatar */}
                <div className="mt-5 rounded-3xl bg-white p-6 text-center shadow-sm">
                    <div className="relative mx-auto h-24 w-24">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-600 text-4xl font-bold text-white">
                            {fullName.charAt(0) || "Q"}
                        </div>

                        <button className="absolute bottom-0 right-0 rounded-full bg-white p-2 shadow">
                            <Camera
                                size={16}
                                className="text-green-600"
                            />
                        </button>
                    </div>

                    <p className="mt-3 font-semibold">
                        {fullName || "QuickTxn User"}
                    </p>
                    <p className="text-sm text-gray-500">
                        {email}
                    </p>
                </div>

                {/* Form */}
                <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Full Name
                            </label>

                            <input
                                value={fullName}
                                onChange={(e) =>
                                    setFullName(e.target.value)
                                }
                                className="w-full rounded-xl border p-3 outline-none focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Email Address
                            </label>

                            <input
                                readOnly
                                value={email}
                                className="w-full rounded-xl border bg-gray-100 p-3 text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Phone Number
                            </label>

                            <input
                                value={phone}
                                onChange={(e) =>
                                    setPhone(e.target.value)
                                }
                                className="w-full rounded-xl border p-3 outline-none focus:border-green-500"
                            />
                        </div>
                    </div>

                    <button
                        onClick={updateProfile}
                        disabled={loading}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-semibold text-white"
                    >
                        <Save size={18} />
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </main>
    );
}