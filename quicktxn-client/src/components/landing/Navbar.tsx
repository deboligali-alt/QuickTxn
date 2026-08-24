"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const router = useRouter();
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setLoggedIn(!!token);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

                <Link
                    href="/"
                    className="text-3xl font-bold text-green-600"
                >
                    QuickTxn
                </Link>

                <nav className="hidden items-center gap-8 lg:flex">
                    <a href="#home">Home</a>
                    <a href="#services">Services</a>
                    <a href="#features">Features</a>
                    <a href="#rates">Rates</a>
                    <a href="#reviews">Reviews</a>
                    <a href="#faq">FAQ</a>
                    <a href="#contact">Contact</a>
                </nav>

                <div className="flex items-center gap-4">

                    {loggedIn ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="font-medium text-green-600"
                            >
                                Dashboard
                            </Link>

                            <button
                                onClick={logout}
                                className="rounded-xl bg-red-500 px-5 py-2 text-white"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="font-medium text-green-600"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="rounded-xl bg-green-600 px-5 py-2 text-white"
                            >
                                Get Started
                            </Link>
                        </>
                    )}

                </div>

            </div>
        </header>
    );
}