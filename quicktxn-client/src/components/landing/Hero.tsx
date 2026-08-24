"use client";

import { motion } from "framer-motion";
import {
    BadgeCheck,
    Smartphone,
    Database,
    RefreshCcw,
    Trophy,
    WalletCards,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";

import {
    fadeLeft,
    fadeRight,
} from "@/animations/motion";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getWallet } from "@/services/wallet.service";

interface Wallet {
    balance: number;
}

export default function Hero() {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const loadWallet = async () => {
            const token = localStorage.getItem("token");

            if (!token) return;

            try {
                const response = await getWallet(token);

                setWallet(response.data);
                setLoggedIn(true);
            } catch (error) {
                console.error("Wallet loading error:", error);
            }
        };

        loadWallet();
    }, []);

    return (
        <section
            id="home"
            className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white"
        >
            {/* ============================= */}
            {/* BACKGROUND DECORATIONS */}
            {/* ============================= */}

            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-emerald-300/20 blur-3xl" />

            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-400/10 blur-3xl" />

            {/* ============================= */}
            {/* MAIN CONTAINER */}
            {/* ============================= */}

            <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-16 px-4 py-24 sm:px-6 md:py-28 lg:grid-cols-2 lg:px-8">

                {/* ============================= */}
                {/* LEFT SIDE */}
                {/* ============================= */}

                <motion.div
                    variants={fadeLeft as any}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                    className="relative z-10"
                >

                    {/* Trust Badge */}

                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">

                        <BadgeCheck
                            size={18}
                            className="text-green-200"
                        />

                        <span className="text-sm font-semibold">
                            Trusted by Thousands of Nigerians
                        </span>

                    </div>

                    {/* Heading */}

                    <h1 className="mt-7 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">

                        Fast, Secure &

                        <br />

                        Reliable Digital

                        <br />

                        Transactions

                    </h1>

                    {/* Highlight */}

                    <p className="mt-5 text-xl font-bold text-green-200 sm:text-2xl">

                        Airtime • Data • Betting • Wallet

                    </p>

                    {/* Description */}

                    <p className="mt-6 max-w-xl text-base leading-7 text-green-50 sm:text-lg sm:leading-8">

                        Buy airtime, purchase data, fund betting
                        wallets and convert airtime to cash from
                        one secure and reliable platform.

                    </p>

                    {/* ============================= */}
                    {/* BUTTONS */}
                    {/* ============================= */}

                    <div className="mt-9 flex flex-col gap-4 sm:flex-row">

                        {loggedIn ? (

                            <motion.div
                                whileHover={{
                                    scale: 1.05,
                                    y: -2,
                                }}
                                whileTap={{
                                    scale: 0.96,
                                }}
                            >

                                <Link
                                    href="/dashboard"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 font-bold text-green-700 shadow-xl transition-shadow hover:shadow-2xl sm:w-auto"
                                >

                                    Go to Dashboard

                                    <ArrowRight size={19} />

                                </Link>

                            </motion.div>

                        ) : (

                            <motion.div
                                whileHover={{
                                    scale: 1.05,
                                    y: -2,
                                }}
                                whileTap={{
                                    scale: 0.96,
                                }}
                            >

                                <Link
                                    href="/register"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 font-bold text-green-700 shadow-xl transition-shadow hover:shadow-2xl sm:w-auto"
                                >

                                    Get Started

                                    <ArrowRight size={19} />

                                </Link>

                            </motion.div>

                        )}

                        <motion.a
                            href="#services"
                            whileHover={{
                                scale: 1.05,
                                y: -2,
                            }}
                            whileTap={{
                                scale: 0.96,
                            }}
                            className="inline-flex w-full items-center justify-center rounded-2xl border border-white/50 bg-white/5 px-7 py-4 font-semibold backdrop-blur-sm transition hover:bg-white/10 sm:w-auto"
                        >

                            Learn More

                        </motion.a>

                    </div>

                    {/* ============================= */}
                    {/* STATISTICS */}
                    {/* ============================= */}

                    <div className="mt-12 grid max-w-xl grid-cols-3 gap-4 sm:gap-8">

                        <motion.div
                            whileHover={{
                                y: -5,
                                scale: 1.03,
                            }}
                            className="cursor-default"
                        >

                            <h2 className="text-2xl font-extrabold sm:text-3xl">
                                10K+
                            </h2>

                            <p className="mt-1 text-xs text-green-100 sm:text-sm">
                                Happy Users
                            </p>

                        </motion.div>

                        <motion.div
                            whileHover={{
                                y: -5,
                                scale: 1.03,
                            }}
                            className="cursor-default"
                        >

                            <h2 className="text-2xl font-extrabold sm:text-3xl">
                                ₦50M+
                            </h2>

                            <p className="mt-1 text-xs text-green-100 sm:text-sm">
                                Transactions
                            </p>

                        </motion.div>

                        <motion.div
                            whileHover={{
                                y: -5,
                                scale: 1.03,
                            }}
                            className="cursor-default"
                        >

                            <h2 className="text-2xl font-extrabold sm:text-3xl">
                                99.9%
                            </h2>

                            <p className="mt-1 text-xs text-green-100 sm:text-sm">
                                Success Rate
                            </p>

                        </motion.div>

                    </div>

                </motion.div>

                {/* ============================= */}
                {/* RIGHT SIDE */}
                {/* ============================= */}

                <motion.div
                    variants={fadeRight as any}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                    className="relative z-10 flex min-h-[500px] items-center justify-center lg:min-h-0"
                >

                    {/* ============================= */}
                    {/* MAIN WALLET CARD */}
                    {/* ============================= */}

                    <motion.div
                        animate={{
                            y: [0, -12, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="relative w-full max-w-md rounded-[2rem] border border-white/20 bg-white p-6 text-slate-900 shadow-2xl sm:p-8"
                    >

                        {/* Card Header */}

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">

                                    {loggedIn
                                        ? "Available Balance"
                                        : "Demo Wallet"}

                                </p>

                                <h3 className="mt-1 text-xl font-bold">

                                    {loggedIn
                                        ? "Wallet Balance"
                                        : "QuickTxn Wallet"}

                                </h3>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-600">

                                <WalletCards size={25} />

                            </div>

                        </div>

                        {/* Balance */}

                        <div className="mt-8">

                            <p className="text-sm text-slate-500">
                                Current Balance
                            </p>

                            <h2 className="mt-2 break-words text-4xl font-extrabold text-green-600 sm:text-5xl">

                                ₦
                                {Number(
                                    wallet?.balance ?? 0
                                ).toLocaleString()}

                            </h2>

                        </div>

                        {/* Wallet Status */}

                        <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 p-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">

                                    <CheckCircle2
                                        size={18}
                                        className="text-green-600"
                                    />

                                </div>

                                <div>

                                    <p className="text-sm font-semibold">

                                        {loggedIn
                                            ? "Wallet Active"
                                            : "Wallet Preview"}

                                    </p>

                                    <p className="text-xs text-slate-500">

                                        {loggedIn
                                            ? "Ready for transactions"
                                            : "Sign up to get started"}

                                    </p>

                                </div>

                            </div>

                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">

                                {loggedIn
                                    ? "ACTIVE"
                                    : "DEMO"}

                            </span>

                        </div>

                        {/* ============================= */}
                        {/* SERVICES */}
                        {/* ============================= */}

                        <div className="mt-8 grid grid-cols-2 gap-3">

                            {/* Airtime */}

                            <motion.div
                                whileHover={{
                                    scale: 1.03,
                                    y: -3,
                                }}
                                className="flex items-center gap-3 rounded-2xl bg-green-50 p-4"
                            >

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">

                                    <Smartphone size={20} />

                                </div>

                                <div>

                                    <p className="text-sm font-bold">
                                        Airtime
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Recharge
                                    </p>

                                </div>

                            </motion.div>

                            {/* Data */}

                            <motion.div
                                whileHover={{
                                    scale: 1.03,
                                    y: -3,
                                }}
                                className="flex items-center gap-3 rounded-2xl bg-green-50 p-4"
                            >

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">

                                    <Database size={20} />

                                </div>

                                <div>

                                    <p className="text-sm font-bold">
                                        Data
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Buy Data
                                    </p>

                                </div>

                            </motion.div>

                            {/* Swap */}

                            <motion.div
                                whileHover={{
                                    scale: 1.03,
                                    y: -3,
                                }}
                                className="flex items-center gap-3 rounded-2xl bg-green-50 p-4"
                            >

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">

                                    <RefreshCcw size={20} />

                                </div>

                                <div>

                                    <p className="text-sm font-bold">
                                        Swap
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Airtime
                                    </p>

                                </div>

                            </motion.div>

                            {/* Betting */}

                            <motion.div
                                whileHover={{
                                    scale: 1.03,
                                    y: -3,
                                }}
                                className="flex items-center gap-3 rounded-2xl bg-green-50 p-4"
                            >

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">

                                    <Trophy size={20} />

                                </div>

                                <div>

                                    <p className="text-sm font-bold">
                                        Betting
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Fund Wallet
                                    </p>

                                </div>

                            </motion.div>

                        </div>

                    </motion.div>

                    {/* ============================= */}
                    {/* SUCCESS NOTIFICATION */}
                    {/* ============================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.8,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: [0, 8, 0],
                        }}
                        transition={{
                            opacity: {
                                duration: 0.6,
                                delay: 0.8,
                            },
                            scale: {
                                duration: 0.6,
                                delay: 0.8,
                            },
                            y: {
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            },
                        }}
                        className="absolute right-0 top-2 z-20 hidden items-center gap-3 rounded-2xl border border-white/30 bg-white/90 px-4 py-3 text-slate-900 shadow-2xl backdrop-blur-xl sm:flex lg:-right-8"
                    >

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">

                            <CheckCircle2
                                size={21}
                                className="text-green-600"
                            />

                        </div>

                        <div>

                            <p className="text-sm font-bold">
                                Transaction Successful
                            </p>

                            <p className="text-xs text-slate-500">
                                Payment completed
                            </p>

                        </div>

                    </motion.div>

                    {/* ============================= */}
                    {/* EARNINGS CARD */}
                    {/* ============================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.8,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: [0, -10, 0],
                        }}
                        transition={{
                            opacity: {
                                duration: 0.6,
                                delay: 1.1,
                            },
                            scale: {
                                duration: 0.6,
                                delay: 1.1,
                            },
                            y: {
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            },
                        }}
                        className="absolute bottom-4 left-0 z-20 hidden rounded-2xl border border-white/20 bg-green-700 px-5 py-4 text-white shadow-2xl sm:block lg:-left-8"
                    >

                        <div className="flex items-center gap-4">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">

                                <WalletCards size={21} />

                            </div>

                            <div>

                                <p className="text-xs text-green-100">
                                    Today's Earnings
                                </p>

                                <h3 className="mt-1 text-xl font-extrabold">
                                    ₦5,000
                                </h3>

                            </div>

                        </div>

                    </motion.div>

                    {/* ============================= */}
                    {/* NETWORK CARD */}
                    {/* ============================= */}

                    <motion.div
                        animate={{
                            y: [0, 8, 0],
                            rotate: [0, 1, 0],
                        }}
                        transition={{
                            duration: 4.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute bottom-20 right-0 z-20 hidden rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-slate-900 shadow-2xl backdrop-blur-xl md:block lg:-right-12"
                    >

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 font-bold text-yellow-700">

                                M

                            </div>

                            <div>

                                <p className="text-xs text-slate-500">
                                    MTN Data
                                </p>

                                <p className="text-sm font-bold">
                                    5GB Purchased
                                </p>

                            </div>

                        </div>

                    </motion.div>

                    {/* ============================= */}
                    {/* MOBILE TRUST CARD */}
                    {/* ============================= */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 1.3,
                            duration: 0.6,
                        }}
                        className="absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 translate-y-1/2 items-center gap-3 rounded-2xl border border-white/20 bg-white/90 px-4 py-3 text-slate-900 shadow-xl backdrop-blur-xl sm:hidden"
                    >

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">

                            <CheckCircle2
                                size={18}
                                className="text-green-600"
                            />

                        </div>

                        <div>

                            <p className="text-xs text-slate-500">
                                QuickTxn
                            </p>

                            <p className="text-sm font-bold">
                                Secure & Reliable
                            </p>

                        </div>

                    </motion.div>

                </motion.div>

            </div>

            {/* ============================= */}
            {/* SCROLL INDICATOR */}
            {/* ============================= */}

            <motion.div
                animate={{
                    y: [0, 8, 0],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-green-100 md:flex"
            >

                <span className="text-xs font-medium">
                    Scroll to explore
                </span>

                <div className="flex h-9 w-6 justify-center rounded-full border border-green-200/60 p-1">

                    <div className="h-2 w-1 rounded-full bg-green-100" />

                </div>

            </motion.div>

        </section>
    );
}