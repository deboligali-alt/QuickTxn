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
    Fingerprint,
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
    const [biometric, setBiometric] = useState(false);

    // Load profile
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await api.get("/user/profile");
                setUser(res.data.data);
            } catch {
                toast.error("Unable to load profile");
            }
        };

        loadProfile();

        const savedDark = localStorage.getItem("darkMode") === "true";
        const savedBio = localStorage.getItem("biometric") === "true";

        setDarkMode(savedDark);
        setBiometric(savedBio);

        document.documentElement.classList.toggle("dark", savedDark);
    }, []);

    // Dark mode
    const toggleDarkMode = () => {
        const next = !darkMode;

        setDarkMode(next);
        localStorage.setItem("darkMode", String(next));
        document.documentElement.classList.toggle("dark", next);

        toast.success(next ? "Dark mode enabled" : "Light mode enabled");
    };

    // Biometric
    const toggleBiometric = async () => {
        if (!window.PublicKeyCredential) {
            toast.error("Biometric is not supported on this device.");
            return;
        }

        const next = !biometric;

        setBiometric(next);
        localStorage.setItem("biometric", String(next));

        toast.success(
            next
                ? "Biometric login enabled"
                : "Biometric login disabled"
        );
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
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
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-xs text-gray-500">{subtitle}</p>
            </div>

            {right || <ChevronRight size={18} color="#9CA3AF" />}
        </button>
    );

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="mx-auto max-w-md p-4 pb-24">
                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-300"
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

                            <p className="text-sm text-green-100">{user.email}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Settings */}
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
                        icon={<Fingerprint size={22} />}
                        title="Biometric Login"
                        subtitle="Use fingerprint or Face ID"
                        right={
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleBiometric();
                                }}
                                className={`relative h-7 w-12 rounded-full transition ${biometric ? "bg-green-600" : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${biometric ? "left-6" : "left-1"
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

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left shadow-sm"
                    >
                        <div className="rounded-xl bg-red-50 p-3 text-red-600">
                            <LogOut size={22} />
                        </div>

                        <div>
                            <h3 className="font-semibold text-red-600">Logout</h3>
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