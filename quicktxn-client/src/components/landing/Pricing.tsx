"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Repeat,
    Wifi,
    Trophy,
} from "lucide-react";

import {
    getLandingRates,
    getLandingDataPlans,
} from "@/services/landing.service";
interface AirtimeRate {
    network: string;
    rate: string;
}
interface DataPlan {
    network: string;
    plan_name: string;
    plan_code: string;
    amount: string;
}
export default function Pricing() {
    const [rates, setRates] = useState<AirtimeRate[]>([]);
    const [plans, setPlans] = useState<DataPlan[]>([]);
    useEffect(() => {
        const loadRates = async () => {
            try {
                const response = await getLandingRates();
                setRates(response.data || []);
                const planResponse = await getLandingDataPlans();
                setPlans(planResponse.data || []);
            } catch (error) {
                console.error(error);
            }
        };

        loadRates();
    }, []);
    const cheapestPlan = plans.reduce<DataPlan | null>(
        (lowest, current) => {
            if (!lowest) return current;

            return Number(current.amount) < Number(lowest.amount)
                ? current
                : lowest;
        },
        null
    );
    return (
        <section
            id="rates"
            className="bg-white py-24"
        >
            <div className="mx-auto max-w-7xl px-6">

                <div className="mb-16 text-center">

                    <span className="font-semibold text-green-600">
                        OUR RATES
                    </span>

                    <h2 className="mt-4 text-4xl font-bold">
                        Simple & Transparent Pricing
                    </h2>

                    <p className="mt-4 text-slate-600">
                        Enjoy competitive rates with no hidden charges.
                        Fast, secure and reliable transactions every time.
                    </p>

                </div>

                <div className="grid gap-8 lg:grid-cols-3">

                    {/* Airtime Swap */}

                    <div className="rounded-3xl border bg-white p-8 shadow-lg">

                        <Repeat
                            size={42}
                            className="text-green-600"
                        />

                        <h3 className="mt-6 text-2xl font-bold">
                            Airtime Swap
                        </h3>

                        <h1 className="mt-5 text-5xl font-bold text-green-600">
                            {Number(
                                rates.find(
                                    (item) => item.network === "MTN"
                                )?.rate ?? 0
                            )}%
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Exchange Rate
                        </p>

                        <ul className="mt-8 space-y-3">

                            {rates.map((rate) => (
                                <li
                                    key={rate.network}
                                    className="flex justify-between"
                                >
                                    <span>{rate.network}</span>

                                    <span className="font-semibold">
                                        {Number(rate.rate)}%
                                    </span>
                                </li>
                            ))}

                            <li>
                                ✔ Instant Approval
                            </li>

                        </ul>
                        <Link
                            href="/airtime-swap"
                            className="mt-10 inline-block rounded-xl bg-green-600 px-6 py-3 text-white"
                        >
                            Swap Now
                        </Link>

                    </div>

                    {/* Data */}

                    <div className="relative rounded-3xl border-2 border-green-600 bg-white p-8 shadow-xl">

                        <span className="absolute right-6 top-6 rounded-full bg-green-600 px-4 py-1 text-sm text-white">
                            Most Popular
                        </span>

                        <Wifi
                            size={42}
                            className="text-green-600"
                        />

                        <h3 className="mt-6 text-2xl font-bold">
                            Buy Data
                        </h3>

                        <h1 className="mt-5 text-5xl font-bold text-green-600">
                            From ₦
                            {cheapestPlan
                                ? Number(cheapestPlan.amount).toLocaleString()
                                : "--"}
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Affordable Plans
                        </p>

                        <ul className="mt-8 space-y-3">

                            <li>✔ MTN SME</li>
                            <li>✔ Airtel SME</li>
                            <li>✔ Glo Data</li>
                            <li>✔ 9mobile Data</li>
                            <li>✔ Instant Delivery</li>

                        </ul>

                        <Link
                            href="/data"
                            className="mt-10 inline-block rounded-xl bg-green-600 px-6 py-3 text-white"
                        >
                            Buy Data
                        </Link>

                    </div>

                    {/* Betting */}

                    <div className="rounded-3xl border bg-white p-8 shadow-lg">

                        <Trophy
                            size={42}
                            className="text-green-600"
                        />

                        <h3 className="mt-6 text-2xl font-bold">
                            Bet Funding
                        </h3>

                        <h1 className="mt-5 text-5xl font-bold text-green-600">
                            FREE
                        </h1>

                        <p className="mt-2 text-slate-500">
                            No Extra Charges
                        </p>

                        <ul className="mt-8 space-y-3">

                            <li>✔ SportyBet</li>
                            <li>✔ Bet9ja</li>
                            <li>✔ BetKing</li>
                            <li>✔ 1xBet</li>
                            <li>✔ Secure Payments</li>

                        </ul>

                        <Link
                            href="/betting"
                            className="mt-10 inline-block rounded-xl bg-green-600 px-6 py-3 text-white"
                        >
                            Fund Wallet
                        </Link>

                    </div>

                </div>

            </div>
        </section>
    );
}