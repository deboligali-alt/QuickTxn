"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    CreditCard,
    Shield,
} from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const loadProfile = async () => {
            const res = await api.get("/user/profile");
            setUser(res.data.data);
        };

        loadProfile();
    }, []);

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto w-full max-w-4xl px-4 py-5 sm:px-6 lg:px-8">
                <button
                    onClick={() => router.back()}
                    className="mb-5 flex items-center gap-2 text-gray-700"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <h1 className="mb-6 text-3xl font-bold">My Profile</h1>

                <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <User size={40} />
                        </div>

                        <h2 className="mt-4 text-2xl font-bold">
                            {user?.full_name}
                        </h2>

                        <p className="text-gray-500">
                            QuickTxn User
                        </p>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl border p-4">
                            <div className="mb-2 flex items-center gap-2 text-green-600">
                                <Mail size={18} />
                                <span className="text-sm font-medium">
                                    Email
                                </span>
                            </div>
                            <p className="font-semibold">{user?.email}</p>
                        </div>

                        <div className="rounded-xl border p-4">
                            <div className="mb-2 flex items-center gap-2 text-green-600">
                                <Phone size={18} />
                                <span className="text-sm font-medium">
                                    Phone
                                </span>
                            </div>
                            <p className="font-semibold">{user?.phone}</p>
                        </div>

                        <div className="rounded-xl border p-4">
                            <div className="mb-2 flex items-center gap-2 text-green-600">
                                <CreditCard size={18} />
                                <span className="text-sm font-medium">
                                    User ID
                                </span>
                            </div>
                            <p className="font-semibold">{user?.id}</p>
                        </div>

                        <div className="rounded-xl border p-4">
                            <div className="mb-2 flex items-center gap-2 text-green-600">
                                <Shield size={18} />
                                <span className="text-sm font-medium">
                                    Status
                                </span>
                            </div>
                            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                                Verified
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}