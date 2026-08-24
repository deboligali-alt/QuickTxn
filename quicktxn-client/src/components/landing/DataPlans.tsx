"use client";

import { motion } from "framer-motion";
import {
    Database,
    CheckCircle2,
    ArrowRight,
    Zap,
} from "lucide-react";

import {
    fadeUp,
    staggerContainer,
} from "@/animations/motion";

const networks = ["MTN", "Airtel", "Glo", "9mobile"];

const plans = [
    {
        network: "MTN",
        plan: "100MB",
        price: 100,
        validity: "1 Day",
    },
    {
        network: "MTN",
        plan: "500MB",
        price: 250,
        validity: "7 Days",
    },
    {
        network: "MTN",
        plan: "1GB",
        price: 350,
        validity: "30 Days",
    },
    {
        network: "MTN",
        plan: "2GB",
        price: 700,
        validity: "30 Days",
    },
    {
        network: "Airtel",
        plan: "500MB",
        price: 250,
        validity: "7 Days",
    },
    {
        network: "Airtel",
        plan: "1GB",
        price: 400,
        validity: "30 Days",
    },
    {
        network: "Glo",
        plan: "1GB",
        price: 300,
        validity: "30 Days",
    },
    {
        network: "9mobile",
        plan: "1GB",
        price: 350,
        validity: "30 Days",
    },
];

export default function DataPlans() {
    return (
        <section
            id="data-plans"
            className="bg-slate-50 py-20 sm:py-24 lg:py-28"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                {/* ============================= */}
                {/* HEADING */}
                {/* ============================= */}

                <motion.div
                    variants={fadeUp as any}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                    className="mx-auto max-w-3xl text-center"
                >
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                        <Database size={16} />
                        DATA PLANS
                    </span>

                    <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Affordable Data Plans
                    </h2>

                    <p className="mt-6 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                        Get affordable data bundles across your
                        preferred network and stay connected without
                        breaking the bank.
                    </p>
                </motion.div>

                {/* ============================= */}
                {/* NETWORK TABS */}
                {/* ============================= */}

                <div className="mt-12 flex flex-wrap justify-center gap-3">
                    {networks.map((network, index) => (
                        <button
                            key={network}
                            type="button"
                            className={`rounded-full px-6 py-3 text-sm font-semibold transition-all ${index === 0
                                    ? "bg-green-600 text-white shadow-lg"
                                    : "border border-slate-200 bg-white text-slate-600 hover:border-green-500 hover:text-green-600"
                                }`}
                        >
                            {network}
                        </button>
                    ))}
                </div>

                {/* ============================= */}
                {/* DATA PLANS */}
                {/* ============================= */}

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.1,
                    }}
                    className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                    {plans.map((plan, index) => (
                        <motion.div
                            key={`${plan.network}-${plan.plan}-${index}`}
                             variants={fadeUp as any}
                            whileHover={{
                                y: -8,
                            }}
                            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-green-200 hover:shadow-2xl"
                        >

                            {/* Network */}

                            <div className="flex items-center justify-between">

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 font-bold text-green-700">
                                    {plan.network === "9mobile"
                                        ? "9"
                                        : plan.network.charAt(0)}
                                </div>

                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                    Available
                                </span>

                            </div>

                            {/* Plan */}

                            <div className="mt-7">

                                <p className="text-sm font-medium text-slate-500">
                                    {plan.network}
                                </p>

                                <h3 className="mt-2 text-3xl font-extrabold text-slate-900">
                                    {plan.plan}
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Valid for {plan.validity}
                                </p>

                            </div>

                            {/* Price */}

                            <div className="mt-7">

                                <p className="text-xs text-slate-500">
                                    Price
                                </p>

                                <h4 className="mt-1 text-3xl font-extrabold text-green-600">
                                    ₦{plan.price.toLocaleString()}
                                </h4>

                            </div>

                            {/* Benefits */}

                            <div className="mt-6 space-y-3">

                                <div className="flex items-center gap-2 text-sm text-slate-600">

                                    <CheckCircle2
                                        size={16}
                                        className="text-green-600"
                                    />

                                    Instant delivery

                                </div>

                                <div className="flex items-center gap-2 text-sm text-slate-600">

                                    <CheckCircle2
                                        size={16}
                                        className="text-green-600"
                                    />

                                    Secure payment

                                </div>

                                <div className="flex items-center gap-2 text-sm text-slate-600">

                                    <Zap
                                        size={16}
                                        className="text-green-600"
                                    />

                                    Fast activation

                                </div>

                            </div>

                            {/* Button */}

                            <motion.a
                                href="/dashboard/data"
                                whileHover={{
                                    scale: 1.03,
                                }}
                                whileTap={{
                                    scale: 0.97,
                                }}
                                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3.5 font-semibold text-white transition-colors hover:bg-green-700"
                            >
                                Buy Data

                                <ArrowRight size={17} />

                            </motion.a>

                        </motion.div>
                    ))}
                </motion.div>

                {/* ============================= */}
                {/* BOTTOM NOTE */}
                {/* ============================= */}

                <motion.div
                    variants={fadeUp as any} 
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
                        Data plans and prices may change based on
                        current provider availability. The final price
                        will be displayed before you complete your
                        purchase.
                    </p>

                </motion.div>

            </div>
        </section>
    );
}