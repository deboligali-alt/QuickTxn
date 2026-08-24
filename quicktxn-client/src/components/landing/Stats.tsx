"use client";

import { motion, type Variants } from "framer-motion";
import {
    Users,
    CreditCard,
    Smartphone,
    Star,
    TrendingUp,
} from "lucide-react";

import {
    fadeUp,
    staggerContainer,
} from "@/animations/motion";

const fadeUpVariants = fadeUp as Variants;
const staggerVariants = staggerContainer as Variants;

const statistics = [
    {
        value: "10K+",
        label: "Registered Users",
        description: "Customers using QuickTxn",
        icon: Users,
    },
    {
        value: "₦50M+",
        label: "Transactions",
        description: "Processed through our platform",
        icon: CreditCard,
    },
    {
        value: "120K+",
        label: "Services Completed",
        description: "Airtime and data transactions",
        icon: Smartphone,
    },
    {
        value: "4.9/5",
        label: "Customer Rating",
        description: "Based on customer experience",
        icon: Star,
    },
];

export default function Statistics() {
    return (
        <section
            id="statistics"
            className="relative overflow-hidden bg-slate-50 py-20 sm:py-24 lg:py-28"
        >

            {/* Background Decoration */}

            <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-green-100/70 blur-3xl" />

            <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-emerald-100/70 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

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

                    <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

                        OUR IMPACT

                    </span>

                    <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">

                        Trusted Every Day Across Nigeria

                    </h2>

                    <p className="mt-6 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">

                        Thousands of customers rely on QuickTxn
                        for fast, secure and reliable digital
                        transactions.

                    </p>

                </motion.div>

                {/* ============================= */}
                {/* STATISTICS */}
                {/* ============================= */}

                <motion.div
                    variants={staggerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.15,
                    }}
                    className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
                >

                    {statistics.map((stat) => {

                        const Icon = stat.icon;

                        return (
                            <motion.div
                                key={stat.label}
                                variants={fadeUpVariants}
                                whileHover={{
                                    y: -8,
                                }}
                                className="group rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-sm transition-all duration-300 hover:border-green-200 hover:shadow-xl sm:p-8"
                            >

                                {/* Icon */}

                                <motion.div
                                    whileHover={{
                                        scale: 1.08,
                                        rotate: 3,
                                    }}
                                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600 transition-colors duration-300 group-hover:bg-green-600 group-hover:text-white"
                                >

                                    <Icon size={27} />

                                </motion.div>

                                {/* Number */}

                                <h3 className="mt-7 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">

                                    {stat.value}

                                </h3>

                                {/* Label */}

                                <p className="mt-2 font-semibold text-slate-900">

                                    {stat.label}

                                </p>

                                {/* Description */}

                                <p className="mt-2 text-sm leading-6 text-slate-500">

                                    {stat.description}

                                </p>

                            </motion.div>
                        );
                    })}

                </motion.div>

                {/* ============================= */}
                {/* BOTTOM TRUST BAR */}
                {/* ============================= */}

                <motion.div
                    variants={fadeUpVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                    className="mx-auto mt-12 flex max-w-3xl flex-col items-center justify-center gap-3 rounded-2xl border border-green-100 bg-green-50 px-6 py-5 text-center sm:flex-row"
                >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">

                        <TrendingUp
                            size={20}
                            className="text-green-600"
                        />

                    </div>

                    <div>

                        <p className="text-sm font-bold text-slate-900">

                            Growing every day

                        </p>

                        <p className="mt-1 text-xs text-slate-600 sm:text-sm">

                            QuickTxn continues to make digital transactions
                            simpler and more accessible.

                        </p>

                    </div>

                </motion.div>

            </div>

        </section>
    );
}