"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
    ArrowLeft,
    User,
    Shield,
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

    const [biometric, setBiometric] = useState(false);

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

        const enabled =
            localStorage.getItem("biometric") === "true";

        setBiometric(enabled);
    }, []);

    // REAL Fingerprint / Face ID
    const toggleBiometric = async () => {
        if (!window.PublicKeyCredential) {
            toast.error("Fingerprint or Face ID is not supported");
            return;
        }

        // Disable biometric
        if (biometric) {
            setBiometric(false);
            localStorage.removeItem("biometric");
            toast.success("Biometric login disabled");
            return;
        }

        try {
            const credential = (await navigator.credentials.create({
                publicKey: {
                    challenge: crypto.getRandomValues(new Uint8Array(32)),
                    rp: {
                        name: "QuickTxn",
                    },
                    user: {
                        id: crypto.getRandomValues(new Uint8Array(16)),
                        name: user.email,
                        displayName: user.full_name,
                    },
                    pubKeyCredParams: [
                        {
                            type: "public-key",
                            alg: -7,
                        },
                    ],
                    authenticatorSelection: {
                        authenticatorAttachment: "platform",
                        userVerification: "required",
                    },
                    timeout: 60000,
                },
            })) as PublicKeyCredential;

            // Send credential to backend
            await api.post("/biometric/register", {
                credentialId: btoa(
                    String.fromCharCode(
                        ...new Uint8Array(credential.rawId)
                    )
                ),
                publicKey: "platform-authenticator",
            });

            setBiometric(true);
            localStorage.setItem("biometric", "true");

            toast.success("Fingerprint / Face ID enabled");
        } catch (err: any) {
            toast.error(
                err.response?.data?.message ||
                "Biometric setup cancelled"
            );
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("biometric");
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

            {right || (
                <ChevronRight
                    size={18}
                    color="#9CA3AF"
                />
            )}
        </button>
    );

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
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">
                            {user.full_name
                                ? user.full_name
                                    .charAt(0)
                                    .toUpperCase()
                                : "Q"}
                        </div>

                        <div>
                            <h2 className="text-xl font-bold">
                                {user.full_name ||
                                    "QuickTxn User"}
                            </h2>

                            <p className="text-sm text-green-100">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Settings */}
                <div className="mt-5 space-y-3">
                    <Item
                        icon={<User size={22} />}
                        title="My Profile"
                        subtitle="Edit your personal information"
                        onClick={() => router.push("/profile")}
                    />

                    <Item
                        icon={<Shield size={22} />}
                        title="Security"
                        subtitle="Password & Transaction PIN"
                        onClick={() =>
                            router.push("/settings/security")
                        }
                    />

                    <Item
                        icon={<Fingerprint size={22} />}
                        title="Biometric Login"
                        subtitle="Use Fingerprint or Face ID"
                        right={
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleBiometric();
                                }}
                                className={`relative h-7 w-12 rounded-full transition ${biometric
                                    ? "bg-green-600"
                                    : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${biometric
                                        ? "left-6"
                                        : "left-1"
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