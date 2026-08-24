import Link from "next/link";
import { ArrowRight, Repeat } from "lucide-react";

export default function AirtimeSwapHero() {
    return (
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 p-8 text-white shadow-xl">

            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

                <div className="max-w-2xl">

                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
                        <Repeat size={18} />
                        QuickTxn Airtime Exchange
                    </div>

                    <h1 className="text-4xl font-bold leading-tight">
                        Convert Airtime to Cash Instantly
                    </h1>

                    <p className="mt-4 text-lg text-green-100">
                        Sell MTN, Airtel, Glo and 9mobile airtime at competitive
                        exchange rates and receive cash directly in your wallet.
                    </p>

                    <Link
                        href="/airtime-swap"
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 font-semibold text-green-700 transition hover:scale-105"
                    >
                        Swap Airtime Now
                        <ArrowRight size={18} />
                    </Link>

                </div>

                <div className="rounded-2xl bg-white/10 p-6 backdrop-blur">

                    <h3 className="mb-5 text-xl font-bold">
                        Today&apos;s Rates
                    </h3>

                    <div className="space-y-3">

                        <RateRow network="MTN" rate="80%" />

                        <RateRow network="Airtel" rate="78%" />

                        <RateRow network="Glo" rate="75%" />

                        <RateRow network="9mobile" rate="70%" />

                    </div>

                </div>

            </div>

        </section>
    );
}

function RateRow({
    network,
    rate,
}: {
    network: string;
    rate: string;
}) {
    return (
        <div className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3">
            <span>{network}</span>
            <span className="font-bold">{rate}</span>
        </div>
    );
}