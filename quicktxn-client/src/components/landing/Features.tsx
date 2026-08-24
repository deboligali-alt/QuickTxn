"use client";

import { motion } from "framer-motion";
import {
    Zap,
    RefreshCcw,
    Smartphone,
    Trophy,
    ShieldCheck,
    WalletCards,
    ArrowRight,
} from "lucide-react";

import {
    fadeUp as fadeUpAnimation,
    staggerContainer,
} from "@/animations/motion";

const fadeUp = fadeUpAnimation as any;

const features = [
    {
        title: "Instant Transactions",
        description:
            "Complete your airtime, data and wallet transactions quickly with reliable processing.",
        icon: Zap,
    },
    {
        title: "Airtime to Cash",
        description:
            "Convert unused airtime into cash securely and conveniently.",
        icon: RefreshCcw,
    },
    {
        title: "Affordable Data",
        description:
            "Purchase data plans across supported networks at competitive prices.",
        icon: Smartphone,
    },
    {
        title: "Betting Wallet",
        description:
            "Fund supported betting wallets quickly without unnecessary delays.",
        icon: Trophy,
    },
    {
        title: "Secure Platform",
        description:
            "Your account and transactions are protected with secure authentication and verification.",
        icon: ShieldCheck,
    },
    {
        title: "Digital Wallet",
        description:
            "Manage your QuickTxn balance and use it conveniently across available services.",
        icon: WalletCards,
    },
];

export default function Features() {
    return (
        <section
            id="services"
            className="bg-white py-20 sm:py-24 lg:py-28"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* ============================= */}
                {/* SECTION HEADING */}
                {/* ============================= */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                    className="mx-auto mb-16 max-w-3xl text-center"
                >

                    <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

                        WHY QUICKTXN

                    </span>

                    <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">

                        Everything You Need

                        <br className="hidden sm:block" />

                        In One Platform

                    </h2>

                    <p className="mt-6 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">

                        Buy airtime, purchase data, convert airtime
                        to cash, fund betting wallets and manage
                        your wallet from one secure platform.

                    </p>

                </motion.div>

                {/* ============================= */}
                {/* FEATURES GRID */}
                {/* ============================= */}

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.15,
                    }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >

                    {features.map((feature) => {

                        const Icon = feature.icon;

                        return (
                            <motion.div
                                key={feature.title}
                                variants={fadeUp}
                                whileHover={{
                                    y: -8,
                                }}
                                transition={{
                                    duration: 0.3,
                                }}
                                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow duration-300 hover:border-green-200 hover:shadow-2xl sm:p-8"
                            >

                                {/* Decorative Background */}

                                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-green-50 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

                                {/* Icon */}

                                <motion.div
                                    whileHover={{
                                        scale: 1.08,
                                        rotate: 3,
                                    }}
                                    className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600 transition-colors duration-300 group-hover:bg-green-600 group-hover:text-white"
                                >

                                    <Icon size={27} />

                                </motion.div>

                                {/* Content */}

                                <div className="relative mt-7">

                                    <h3 className="text-xl font-bold text-slate-900">

                                        {feature.title}

                                    </h3>

                                    <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">

                                        {feature.description}

                                    </p>

                                </div>

                                {/* Bottom Link */}

                                <div className="relative mt-7 inline-flex items-center gap-2 text-sm font-semibold text-green-600 transition-all duration-300 group-hover:gap-3">

                                    Learn More

                                    <ArrowRight size={17} />

                                </div>

                            </motion.div>
                        );
                    })}

                </motion.div>

                {/* ============================= */}
                {/* BOTTOM TRUST MESSAGE */}
                {/* ============================= */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                    className="mt-14 flex justify-center"
                >

                    <div className="flex flex-col items-center gap-3 rounded-2xl bg-slate-50 px-6 py-4 text-center sm:flex-row sm:text-left">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">

                            <ShieldCheck
                                size={20}
                                className="text-green-600"
                            />

                        </div>

                        <div>

                            <p className="text-sm font-bold text-slate-900">

                                Built with security in mind

                            </p>

                            <p className="mt-1 text-xs text-slate-500 sm:text-sm">

                                Your account and transactions are handled
                                with secure authentication and verification.

                            </p>

                        </div>

                    </div>

                </motion.div>

            </div>
        </section>
    );
}