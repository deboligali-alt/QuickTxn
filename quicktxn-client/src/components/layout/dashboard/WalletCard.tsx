"use client";

import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";

interface WalletCardProps {
    balance: number;
}

export default function WalletCard({ balance }: WalletCardProps) {
    const [show, setShow] = useState(true);
    const [loading, setLoading] = useState(false);

    const fundWallet = async () => {
        const input = prompt("Enter amount to fund (Minimum ₦100)");

        if (!input) return;

        const amount = Number(input);

        if (isNaN(amount) || amount < 100) {
            alert("Minimum funding amount is ₦100");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/paystack/initialize`,
                { amount },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            window.location.href = res.data.authorization_url;
        } catch (error: any) {
            alert(
                error.response?.data?.message || "Unable to initialize payment."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 p-8 text-white shadow-2xl"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-green-100">Available Balance</p>

                    <h1 className="mt-3 text-5xl font-bold">
                        {show ? `₦${balance.toLocaleString()}` : "₦ ******"}
                    </h1>
                </div>

                <button onClick={() => setShow(!show)}>
                    {show ? <Eye size={28} /> : <EyeOff size={28} />}
                </button>
            </div>

            <div className="mt-10 flex gap-4">
                <button
                    onClick={fundWallet}
                    disabled={loading}
                    className="rounded-xl bg-white px-6 py-3 font-semibold text-green-700 transition hover:scale-105 disabled:opacity-60"
                >
                    {loading ? "Opening..." : "Fund Wallet"}
                </button>

                <button className="rounded-xl bg-green-700 px-6 py-3 transition hover:bg-green-800">
                    Transfer
                </button>
            </div>
        </motion.div>
    );
}