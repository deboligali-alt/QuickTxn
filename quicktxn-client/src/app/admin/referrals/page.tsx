"use client";

import { useEffect, useState } from "react";
import {
    Users,
    Wallet,
    CheckCircle2,
    RefreshCw,
} from "lucide-react";
import api from "@/lib/axios";

interface Referral {
    id: string;
    referrer_name: string;
    referred_name: string;
    commission: number;
    status: string;
    created_at: string;
}

export default function ReferralPage() {
    const [referrals, setReferrals] = useState<Referral[]>([]);

    const load = async () => {
        const res = await api.get("/admin/referrals");
        setReferrals(res.data.data || []);
    };

    useEffect(() => {
        load();
    }, []);

    const approve = async (id: string) => {
        await api.patch(`/admin/referrals/${id}/approve`);
        load();
    };

    const totalCommission = referrals.reduce(
        (sum, r) => sum + Number(r.commission),
        0
    );

    return (
        <main className="mx-auto max-w-7xl space-y-8 p-8">

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-4xl font-bold">
                        Referral Management
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Track referrals and commission payouts.
                    </p>
                </div>

                <button
                    onClick={load}
                    className="rounded-xl bg-green-600 p-3 text-white"
                >
                    <RefreshCw size={20} />
                </button>

            </div>

            <div className="grid gap-5 md:grid-cols-3">

                <StatCard
                    title="Total Referrals"
                    value={referrals.length}
                    icon={Users}
                />

                <StatCard
                    title="Commission Paid"
                    value={`₦${totalCommission.toLocaleString()}`}
                    icon={Wallet}
                />

                <StatCard
                    title="Completed"
                    value={
                        referrals.filter(
                            (r) => r.status === "PAID"
                        ).length
                    }
                    icon={CheckCircle2}
                />

            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow">

                <table className="min-w-full">

                    <thead className="bg-slate-100">
                        <tr>
                            <th className="px-5 py-4 text-left">
                                Referrer
                            </th>
                            <th className="px-5 py-4 text-left">
                                New User
                            </th>
                            <th className="px-5 py-4 text-left">
                                Commission
                            </th>
                            <th className="px-5 py-4 text-left">
                                Status
                            </th>
                            <th className="px-5 py-4 text-left">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>

                        {referrals.map((item) => (

                            <tr
                                key={item.id}
                                className="border-b hover:bg-slate-50"
                            >

                                <td className="px-5 py-5 font-semibold">
                                    {item.referrer_name}
                                </td>

                                <td className="px-5 py-5">
                                    {item.referred_name}
                                </td>

                                <td className="px-5 py-5 font-bold text-green-600">
                                    ₦{Number(item.commission).toLocaleString()}
                                </td>

                                <td className="px-5 py-5">

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "PAID"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {item.status}
                                    </span>

                                </td>

                                <td className="px-5 py-5">

                                    {item.status !== "PAID" && (

                                        <button
                                            onClick={() => approve(item.id)}
                                            className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white"
                                        >
                                            Pay
                                        </button>

                                    )}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </main>
    );
}

function StatCard({
    title,
    value,
    icon: Icon,
}: any) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-slate-500">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {value}
                    </h2>

                </div>

                <div className="rounded-xl bg-green-100 p-3 text-green-700">
                    <Icon size={24} />
                </div>

            </div>

        </div>
    );
}