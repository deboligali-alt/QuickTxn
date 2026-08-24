"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Repeat,
    Smartphone,
    Wifi,
    Trophy,
    ArrowRight,
    ShieldCheck,
} from "lucide-react";

import {
    fadeUp,
    staggerContainer,
} from "@/animations/motion";

const services = [
    {
        title: "Swap Airtime",
        description:
            "Convert MTN, Airtel, Glo and 9mobile airtime into cash with competitive exchange rates.",
        href: "/airtime-swap",
        icon: Repeat,
    },
    {
        title: "Buy Airtime",
        description:
            "Purchase airtime for all major networks instantly and keep your lines connected.",
        href: "/airtime",
        icon: Smartphone,
    },
    {
        title: "Buy Data",
        description:
            "Get affordable data plans with fast delivery across supported Nigerian networks.",
        href: "/data",
        icon: Wifi,
    },
    {
        title: "Fund Betting",
        description:
            "Fund supported betting wallets quickly and securely from your QuickTxn account.",
        href: "/betting",
        icon: Trophy,
    },
];

export default function Services() {
    return (
        <section
            id="services"
            className="relative overflow-hidden bg-slate-50 py-20 sm:py-24 lg:py-28"
        >
            {/* Background Decorations */}

            <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-green-100/70 blur-3xl" />

            <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-emerald-100/70 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* ============================= */}
                {/* SECTION HEADING */}
                {/* ============================= */}

                <motion.div
                    variants={fadeUp as any}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                    className="mx-auto mb-14 max-w-3xl text-center"
                >

                    <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                        OUR SERVICES
                    </span>

                    <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Everything You Need
                        <br className="hidden sm:block" />
                        In One Platform
                    </h2>

                    <p className="mt-6 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                        QuickTxn provides fast, secure and reliable
                        digital financial services for your everyday
                        transactions.
                    </p>

                </motion.div>

                {/* ============================= */}
                {/* SERVICE CARDS */}
                {/* ============================= */}

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.15,
                    }}
                    className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
                >

                    {services.map((service) => {
                        const Icon = service.icon;

                        return (
                            <motion.div
                                key={service.title}
                                variants={fadeUp as any}
                                whileHover={{
                                    y: -8,
                                }}
                                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:border-green-200 hover:shadow-2xl sm:p-8"
                            >

                                {/* Decorative Circle */}

                                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-green-50 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

                                {/* Icon */}

                                <motion.div
                                    whileHover={{
                                        scale: 1.08,
                                        rotate: 4,
                                    }}
                                    className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600 transition-colors duration-300 group-hover:bg-green-600 group-hover:text-white"
                                >

                                    <Icon size={28} />

                                </motion.div>

                                {/* Content */}

                                <div className="relative mt-7">

                                    <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                                        {service.title}
                                    </h3>

                                    <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                                        {service.description}
                                    </p>

                                </div>

                                {/* Learn More */}

                                <Link
                                    href={service.href}
                                    className="relative mt-7 inline-flex items-center gap-2 text-sm font-bold text-green-600 transition-all duration-300 group-hover:gap-3"
                                >

                                    Learn More

                                    <ArrowRight size={17} />

                                </Link>

                            </motion.div>
                        );
                    })}

                </motion.div>

                {/* ============================= */}
                {/* SECURITY MESSAGE */}
                {/* ============================= */}

                <motion.div
                    variants={fadeUp as any}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                    className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-4 rounded-3xl border border-green-100 bg-green-50 px-6 py-5 text-center sm:flex-row sm:text-left"
                >

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100">

                        <ShieldCheck
                            size={22}
                            className="text-green-600"
                        />

                    </div>

                    <div>

                        <p className="font-bold text-slate-900">
                            Simple, secure and convenient
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                            Access your essential digital services
                            from one QuickTxn account.
                        </p>

                    </div>

                </motion.div>

            </div>
        </section>
    );
}