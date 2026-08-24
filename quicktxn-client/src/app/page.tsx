"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    ArrowLeftRight,
    Wallet,
    Smartphone,
    Wifi,
    ShieldCheck,
    Zap,
    Lock,
    CheckCircle2,
    Menu,
    X,
} from "lucide-react";
import { useState } from "react";

export default function HomePage() {
    const [mobileMenu, setMobileMenu] =
        useState(false);

    return (
        <main className="min-h-screen bg-white text-slate-900">

            {/* =========================
                NAVBAR
            ========================= */}

            <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-white/90 backdrop-blur-xl">

                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

                    {/* LOGO */}

                    <Link
                        href="/"
                        className="flex items-center gap-2"
                    >

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-lg shadow-green-600/20">

                            <ArrowLeftRight
                                size={21}
                            />

                        </div>

                        <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                            Quick<span className="text-green-600">
                                Txn
                            </span>
                        </span>

                    </Link>

                    {/* DESKTOP NAV */}

                    <nav className="hidden items-center gap-8 md:flex">

                        <a
                            href="#features"
                            className="text-sm font-medium text-slate-600 transition hover:text-green-600"
                        >
                            Features
                        </a>

                        <a
                            href="#how-it-works"
                            className="text-sm font-medium text-slate-600 transition hover:text-green-600"
                        >
                            How It Works
                        </a>

                        <a
                            href="#security"
                            className="text-sm font-medium text-slate-600 transition hover:text-green-600"
                        >
                            Security
                        </a>

                    </nav>

                    {/* DESKTOP ACTIONS */}

                    <div className="hidden items-center gap-3 md:flex">

                        <Link
                            href="/login"
                            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            Login
                        </Link>

                        <Link
                            href="/register"
                            className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
                        >
                            Create Account
                        </Link>

                    </div>

                    {/* MOBILE BUTTON */}

                    <button
                        type="button"
                        onClick={() =>
                            setMobileMenu(
                                !mobileMenu
                            )
                        }
                        className="rounded-lg p-2 text-slate-700 md:hidden"
                    >
                        {mobileMenu ? (
                            <X size={25} />
                        ) : (
                            <Menu size={25} />
                        )}
                    </button>

                </div>

                {/* MOBILE NAV */}

                {mobileMenu && (
                    <div className="border-t bg-white px-5 py-5 md:hidden">

                        <div className="space-y-2">

                            <a
                                href="#features"
                                onClick={() =>
                                    setMobileMenu(
                                        false
                                    )
                                }
                                className="block rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Features
                            </a>

                            <a
                                href="#how-it-works"
                                onClick={() =>
                                    setMobileMenu(
                                        false
                                    )
                                }
                                className="block rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
                            >
                                How It Works
                            </a>

                            <a
                                href="#security"
                                onClick={() =>
                                    setMobileMenu(
                                        false
                                    )
                                }
                                className="block rounded-xl px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Security
                            </a>

                            <div className="grid grid-cols-2 gap-3 pt-3">

                                <Link
                                    href="/login"
                                    className="rounded-xl border border-slate-200 py-3 text-center font-semibold"
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/register"
                                    className="rounded-xl bg-green-600 py-3 text-center font-semibold text-white"
                                >
                                    Sign Up
                                </Link>

                            </div>

                        </div>

                    </div>
                )}

            </header>

            {/* =========================
                HERO
            ========================= */}

            <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-800 to-emerald-600 pt-32 text-white">

                {/* BACKGROUND EFFECTS */}

                <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-green-400/20 blur-3xl" />

                <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-32">

                    {/* HERO TEXT */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -40,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            duration: 0.7,
                        }}
                    >

                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">

                            <Zap
                                size={16}
                                className="text-yellow-300"
                            />

                            Fast. Secure. Simple.

                        </div>

                        <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">

                            Your money.

                            <span className="block text-green-200">
                                Your control.
                            </span>

                        </h1>

                        <p className="mt-7 max-w-xl text-lg leading-8 text-green-50 sm:text-xl">

                            Send money, fund your wallet,
                            buy airtime and data, and manage
                            your everyday payments from one
                            secure platform.

                        </p>

                        <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-green-700 shadow-xl transition hover:bg-green-50"
                            >
                                Get Started

                                <ArrowRight
                                    size={19}
                                />

                            </Link>

                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur transition hover:bg-white/20"
                            >
                                Login to QuickTxn
                            </Link>

                        </div>

                        <div className="mt-9 flex flex-wrap gap-5 text-sm text-green-100">

                            <div className="flex items-center gap-2">

                                <CheckCircle2
                                    size={17}
                                />

                                Secure transactions

                            </div>

                            <div className="flex items-center gap-2">

                                <CheckCircle2
                                    size={17}
                                />

                                Easy wallet funding

                            </div>

                        </div>

                    </motion.div>

                    {/* HERO CARD */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 40,
                            scale: 0.95,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            scale: 1,
                        }}
                        transition={{
                            duration: 0.7,
                            delay: 0.15,
                        }}
                        className="relative mx-auto w-full max-w-md"
                    >

                        <div className="rounded-[2rem] border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">

                            <div className="rounded-[1.5rem] bg-white p-6 text-slate-900 shadow-xl">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-sm text-slate-500">
                                            Wallet Balance
                                        </p>

                                        <p className="mt-1 text-3xl font-black">
                                            ₦250,000
                                        </p>

                                    </div>

                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">

                                        <Wallet
                                            size={24}
                                        />

                                    </div>

                                </div>

                                <div className="mt-7 grid grid-cols-3 gap-3">

                                    <div className="rounded-xl bg-slate-50 p-3 text-center">

                                        <ArrowLeftRight
                                            size={19}
                                            className="mx-auto text-green-600"
                                        />

                                        <p className="mt-2 text-xs font-semibold">
                                            Transfer
                                        </p>

                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-3 text-center">

                                        <Smartphone
                                            size={19}
                                            className="mx-auto text-green-600"
                                        />

                                        <p className="mt-2 text-xs font-semibold">
                                            Airtime
                                        </p>

                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-3 text-center">

                                        <Wifi
                                            size={19}
                                            className="mx-auto text-green-600"
                                        />

                                        <p className="mt-2 text-xs font-semibold">
                                            Data
                                        </p>

                                    </div>

                                </div>

                                <div className="mt-6 rounded-xl bg-green-50 p-4">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white">

                                            <CheckCircle2
                                                size={19}
                                            />

                                        </div>

                                        <div>

                                            <p className="text-sm font-bold">
                                                Transfer Successful
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                ₦15,000 sent
                                                successfully
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </motion.div>

                </div>

            </section>

            {/* =========================
                FEATURES
            ========================= */}

            <section
                id="features"
                className="bg-slate-50 py-24"
            >

                <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

                    <div className="mx-auto max-w-2xl text-center">

                        <span className="font-semibold text-green-600">
                            EVERYTHING IN ONE PLACE
                        </span>

                        <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                            Built for everyday payments
                        </h2>

                        <p className="mt-5 text-lg leading-8 text-slate-500">
                            QuickTxn brings the essential financial
                            tools you need into one simple dashboard.
                        </p>

                    </div>

                    <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

                        {[
                            {
                                icon: Wallet,
                                title: "Digital Wallet",
                                text: "Fund and manage your wallet with ease.",
                            },
                            {
                                icon: ArrowLeftRight,
                                title: "Money Transfer",
                                text: "Send money quickly to other QuickTxn users.",
                            },
                            {
                                icon: Smartphone,
                                title: "Airtime",
                                text: "Recharge any supported mobile network.",
                            },
                            {
                                icon: Wifi,
                                title: "Data",
                                text: "Purchase data bundles directly from your wallet.",
                            },
                        ].map(
                            (
                                item,
                                index
                            ) => {
                                const Icon =
                                    item.icon;

                                return (
                                    <motion.div
                                        key={
                                            item.title
                                        }
                                        initial={{
                                            opacity: 0,
                                            y: 25,
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        viewport={{
                                            once: true,
                                        }}
                                        transition={{
                                            delay:
                                                index *
                                                0.08,
                                        }}
                                        className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                    >

                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600">

                                            <Icon
                                                size={
                                                    27
                                                }
                                            />

                                        </div>

                                        <h3 className="mt-6 text-xl font-bold">
                                            {
                                                item.title
                                            }
                                        </h3>

                                        <p className="mt-3 leading-7 text-slate-500">
                                            {
                                                item.text
                                            }
                                        </p>

                                    </motion.div>
                                );
                            }
                        )}

                    </div>

                </div>

            </section>

            {/* =========================
                HOW IT WORKS
            ========================= */}

            <section
                id="how-it-works"
                className="bg-white py-24"
            >

                <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

                    <div className="mx-auto max-w-2xl text-center">

                        <span className="font-semibold text-green-600">
                            GET STARTED
                        </span>

                        <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
                            Simple from day one
                        </h2>

                    </div>

                    <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">

                        {[
                            {
                                number: "01",
                                title: "Create an account",
                                text: "Register with your name, email, phone number and password.",
                            },
                            {
                                number: "02",
                                title: "Fund your wallet",
                                text: "Add money to your QuickTxn wallet through the available payment options.",
                            },
                            {
                                number: "03",
                                title: "Start transacting",
                                text: "Transfer money, buy airtime and data, and manage your payments.",
                            },
                        ].map(
                            (step) => (
                                <div
                                    key={
                                        step.number
                                    }
                                    className="relative rounded-3xl border border-slate-200 bg-slate-50 p-8"
                                >

                                    <span className="text-5xl font-black text-green-100">
                                        {
                                            step.number
                                        }
                                    </span>

                                    <h3 className="mt-5 text-2xl font-bold">
                                        {
                                            step.title
                                        }
                                    </h3>

                                    <p className="mt-3 leading-7 text-slate-500">
                                        {
                                            step.text
                                        }
                                    </p>

                                </div>
                            )
                        )}

                    </div>

                </div>

            </section>

            {/* =========================
                SECURITY
            ========================= */}

            <section
                id="security"
                className="bg-slate-950 py-24 text-white"
            >

                <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">

                    <div>

                        <span className="font-semibold text-green-400">
                            SECURITY FIRST
                        </span>

                        <h2 className="mt-4 text-4xl font-black sm:text-5xl">
                            Your money deserves
                            strong protection.
                        </h2>

                        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
                            QuickTxn is designed with multiple
                            layers of account and transaction
                            protection.
                        </p>

                        <div className="mt-8 space-y-5">

                            <div className="flex gap-4">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400">

                                    <Lock
                                        size={21}
                                    />

                                </div>

                                <div>

                                    <h3 className="font-bold">
                                        Secure authentication
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-slate-400">
                                        Your account is protected
                                        by authenticated access.
                                    </p>

                                </div>

                            </div>

                            <div className="flex gap-4">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-400">

                                    <ShieldCheck
                                        size={21}
                                    />

                                </div>

                                <div>

                                    <h3 className="font-bold">
                                        Transaction PIN
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-slate-400">
                                        Sensitive financial actions
                                        can be protected with a
                                        transaction PIN.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">

                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">

                            <ShieldCheck
                                size={34}
                            />

                        </div>

                        <h3 className="mt-7 text-2xl font-bold">
                            Built with security in mind
                        </h3>

                        <p className="mt-4 leading-7 text-slate-400">
                            Keep your login credentials, OTPs
                            and transaction PIN private. QuickTxn
                            support will never ask you to reveal
                            sensitive security information.
                        </p>

                        <Link
                            href="/register"
                            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white transition hover:bg-green-700"
                        >
                            Create Your Account

                            <ArrowRight
                                size={18}
                            />

                        </Link>

                    </div>

                </div>

            </section>

            {/* =========================
                CTA
            ========================= */}

            <section className="bg-green-600 py-20">

                <div className="mx-auto max-w-4xl px-5 text-center text-white sm:px-6">

                    <h2 className="text-4xl font-black sm:text-5xl">
                        Ready to get started?
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-green-50">
                        Create your QuickTxn account and manage
                        your everyday transactions from one place.
                    </p>

                    <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

                        <Link
                            href="/register"
                            className="rounded-xl bg-white px-7 py-4 font-bold text-green-700 transition hover:bg-green-50"
                        >
                            Create Account
                        </Link>

                        <Link
                            href="/login"
                            className="rounded-xl border border-white/30 px-7 py-4 font-bold text-white transition hover:bg-white/10"
                        >
                            Login
                        </Link>

                    </div>

                </div>

            </section>

            {/* =========================
                FOOTER
            ========================= */}

            <footer className="bg-slate-950 py-10 text-slate-400">

                <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">

                    <div>

                        <div className="flex items-center gap-2">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-white">

                                <ArrowLeftRight
                                    size={18}
                                />

                            </div>

                            <span className="text-xl font-bold text-white">
                                Quick<span className="text-green-500">
                                    Txn
                                </span>
                            </span>

                        </div>

                        <p className="mt-3 text-sm">
                            Simple digital payments for everyday life.
                        </p>

                    </div>

                    <div className="flex flex-wrap gap-6 text-sm">

                        <Link
                            href="/login"
                            className="transition hover:text-white"
                        >
                            Login
                        </Link>

                        <Link
                            href="/register"
                            className="transition hover:text-white"
                        >
                            Create Account
                        </Link>

                        <a
                            href="#security"
                            className="transition hover:text-white"
                        >
                            Security
                        </a>

                    </div>

                </div>

                <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 px-5 pt-6 text-sm sm:px-6 lg:px-8">

                    © {new Date().getFullYear()} QuickTxn.
                    All rights reserved.

                </div>

            </footer>

        </main>
    );
}