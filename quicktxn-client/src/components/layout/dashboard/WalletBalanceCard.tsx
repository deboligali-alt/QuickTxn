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

    // Smooth balance animation
    useEffect(() => {
        let start = 0;
        const end = Number(balance);
        const duration = 800;

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
        <section className="mt-1 px-4">
            <div className="rounded-[28px] bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-green-100">Available Balance</p>

                    <button onClick={() => setShowBalance(!showBalance)}>
                        {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                </div>

                <h2 className="mt-2 text-3xl font-bold">
                    {showBalance
                        ? `₦${displayBalance.toLocaleString()}.00`
                        : "₦••••••"}
                </h2>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={() => router.push("/wallet/fund")}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/20 py-3 transition active:scale-95"
                    >
                        <Plus size={18} />
                        <span>Fund</span>
                    </button>

                    <button
                        onClick={() => router.push("/transfer")}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/20 py-3 transition active:scale-95"
                    >
                        <ArrowUpRight size={18} />
                        <span>Transfer</span>
                    </button>
                </div>
            </div>
        </section>
    );
}