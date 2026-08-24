"use client";

import Link from "next/link";
import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaTwitter,
} from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white">

            <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-4">

                {/* Company */}

                <div>

                    <h2 className="text-3xl font-bold text-green-500">
                        QuickTxn
                    </h2>

                    <p className="mt-5 leading-8 text-slate-400">
                        QuickTxn is a trusted VTU platform for airtime
                        conversion, airtime purchase, data purchase,
                        wallet funding and betting wallet funding
                        across Nigeria.
                    </p>

                    <div className="mt-6 flex gap-4">

                        <a href="#">
                            <FaFacebook size={22} />
                        </a>

                        <a href="#">
                            <FaTwitter size={22} />
                        </a>

                        <a href="#">
                            <FaInstagram size={22} />
                        </a>

                        <a href="#">
                            <FaLinkedin size={22} />
                        </a>

                    </div>

                </div>

                {/* Quick Links */}

                <div>

                    <h3 className="mb-6 text-xl font-bold">
                        Quick Links
                    </h3>

                    <ul className="space-y-3 text-slate-400">

                        <li>
                            <Link href="/">Home</Link>
                        </li>

                        <li>
                            <a href="#services">
                                Services
                            </a>
                        </li>

                        <li>
                            <a href="#features">
                                Features
                            </a>
                        </li>

                        <li>
                            <a href="#rates">
                                Rates
                            </a>
                        </li>

                        <li>
                            <a href="#faq">
                                FAQ
                            </a>
                        </li>

                        <li>
                            <a href="#contact">
                                Contact
                            </a>
                        </li>

                    </ul>

                </div>

                {/* Services */}

                <div>

                    <h3 className="mb-6 text-xl font-bold">
                        Our Services
                    </h3>

                    <ul className="space-y-3 text-slate-400">

                        <li>
                            <Link href="/airtime-swap">
                                Airtime Swap
                            </Link>
                        </li>

                        <li>
                            <Link href="/airtime">
                                Buy Airtime
                            </Link>
                        </li>

                        <li>
                            <Link href="/data">
                                Buy Data
                            </Link>
                        </li>

                        <li>
                            <Link href="/betting">
                                Fund Betting
                            </Link>
                        </li>

                        <li>
                            <Link href="/wallet/fund">
                                Wallet Funding
                            </Link>
                        </li>

                    </ul>

                </div>

                {/* Newsletter */}

                <div>

                    <h3 className="mb-6 text-xl font-bold">
                        Newsletter
                    </h3>

                    <p className="mb-5 text-slate-400">
                        Subscribe to receive updates,
                        offers and announcements.
                    </p>

                    <form className="space-y-4">

                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 outline-none"
                        />

                        <button
                            className="w-full rounded-xl bg-green-600 py-4 font-semibold hover:bg-green-700"
                        >
                            Subscribe
                        </button>

                    </form>

                </div>

            </div>

            <div className="border-t border-slate-800">

                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-slate-500 md:flex-row">

                    <p>
                        © 2026 QuickTxn. All Rights Reserved.
                    </p>

                    <div className="flex gap-6">

                        <a href="#">
                            Privacy Policy
                        </a>

                        <a href="#">
                            Terms & Conditions
                        </a>

                    </div>

                </div>

            </div>

        </footer>
    );
}