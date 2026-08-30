
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    GraduationCap,
    CheckCircle2,
    Hash,
    Calendar,
    Lock,
    Wallet,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const exams = [
    { id: "waec", name: "WAEC" },
    { id: "neco", name: "NECO" },
];

const years = ["2026", "2025", "2024", "2023"];

export default function WaecPage() {
    const router = useRouter();

    const [exam, setExam] = useState("waec");
    const [examNumber, setExamNumber] = useState("");
    const [examYear, setExamYear] = useState("2026");
    const [cards, setCards] = useState("1");
    const [pin, setPin] = useState("");

    const cardPrice = 3500;
    const totalAmount = Number(cards) * cardPrice;

    const continueCheck = () => {
        if (!examNumber || examNumber.length < 10) {
            toast.error("Enter a valid exam number");
            return;
        }

        if (pin.length !== 4) {
            toast.error("Enter your 4-digit PIN");
            return;
        }

        sessionStorage.setItem(
            "waec",
            JSON.stringify({
                exam,
                examNumber,
                examYear,
                cards,
                amount: totalAmount,
                pin,
            })
        );

        router.push("/waec/confirm");
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-5xl px-4 py-5 pb-24">
                <button
                    onClick={() => router.back()}
                    className="mb-4 flex items-center gap-2 text-gray-600"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg"
                >
                    <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-white/20 p-3">
                            <GraduationCap size={30} />
                        </div>

                        <div>
                            <p className="text-sm text-blue-100">
                                Check Examination Results
                            </p>
                            <h1 className="text-2xl font-bold">
                                WAEC & NECO Result Checker
                            </h1>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                    {/* Left */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="rounded-3xl bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold">
                                Candidate Details
                            </h2>

                            {/* Exam Type */}
                            <div className="mt-6">
                                <label className="mb-3 block text-sm font-semibold text-gray-700">
                                    Examination
                                </label>

                                <div className="grid grid-cols-2 gap-3">
                                    {exams.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => setExam(item.id)}
                                            className={`rounded-xl border-2 p-4 transition ${exam === item.id
                                                    ? "border-blue-600 bg-blue-50"
                                                    : "border-gray-200 hover:border-blue-300"
                                                }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                <GraduationCap
                                                    size={28}
                                                    className={
                                                        exam === item.id
                                                            ? "text-blue-600"
                                                            : "text-gray-500"
                                                    }
                                                />

                                                <p className="mt-2 font-bold">
                                                    {item.name}
                                                </p>

                                                {exam === item.id && (
                                                    <CheckCircle2
                                                        size={18}
                                                        className="mt-1 text-blue-600"
                                                    />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Exam Number */}
                            <div className="mt-6">
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Examination Number
                                </label>

                                <div className="relative">
                                    <Hash
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        value={examNumber}
                                        placeholder="412345678901"
                                        onChange={(e) =>
                                            setExamNumber(
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                        className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 outline-none focus:border-blue-600"
                                    />
                                </div>
                            </div>

                            {/* Year & Cards */}
                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Exam Year
                                    </label>

                                    <div className="relative">
                                        <Calendar
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <select
                                            value={examYear}
                                            onChange={(e) =>
                                                setExamYear(e.target.value)
                                            }
                                            className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 outline-none focus:border-blue-600"
                                        >
                                            {years.map((year) => (
                                                <option key={year}>
                                                    {year}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Number of Cards
                                    </label>

                                    <select
                                        value={cards}
                                        onChange={(e) =>
                                            setCards(e.target.value)
                                        }
                                        className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 outline-none focus:border-blue-600"
                                    >
                                        {[1, 2, 3, 4, 5].map((n) => (
                                            <option key={n} value={n}>
                                                {n} Card{n > 1 && "s"}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* PIN */}
                            <div className="mt-6">
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Transaction PIN
                                </label>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="password"
                                        value={pin}
                                        maxLength={4}
                                        inputMode="numeric"
                                        placeholder="****"
                                        onChange={(e) =>
                                            setPin(
                                                e.target.value.replace(/\D/g, "")
                                            )
                                        }
                                        className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-lg tracking-[0.4em] outline-none focus:border-blue-600"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={continueCheck}
                                className="mt-7 flex h-14 w-full items-center justify-center rounded-2xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700"
                            >
                                Continue
                            </button>
                        </div>
                    </motion.div>

                    {/* Right */}
                    <motion.div
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-5"
                    >
                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <h3 className="mb-4 font-bold">
                                Payment Summary
                            </h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Exam
                                    </span>
                                    <span className="font-semibold uppercase">
                                        {exam}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Year
                                    </span>
                                    <span className="font-semibold">
                                        {examYear}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Cards
                                    </span>
                                    <span className="font-semibold">
                                        {cards}
                                    </span>
                                </div>

                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            Total
                                        </span>

                                        <span className="text-xl font-bold text-blue-700">
                                            ₦
                                            {totalAmount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 p-5 text-white">
                            <div className="flex items-center gap-2">
                                <Wallet size={22} />
                                <h3 className="text-lg font-bold">
                                    Why QuickTxn?
                                </h3>
                            </div>

                            <div className="mt-4 space-y-3 text-sm">
                                <div>🎓 Genuine result checker</div>
                                <div>⚡ Instant PIN delivery</div>
                                <div>🔒 Secure payment</div>
                                <div>📩 Digital receipt included</div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <h3 className="mb-3 font-bold">
                                Quick Tips
                            </h3>

                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>• Enter the correct exam number.</li>
                                <li>• Select the correct examination year.</li>
                                <li>• Result PIN is delivered instantly.</li>
                                <li>• One card can be used multiple times.</li>
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}