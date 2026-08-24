"use client";

import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface WalletCardProps {
    balance: number;
}

export default function WalletCard({
    balance,
}: WalletCardProps) {
    const [show, setShow] = useState(true);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 p-8 text-white shadow-2xl"
        >
            <div className="flex items-center justify-between">

                <div>
                    <p className="text-green-100">
                        Available Balance
                    </p>

                    <h1 className="mt-3 text-5xl font-bold">
                        {show
                            ? `₦${balance.toLocaleString()}`
                            : "₦ ******"}
                    </h1>
                </div>

                <button
                    onClick={() => setShow(!show)}
                >
                    {show ? (
                        <Eye size={28} />
                    ) : (
                        <EyeOff size={28} />
                    )}
                </button>

            </div>

            <div className="mt-10 flex gap-4">

                <button className="rounded-xl bg-white px-6 py-3 font-semibold text-green-700 transition hover:scale-105">
                    Fund Wallet
                </button>

                <button className="rounded-xl bg-green-700 px-6 py-3 transition hover:bg-green-800">
                    Transfer
                </button>

            </div>
        </motion.div>
    );
}