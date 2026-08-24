"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
    ArrowLeft,
    Eye,
    EyeOff,
    Lock,
    ShieldCheck,
    CheckCircle2,
    Loader2,
    KeyRound,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import {
    createPin,
    changePin,
} from "@/services/pin.service";

type Mode = "create" | "change";

export default function TransactionPinPage() {
    const router = useRouter();

    const [mode, setMode] =
        useState<Mode>("create");

    const [currentPin, setCurrentPin] =
        useState("");

    const [newPin, setNewPin] =
        useState("");

    const [confirmPin, setConfirmPin] =
        useState("");

    const [showCurrentPin, setShowCurrentPin] =
        useState(false);

    const [showNewPin, setShowNewPin] =
        useState(false);

    const [showConfirmPin, setShowConfirmPin] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [hasPin, setHasPin] =
        useState<boolean | null>(null);

    useEffect(() => {
        const token =
            localStorage.getItem("token");

        if (!token) {
            router.replace("/login");
            return;
        }

        /*
         * We don't currently have a confirmed
         * "check PIN exists" endpoint in the
         * frontend services.
         *
         * Default to create mode. If the backend
         * says a PIN already exists, the user can
         * switch to Change PIN.
         */
        setHasPin(false);
    }, [router]);

    const validatePin = (
        pin: string
    ) => {
        return /^\d{4}$/.test(pin);
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const token =
            localStorage.getItem("token");

        if (!token) {
            router.replace("/login");
            return;
        }

        if (!validatePin(newPin)) {
            toast.error(
                "Transaction PIN must contain exactly 4 digits."
            );
            return;
        }

        if (newPin !== confirmPin) {
            toast.error(
                "Transaction PINs do not match."
            );
            return;
        }

        if (
            mode === "change" &&
            !validatePin(currentPin)
        ) {
            toast.error(
                "Enter your current 4-digit PIN."
            );
            return;
        }

        try {
            setLoading(true);

            if (mode === "create") {
                await createPin(
                    token,
                    newPin
                );

                toast.success(
                    "Transaction PIN created successfully."
                );

                setHasPin(true);
            } else {
                await changePin(
                    token,
                    currentPin,
                    newPin
                );

                toast.success(
                    "Transaction PIN changed successfully."
                );
            }

            setCurrentPin("");
            setNewPin("");
            setConfirmPin("");
        } catch (error: unknown) {
            console.error(error);

            if (
                axios.isAxiosError(error)
            ) {
                toast.error(
                    error.response?.data
                        ?.message ||
                    "Unable to update transaction PIN."
                );
            } else {
                toast.error(
                    "Unable to update transaction PIN."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const PinInput = ({
        value,
        onChange,
        placeholder,
        show,
        onToggle,
        label,
    }: {
        value: string;
        onChange: (
            value: string
        ) => void;
        placeholder: string;
        show: boolean;
        onToggle: () => void;
        label: string;
    }) => {
        return (
            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {label}
                </label>

                <div className="relative">

                    <Lock
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type={
                            show
                                ? "text"
                                : "password"
                        }
                        inputMode="numeric"
                        maxLength={4}
                        value={value}
                        placeholder={placeholder}
                        onChange={(e) =>
                            onChange(
                                e.target.value.replace(
                                    /\D/g,
                                    ""
                                )
                            )
                        }
                        className="w-full rounded-xl border border-slate-300 py-4 pl-12 pr-12 text-lg tracking-[0.6em] outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        required
                    />

                    <button
                        type="button"
                        onClick={onToggle}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-green-600"
                    >
                        {show ? (
                            <EyeOff size={19} />
                        ) : (
                            <Eye size={19} />
                        )}
                    </button>

                </div>
            </div>
        );
    };

    return (
        <main className="min-h-full bg-slate-50">

            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">

                {/* BACK */}

                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-green-600"
                >
                    <ArrowLeft size={17} />
                    Back
                </button>

                {/* HEADER */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="mb-8"
                >

                    <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                            <KeyRound size={28} />
                        </div>

                        <div>

                            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                                Transaction PIN
                            </h1>

                            <p className="mt-1 text-sm text-slate-500 sm:text-base">
                                Secure your transfers and
                                financial transactions.
                            </p>

                        </div>

                    </div>

                </motion.div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* MAIN CARD */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        className="lg:col-span-2"
                    >

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

                            {/* TABS */}

                            <div className="mb-8 grid grid-cols-2 rounded-xl bg-slate-100 p-1">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMode(
                                            "create"
                                        )
                                    }
                                    className={`rounded-lg py-3 text-sm font-semibold transition ${mode ===
                                            "create"
                                            ? "bg-white text-green-600 shadow-sm"
                                            : "text-slate-500 hover:text-slate-800"
                                        }`}
                                >
                                    Create PIN
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setMode(
                                            "change"
                                        )
                                    }
                                    className={`rounded-lg py-3 text-sm font-semibold transition ${mode ===
                                            "change"
                                            ? "bg-white text-green-600 shadow-sm"
                                            : "text-slate-500 hover:text-slate-800"
                                        }`}
                                >
                                    Change PIN
                                </button>

                            </div>

                            {/* TITLE */}

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                    <ShieldCheck
                                        size={23}
                                    />
                                </div>

                                <div>

                                    <h2 className="text-xl font-bold text-slate-900">
                                        {mode ===
                                            "create"
                                            ? "Create Transaction PIN"
                                            : "Change Transaction PIN"}
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {mode ===
                                            "create"
                                            ? "Create a 4-digit PIN for securing your transactions."
                                            : "Enter your current PIN and choose a new one."}
                                    </p>

                                </div>

                            </div>

                            {/* FORM */}

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                className="mt-8 space-y-6"
                            >

                                {/* CURRENT PIN */}

                                {mode ===
                                    "change" && (
                                        <PinInput
                                            label="Current Transaction PIN"
                                            value={
                                                currentPin
                                            }
                                            onChange={
                                                setCurrentPin
                                            }
                                            placeholder="••••"
                                            show={
                                                showCurrentPin
                                            }
                                            onToggle={() =>
                                                setShowCurrentPin(
                                                    !showCurrentPin
                                                )
                                            }
                                        />
                                    )}

                                {/* NEW PIN */}

                                <PinInput
                                    label={
                                        mode ===
                                            "create"
                                            ? "Transaction PIN"
                                            : "New Transaction PIN"
                                    }
                                    value={
                                        newPin
                                    }
                                    onChange={
                                        setNewPin
                                    }
                                    placeholder="••••"
                                    show={
                                        showNewPin
                                    }
                                    onToggle={() =>
                                        setShowNewPin(
                                            !showNewPin
                                        )
                                    }
                                />

                                {/* CONFIRM */}

                                <PinInput
                                    label="Confirm Transaction PIN"
                                    value={
                                        confirmPin
                                    }
                                    onChange={
                                        setConfirmPin
                                    }
                                    placeholder="••••"
                                    show={
                                        showConfirmPin
                                    }
                                    onToggle={() =>
                                        setShowConfirmPin(
                                            !showConfirmPin
                                        )
                                    }
                                />

                                {/* PIN INDICATOR */}

                                <div className="rounded-2xl bg-slate-50 p-5">

                                    <p className="text-sm font-semibold text-slate-700">
                                        PIN requirements
                                    </p>

                                    <div className="mt-3 space-y-2">

                                        <div className="flex items-center gap-2 text-sm">

                                            <CheckCircle2
                                                size={16}
                                                className={
                                                    /^\d{4}$/.test(
                                                        newPin
                                                    )
                                                        ? "text-green-600"
                                                        : "text-slate-300"
                                                }
                                            />

                                            <span className={
                                                /^\d{4}$/.test(
                                                    newPin
                                                )
                                                    ? "text-green-700"
                                                    : "text-slate-500"
                                            }>
                                                Exactly 4 digits
                                            </span>

                                        </div>

                                        <div className="flex items-center gap-2 text-sm">

                                            <CheckCircle2
                                                size={16}
                                                className={
                                                    newPin.length >
                                                        0 &&
                                                        newPin ===
                                                        confirmPin
                                                        ? "text-green-600"
                                                        : "text-slate-300"
                                                }
                                            />

                                            <span className={
                                                newPin.length >
                                                    0 &&
                                                    newPin ===
                                                    confirmPin
                                                    ? "text-green-700"
                                                    : "text-slate-500"
                                            }>
                                                PINs match
                                            </span>

                                        </div>

                                    </div>

                                </div>

                                {/* SUBMIT */}

                                <button
                                    type="submit"
                                    disabled={
                                        loading
                                    }
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                                >

                                    {loading ? (
                                        <>
                                            <Loader2
                                                size={
                                                    19
                                                }
                                                className="animate-spin"
                                            />

                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Lock
                                                size={
                                                    19
                                                }
                                            />

                                            {mode ===
                                                "create"
                                                ? "Create PIN"
                                                : "Change PIN"}
                                        </>
                                    )}

                                </button>

                            </form>

                        </div>

                    </motion.div>

                    {/* SIDE */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 20,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            delay: 0.1,
                        }}
                        className="space-y-5"
                    >

                        {/* SECURITY CARD */}

                        <div className="rounded-3xl bg-gradient-to-br from-green-700 to-emerald-500 p-6 text-white shadow-lg">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">

                                <ShieldCheck
                                    size={25}
                                />

                            </div>

                            <h2 className="mt-5 text-xl font-bold">
                                Transaction Security
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-green-50">
                                Your transaction PIN is used
                                to authorize sensitive financial
                                actions on QuickTxn.
                            </p>

                        </div>

                        {/* WHERE PIN IS USED */}

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-bold text-slate-900">
                                Your PIN protects
                            </h2>

                            <div className="mt-5 space-y-4">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-600">
                                        <Lock size={17} />
                                    </div>

                                    <p className="text-sm font-medium text-slate-700">
                                        Bank transfers
                                    </p>

                                </div>

                                <div className="flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-600">
                                        <Lock size={17} />
                                    </div>

                                    <p className="text-sm font-medium text-slate-700">
                                        Wallet transactions
                                    </p>

                                </div>

                                <div className="flex items-center gap-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-600">
                                        <Lock size={17} />
                                    </div>

                                    <p className="text-sm font-medium text-slate-700">
                                        Airtime and other payments
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* WARNING */}

                        <div className="rounded-3xl border border-red-100 bg-red-50 p-6">

                            <div className="flex items-start gap-3">

                                <Lock
                                    size={21}
                                    className="mt-0.5 shrink-0 text-red-500"
                                />

                                <div>

                                    <h3 className="font-bold text-red-700">
                                        Never share your PIN
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-red-600">
                                        QuickTxn support will
                                        never ask for your
                                        transaction PIN.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </motion.div>

                </div>

            </div>

        </main>
    );
}