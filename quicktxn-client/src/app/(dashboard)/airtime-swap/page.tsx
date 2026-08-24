"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Repeat2,
    Phone,
    Lock,
    ShieldCheck,
    CheckCircle2,
    ArrowDown,
    Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import NetworkLogo from "@/components/ui/NetworkLogo";
import {
    createSwap,
    getRates,
} from "@/services/airtimeSwap.service";

const networks = [
    {
        name: "MTN",
        value: "MTN",
    },
    {
        name: "Glo",
        value: "GLO",
    },
    {
        name: "Airtel",
        value: "AIRTEL",
    },
    {
        name: "9mobile",
        value: "9MOBILE",
    },
];

const swapAmounts = [
    500,
    1000,
    2000,
    5000,
    10000,
];

interface AirtimeRate {
    network: string;
    rate: number | string;
}

export default function AirtimeSwapPage() {

    const router = useRouter();

    const [network, setNetwork] = useState("");

    const [phone, setPhone] = useState("");

    const [amount, setAmount] = useState("");

    const [pin, setPin] = useState("");

    const [loading, setLoading] = useState(false);

    const [rates, setRates] = useState<AirtimeRate[]>([]);

    const [ratesLoading, setRatesLoading] = useState(true);

    const selectedNetwork =
        networks.find(
            (item) => item.value === network
        );

    // ========================================
    // Get Airtime Rates From Backend
    // ========================================

    useEffect(() => {

        const loadRates = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    toast.error(
                        "Please login to continue."
                    );
                    return;
                }

                const response =
                    await getRates(token);

                if (!response.success) {

                    toast.error(
                        response.message ||
                        "Unable to load airtime rates."
                    );

                    return;
                }

                setRates(response.data || []);

            } catch (error) {

                console.error(
                    "Load Airtime Rates Error:",
                    error
                );

                toast.error(
                    "Unable to load airtime rates."
                );

            } finally {

                setRatesLoading(false);

            }
        };

        loadRates();

    }, []);

    // ========================================
    // Get Current Network Rate
    // ========================================

    const currentRate =
        rates.find(
            (item) =>
                item.network === network
        );

    const swapRate =
        currentRate
            ? Number(currentRate.rate) / 100
            : 0;

    // ========================================
    // Calculate Cash Value
    // ========================================

    const cashValue =
        amount && Number(amount) > 0
            ? Number(amount) * swapRate
            : 0;

    // ========================================
    // Submit Swap
    // ========================================

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        // Network validation

        if (!network) {

            toast.error(
                "Please select your network."
            );

            return;
        }

        // Phone validation

        if (
            !phone ||
            phone.length !== 11
        ) {

            toast.error(
                "Please enter a valid 11-digit phone number."
            );

            return;
        }

        // Amount validation

        if (
            !amount ||
            Number(amount) < 100
        ) {

            toast.error(
                "Minimum swap amount is ₦100."
            );

            return;
        }

        // Rate validation

        if (!currentRate) {

            toast.error(
                "Airtime rate is not available for this network."
            );

            return;
        }

        // PIN validation

        if (
            !pin ||
            pin.length !== 4
        ) {

            toast.error(
                "Please enter your 4-digit transaction PIN."
            );

            return;
        }

        try {

            setLoading(true);

            const token =
                localStorage.getItem("token");

            if (!token) {

                toast.error(
                    "Your session has expired. Please login again."
                );

                router.push("/login");

                return;
            }

            // ========================================
            // Send Swap Request To Backend
            // ========================================

            const response = await createSwap(
                token,
                {
                    network,
                    phoneNumber: phone,
                    airtimeAmount: Number(amount),
                }
            );

            if (!response.success) {

                toast.error(
                    response.message ||
                    "Unable to submit airtime swap."
                );

                return;
            }

            // ========================================
            // Success
            // ========================================

            toast.success(
                "Airtime swap request submitted successfully."
            );

            toast.info(
                `Reference: ${response.data.reference}`
            );

            // Clear form

            setPhone("");
            setAmount("");
            setPin("");

            // Optional redirect to history

            setTimeout(() => {

                router.push(
                    "/airtime-swap/history"
                );

            }, 1200);

        } catch (error: any) {

            console.error(
                "Airtime Swap Error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Unable to process airtime swap."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <main className="min-h-full bg-slate-50">

            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

                {/* BACK */}

                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-green-600"
                >

                    <ArrowLeft size={17} />

                    Back

                </button>

                {/* HEADER */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    className="mb-8"
                >

                    <div className="flex items-center gap-4">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600">

                            <Repeat2 size={28} />

                        </div>

                        <div>

                            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">

                                Airtime Swap

                            </h1>

                            <p className="mt-1 text-sm text-slate-500 sm:text-base">

                                Convert your airtime into
                                cash securely.

                            </p>

                        </div>

                    </div>

                </motion.div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    {/* MAIN FORM */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 25,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        className="lg:col-span-2"
                    >

                        <form
                            onSubmit={handleSubmit}
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                        >

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">

                                    <Repeat2 size={20} />

                                </div>

                                <div>

                                    <h2 className="text-xl font-bold text-slate-900">

                                        Swap Airtime

                                    </h2>

                                    <p className="text-sm text-slate-500">

                                        Enter your airtime details.

                                    </p>

                                </div>

                            </div>

                            {/* NETWORK */}

                            <div className="mt-7">

                                <label className="mb-3 block text-sm font-semibold text-slate-700">

                                    Select Network

                                </label>

                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

                                    {networks.map(
                                        (item) => (

                                            <button
                                                key={item.value}
                                                type="button"
                                                onClick={() =>
                                                    setNetwork(
                                                        item.value
                                                    )
                                                }
                                                className={`relative rounded-2xl border-2 p-4 transition-all duration-200 ${network === item.value
                                                        ? "border-green-600 bg-green-50 shadow-md"
                                                        : "border-slate-200 bg-white hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
                                                    }`}
                                            >

                                                {network ===
                                                    item.value && (

                                                        <div className="absolute right-2 top-2">

                                                            <CheckCircle2
                                                                size={18}
                                                                className="text-green-600"
                                                            />

                                                        </div>

                                                    )}

                                                <div className="flex flex-col items-center">

                                                    <NetworkLogo
                                                        network={
                                                            item.value
                                                        }
                                                        size="lg"
                                                    />

                                                    <p
                                                        className={`mt-3 font-bold ${network ===
                                                                item.value
                                                                ? "text-green-700"
                                                                : "text-slate-800"
                                                            }`}
                                                    >

                                                        {item.name}

                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">

                                                        Mobile Network

                                                    </p>

                                                </div>

                                            </button>

                                        )
                                    )}

                                </div>

                            </div>

                            {/* PHONE */}

                            <div className="mt-7">

                                <label
                                    htmlFor="phone"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >

                                    Airtime Phone Number

                                </label>

                                <div className="relative">

                                    <Phone
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="phone"
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={11}
                                        placeholder="08012345678"
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-300 py-4 pl-12 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                        required
                                    />

                                </div>

                                <p className="mt-2 text-xs text-slate-400">

                                    Enter the number containing
                                    the airtime you want to swap.

                                </p>

                            </div>

                            {/* AMOUNT */}

                            <div className="mt-7">

                                <label className="mb-3 block text-sm font-semibold text-slate-700">

                                    Swap Amount

                                </label>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">

                                    {swapAmounts.map(
                                        (value) => (

                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() =>
                                                    setAmount(
                                                        String(value)
                                                    )
                                                }
                                                className={`rounded-xl border py-3 text-sm font-bold transition ${Number(amount) === value
                                                        ? "border-green-600 bg-green-50 text-green-700"
                                                        : "border-slate-200 text-slate-700 hover:border-green-400"
                                                    }`}
                                            >

                                                ₦
                                                {value.toLocaleString(
                                                    "en-NG"
                                                )}

                                            </button>

                                        )
                                    )}

                                </div>

                                <div className="relative mt-4">

                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-400">

                                        ₦

                                    </span>

                                    <input
                                        type="number"
                                        min="100"
                                        placeholder="Enter amount"
                                        value={amount}
                                        onChange={(e) =>
                                            setAmount(
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-300 py-4 pl-10 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                        required
                                    />

                                </div>

                            </div>

                            {/* CONVERSION */}

                            <div className="mt-6 rounded-2xl bg-green-50 p-5">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-sm text-slate-500">

                                            Airtime value

                                        </p>

                                        <p className="mt-1 text-xl font-bold text-slate-900">

                                            ₦
                                            {Number(
                                                amount || 0
                                            ).toLocaleString(
                                                "en-NG"
                                            )}

                                        </p>

                                    </div>

                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-green-600 shadow-sm">

                                        <ArrowDown size={19} />

                                    </div>

                                    <div className="text-right">

                                        <p className="text-sm text-slate-500">

                                            You receive

                                        </p>

                                        <p className="mt-1 text-xl font-extrabold text-green-700">

                                            ₦
                                            {cashValue.toLocaleString(
                                                "en-NG",
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}

                                        </p>

                                    </div>

                                </div>

                                <div className="mt-4 border-t border-green-100 pt-3">

                                    <p className="text-xs text-slate-500">

                                        Current swap rate:

                                        <span className="ml-1 font-bold text-green-700">

                                            {ratesLoading
                                                ? "Loading..."
                                                : currentRate
                                                    ? `${Number(
                                                        currentRate.rate
                                                    )}%`
                                                    : network
                                                        ? "Unavailable"
                                                        : "Select network"
                                            }

                                        </span>

                                    </p>

                                </div>

                            </div>

                            {/* PIN */}

                            <div className="mt-7">

                                <label
                                    htmlFor="pin"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >

                                    Transaction PIN

                                </label>

                                <div className="relative">

                                    <Lock
                                        size={19}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="pin"
                                        type="password"
                                        inputMode="numeric"
                                        maxLength={4}
                                        placeholder="••••"
                                        value={pin}
                                        onChange={(e) =>
                                            setPin(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    ""
                                                )
                                            )
                                        }
                                        className="w-full rounded-xl border border-slate-300 py-4 pl-12 pr-4 tracking-[0.5em] outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                        required
                                    />

                                </div>

                            </div>

                            {/* SUBMIT */}

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    ratesLoading ||
                                    !currentRate
                                }
                                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >

                                <Zap size={19} />

                                {loading
                                    ? "Processing..."
                                    : "Swap Airtime"}

                            </button>

                        </form>

                    </motion.div>

                    {/* RIGHT SIDE */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 20,
                        }}
                        animate={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            delay: 0.15,
                        }}
                        className="space-y-5"
                    >

                        {/* SELECTED NETWORK */}

                        {selectedNetwork ? (

                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                                <p className="text-sm font-semibold text-slate-500">

                                    Selected Network

                                </p>

                                <div className="mt-4 flex items-center gap-4">

                                    <NetworkLogo
                                        network={
                                            selectedNetwork.value
                                        }
                                        size="lg"
                                    />

                                    <div>

                                        <h2 className="text-xl font-bold text-slate-900">

                                            {selectedNetwork.name}

                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">

                                            Airtime swap enabled

                                        </p>

                                    </div>

                                </div>

                            </div>

                        ) : (

                            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center">

                                <Repeat2
                                    size={30}
                                    className="mx-auto text-slate-400"
                                />

                                <h2 className="mt-3 font-bold text-slate-800">

                                    Select a Network

                                </h2>

                                <p className="mt-1 text-sm text-slate-500">

                                    Choose your airtime network
                                    to continue.

                                </p>

                            </div>

                        )}

                        {/* SECURITY */}

                        <div className="rounded-3xl bg-gradient-to-br from-green-700 to-emerald-500 p-6 text-white shadow-lg">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">

                                <ShieldCheck size={25} />

                            </div>

                            <h2 className="mt-5 text-xl font-bold">

                                Secure Airtime Swap

                            </h2>

                            <p className="mt-2 text-sm leading-6 text-green-50">

                                Your transaction is protected
                                by your QuickTxn account and
                                transaction PIN.

                            </p>

                        </div>

                        {/* HOW IT WORKS */}

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                            <h2 className="text-lg font-bold text-slate-900">

                                How it works

                            </h2>

                            <div className="mt-5 space-y-5">

                                <div className="flex gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">

                                        1

                                    </div>

                                    <div>

                                        <p className="font-semibold text-slate-900">

                                            Select network

                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">

                                            Choose MTN, Glo, Airtel
                                            or 9mobile.

                                        </p>

                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">

                                        2

                                    </div>

                                    <div>

                                        <p className="font-semibold text-slate-900">

                                            Enter airtime details

                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">

                                            Provide the phone number
                                            and airtime amount.

                                        </p>

                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">

                                        3

                                    </div>

                                    <div>

                                        <p className="font-semibold text-slate-900">

                                            Receive cash

                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">

                                            Confirm with your PIN
                                            and receive the converted
                                            amount.

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </motion.div>

                </div>

            </div>

        </main>
    );
}