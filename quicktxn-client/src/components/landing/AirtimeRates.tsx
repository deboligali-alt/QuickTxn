"use client";

import { motion } from "framer-motion";
import {
    RefreshCcw,
    Zap,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";

import {
    fadeUp,
    staggerContainer,
} from "@/animations/motion";

const fadeUpVariants: any = fadeUp;

const airtimeRates = [
    {
        network: "MTN",
        rate: 95,
        color: "bg-yellow-400",
        textColor: "text-yellow-700",
    },
    {
        network: "Airtel",
        rate: 93,
        color: "bg-red-600",
        textColor: "text-red-600",
    },
    {
        network: "Glo",
        rate: 90,
        color: "bg-green-600",
        textColor: "text-green-600",
    },
    {
        network: "9mobile",
        rate: 91,
        color: "bg-emerald-500",
        textColor: "text-emerald-600",
    },
];

export default function AirtimeRates() {
    return (
        <section
            id="airtime-swap"
            className="bg-white py-20 sm:py-24 lg:py-28"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* ============================= */}
                {/* HEADING */}
                {/* ============================= */}

                <motion.div
                    variants={fadeUpVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                    className="mx-auto mb-14 max-w-3xl text-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

                        <RefreshCcw size={16} />

                        AIRTIME SWAP

                    </span>

                    <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">

                        Turn Airtime Into Cash

                    </h2>

                    <p className="mt-6 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">

                        Convert your unused airtime into cash with
                        competitive rates and reliable processing.

                    </p>
                </motion.div>

                {/* ============================= */}
                {/* RATE CARDS */}
                {/* ============================= */}

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.15,
                    }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                >

                    {airtimeRates.map((network) => (

                        <motion.div
                            key={network.network}
                            variants={fadeUpVariants}
                            whileHover={{
                                y: -8,
                            }}
                            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-green-200 hover:shadow-2xl sm:p-7"
                        >

                            {/* Network Header */}

                            <div className="flex items-center justify-between">

                                <div
                                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${network.color} text-xl font-extrabold text-white shadow-sm`}
                                >
                                    {network.network === "9mobile"
                                        ? "9"
                                        : network.network.charAt(0)}
                                </div>

                                <div className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">

                                    <CheckCircle2 size={14} />

                                    Active

                                </div>

                            </div>

                            {/* Network Name */}

                            <h3 className="mt-7 text-xl font-bold text-slate-900">

                                {network.network}

                            </h3>

                            <p className="mt-1 text-sm text-slate-500">

                                Airtime exchange rate

                            </p>

                            {/* Rate */}

                            <div className="mt-6">

                                <span
                                    className={`text-5xl font-extrabold ${network.textColor}`}
                                >
                                    {network.rate}%
                                </span>

                            </div>

                            {/* Example */}

                            <div className="mt-6 rounded-2xl bg-slate-50 p-4">

                                <p className="text-xs text-slate-500">

                                    For ₦1,000 airtime

                                </p>

                                <p className="mt-1 text-xl font-bold text-slate-900">

                                    ₦
                                    {(
                                        network.rate * 10
                                    ).toLocaleString()}

                                </p>

                                <p className="mt-1 text-xs text-slate-500">

                                    Estimated amount received

                                </p>

                            </div>

                            {/* Instant Payment */}

                            <div className="mt-5 flex items-center gap-2 text-sm text-slate-600">

                                <Zap
                                    size={16}
                                    className="text-green-600"
                                />

                                Instant processing

                            </div>

                            {/* Button */}

                            <motion.a
                                href="/dashboard/airtime-swap"
                                whileHover={{
                                    scale: 1.03,
                                }}
                                whileTap={{
                                    scale: 0.97,
                                }}
                                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3.5 font-semibold text-white transition-colors hover:bg-green-700"
                            >

                                Swap Airtime

                                <ArrowRight size={17} />

                            </motion.a>

                        </motion.div>

                    ))}

                </motion.div>

                {/* ============================= */}
                {/* BOTTOM NOTE */}
                {/* ============================= */}

                <motion.div
                    variants={fadeUpVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                    className="mx-auto mt-10 flex max-w-2xl items-start gap-3 rounded-2xl border border-green-100 bg-green-50 p-5"
                >

                    <CheckCircle2
                        size={21}
                        className="mt-0.5 shrink-0 text-green-600"
                    />

                    <p className="text-sm leading-6 text-slate-600">

                        Rates may change based on current market and
                        service conditions. The final amount will be
                        displayed before you confirm your transaction.

                    </p>

                </motion.div>

            </div>
        </section>
    );
}