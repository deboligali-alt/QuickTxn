"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
    ArrowLeft,
    User,
    Shield,
    Moon,
    BadgeCheck,
    Info,
    ChevronRight,
    LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface UserData {
    full_name: string;
    email: string;
    phone: string;
}

export default function SettingsPage() {
    const router = useRouter();

    const [user, setUser] = useState<UserData>({
        full_name: "",
        email: "",
        phone: "",
    });

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get("/auth/profile");
                setUser(res.data.user);
            } catch (err) {
                console.error(err);
            }
        };

        loadProfile();

        const theme = localStorage.getItem("theme");
        setDarkMode(theme === "dark");
    }, []);

    const toggleDarkMode = () => {
        const next = !darkMode;
        setDarkMode(next);

        if (next) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        sessionStorage.clear();
        toast.success("Logged out successfully");
        router.replace("/login");
    };

    const Item = ({
        icon,
        title,
        subtitle,
        onClick,
        right,
    }: {
        icon: React.ReactNode;
        title: string;
        subtitle: string;
        onClick?: () => void;
        right?: React.ReactNode;
    }) => (
        <button
            onClick={onClick}
            className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm transition hover:shadow-md"
        >
            <div className="rounded-xl bg-green-50 p-3 text-green-600">
                {icon}
            </div>

            <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                    {title}
                </h3>
                <p className="text-xs text-gray-500">
                    {subtitle}
                </p>
            </div>

            {right || <ChevronRight size={18} color="#9CA3AF" />}
        </button>
    );

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
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">
                            {user.full_name
                                ? user.full_name.charAt(0).toUpperCase()
                                : "Q"}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold">
                                {user.full_name || "QuickTxn User"}
                            </h2>
                            <p className="text-sm text-green-100">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Menu */}
                <div className="mt-5 space-y-3">
                    <Item
                        icon={<User size={22} />}
                        title="My Profile"
                        subtitle="Edit name, email & phone"
                        onClick={() => router.push("/profile")}
                    />

                    <Item
                        icon={<Shield size={22} />}
                        title="Security"
                        subtitle="Password & Transaction PIN"
                        onClick={() => router.push("/settings/security")}
                    />

                    <Item
                        icon={<Moon size={22} />}
                        title="Dark Mode"
                        subtitle="Switch app appearance"
                        right={
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleDarkMode();
                                }}
                                className={`relative h-7 w-12 rounded-full transition ${darkMode ? "bg-green-600" : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${darkMode ? "left-6" : "left-1"
                                        }`}
                                />
                            </button>
                        }
                    />

                    <Item
                        icon={<BadgeCheck size={22} />}
                        title="KYC Verification"
                        subtitle="Verify your identity"
                        onClick={() => router.push("/kyc")}
                    />

                    <Item
                        icon={<Info size={22} />}
                        title="About QuickTxn"
                        subtitle="Privacy, support & version"
                        onClick={() => router.push("/about")}
                    />

                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm"
                    >
                        <div className="rounded-xl bg-red-50 p-3 text-red-600">
                            <LogOut size={22} />
                        </div>

                        <div>
                            <h3 className="font-semibold text-red-600">
                                Logout
                            </h3>
                            <p className="text-xs text-gray-500">
                                Securely sign out of your account
                            </p>
                        </div>
                    </button>
                </div>
            </div>
        </main>
    );
}