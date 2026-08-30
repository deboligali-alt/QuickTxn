"use client";

import { Eye, EyeOff, Plus, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface WalletProps {
    wallet?: {
        balance: number;
    };
}

export default function WalletBalanceCard({ wallet }: WalletProps) {
    const router = useRouter();

    const balance = wallet?.balance || 0;

    const [showBalance, setShowBalance] = useState(true);
    const [displayBalance, setDisplayBalance] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = Number(balance);
        const duration = 700;

        if (end === 0) {
            setDisplayBalance(0);
            return;
        }

        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;

            if (start >= end) {
                setDisplayBalance(end);
                clearInterval(timer);
            } else {
                setDisplayBalance(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [balance]);

    return (
        <section>
            <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-5 sm:p-7 text-white shadow-lg">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-green-100 sm:text-sm">
                        Available Balance
                    </p>

                    <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="rounded-full p-1 hover:bg-white/10"
                    >
                        {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                </div>

                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                    {showBalance
                        ? `₦${displayBalance.toLocaleString()}.00`
                        : "₦••••••"}
                </h2>

                <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                        onClick={() => router.push("/wallet/fund")}
                        className="flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-green-700 transition active:scale-95"
                    >
                        <Plus size={18} />
                        Fund
                    </button>

                    <button
                        onClick={() => router.push("/transfer")}
                        className="flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 py-3 text-sm font-semibold text-white transition active:scale-95"
                    >
                        <ArrowUpRight size={18} />
                        Transfer
                    </button>
                </div>
            </div>
        </section>
    );
}