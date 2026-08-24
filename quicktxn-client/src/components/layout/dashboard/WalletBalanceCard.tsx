"use client";

import { Eye, EyeOff, Plus, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
export default function WalletBalanceCard() {

    const router = useRouter();
    // We'll replace this with the real wallet balance later
    const [balance, setBalance] = useState(0);
    const [showBalance, setShowBalance] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) return;

                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/wallet/balance`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setBalance(res.data.balance);
            } catch (err) {
                console.error("Balance fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();
    }, []);

    return (
        <section className="px-4 mt-2">
            <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-700 p-5 text-white shadow-lg">

                <div className="flex items-center justify-between">
                    <p className="text-sm text-green-100">Available Balance</p>

                    <button onClick={() => setShowBalance(!showBalance)}>
                        {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                </div>

                <h2 className="mt-2 text-3xl font-bold">
                    {loading
                        ? "Loading..."
                        : showBalance
                            ? `₦${Number(balance).toLocaleString()}.00`
                            : "₦••••••"}
                </h2>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={() => router.push("/wallet/fund")}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/20 py-3"
                    >
                        <Plus size={18} />
                        <span>Fund</span>
                    </button>

                    <button
                        onClick={() => router.push("/transfer")}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/20 py-3"
                    >
                        <ArrowUpRight size={18} />
                        <span>Transfer</span>
                    </button>
                </div>

            </div>
        </section>
    );
}