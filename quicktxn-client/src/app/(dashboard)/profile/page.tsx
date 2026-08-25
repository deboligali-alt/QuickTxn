"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    User,
    Mail,
    Phone,
    ShieldCheck,
    ChevronRight,
} from "lucide-react";

interface Profile {
    full_name: string;
    email: string;
    phone: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<Profile | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setUser(res.data.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProfile();
    }, []);

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4 pb-24">
            <h1 className="mb-6 text-2xl font-bold">My Profile</h1>

            <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-600 p-6 text-white">
                <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold">
                        {user?.full_name?.charAt(0) || "A"}
                    </div>

                    <div>
                        <h2 className="text-xl font-bold">
                            {user?.full_name || "Loading..."}
                        </h2>

                        <p className="text-green-100">
                            QuickTxn User
                        </p>

                        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs">
                            <ShieldCheck size={14} />
                            KYC Verified
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <User className="text-green-600" size={20} />
                        <div>
                            <p className="text-xs text-gray-500">
                                Full Name
                            </p>
                            <p className="font-medium">
                                {user?.full_name}
                            </p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Mail className="text-green-600" size={20} />
                        <div>
                            <p className="text-xs text-gray-500">
                                Email
                            </p>
                            <p className="font-medium">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                        <Phone className="text-green-600" size={20} />
                        <div>
                            <p className="text-xs text-gray-500">
                                Phone Number
                            </p>
                            <p className="font-medium">
                                {user?.phone || "Not Added"}
                            </p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                </div>
            </div>
        </main>
    );
}