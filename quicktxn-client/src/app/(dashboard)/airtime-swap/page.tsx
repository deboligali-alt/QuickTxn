"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Repeat2,
    Phone,
    Lock,
    ShieldCheck,
    CheckCircle2,
    ArrowDown,
    Zap,
    Upload,
    X,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import NetworkLogo from "@/components/ui/NetworkLogo";
import {
    createSwap,
    getRates,
} from "@/services/airtimeSwap.service";

const networks = [
    { name: "MTN", value: "MTN" },
    { name: "Glo", value: "GLO" },
    { name: "Airtel", value: "AIRTEL" },
    { name: "9mobile", value: "9MOBILE" },
];

const swapAmounts = [500, 1000, 2000, 5000, 10000];

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
    const [ratesLoading, setRatesLoading] = useState(true);

    const [rates, setRates] = useState<AirtimeRate[]>([]);

    // Receipt upload
    const [receipt, setReceipt] = useState<File | null>(null);
    const [preview, setPreview] = useState("");

    const selectedNetwork = networks.find(
        (n) => n.value === network
    );

    useEffect(() => {
        const loadRates = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    toast.error("Please login first.");
                    return;
                }

                const response = await getRates(token);

                if (response.success) {
                    setRates(response.data || []);
                } else {
                    toast.error(response.message);
                }
            } catch {
                toast.error("Unable to load airtime rates.");
            } finally {
                setRatesLoading(false);
            }
        };

        loadRates();
    }, []);

    const currentRate = rates.find(
        (r) => r.network === network
    );

    const swapRate = currentRate
        ? Number(currentRate.rate) / 100
        : 0;

    const cashValue =
        Number(amount || 0) * swapRate;

    const handleImage = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setReceipt(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (!network)
            return toast.error("Select network");

        if (phone.length !== 11)
            return toast.error("Invalid phone number");

        if (!amount || Number(amount) < 100)
            return toast.error(
                "Minimum amount is ₦100"
            );

        if (!receipt)
            return toast.error(
                "Upload airtime screenshot"
            );

        if (pin.length !== 4)
            return toast.error("Enter 4-digit PIN");

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                router.push("/login");
                return;
            }

            const response = await createSwap(token, {
                network,
                phoneNumber: phone,
                airtimeAmount: Number(amount),
            });

            if (!response.success) {
                toast.error(response.message);
                return;
            }

            toast.success(
                "Airtime swap submitted successfully"
            );

            setPhone("");
            setAmount("");
            setPin("");
            setReceipt(null);
            setPreview("");

            setTimeout(() => {
                router.push("/airtime-swap/history");
            }, 1200);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                "Swap failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-6xl px-4 py-5 pb-24">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-6 text-white shadow-lg"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                            <Repeat2 size={28} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold">
                                Airtime to Cash
                            </h1>

                            <p className="mt-1 text-sm text-green-100">
                                Convert unused airtime into cash instantly.
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* LEFT SIDE */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2"
                    >
                        <form
                            onSubmit={handleSubmit}
                            className="rounded-3xl bg-white p-6 shadow-sm"
                        >
                            <h2 className="text-lg font-bold text-gray-900">
                                Swap Details
                            </h2>

                            {/* Network */}
                            <div className="mt-6">
                                <label className="mb-3 block text-sm font-semibold text-gray-700">
                                    Select Network
                                </label>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {networks.map((item) => (
                                        <button
                                            key={item.value}
                                            type="button"
                                            onClick={() => setNetwork(item.value)}
                                            className={`rounded-2xl border-2 p-3 transition ${network === item.value
                                                ? "border-green-600 bg-green-50"
                                                : "border-gray-200 hover:border-green-300"
                                                }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                <NetworkLogo
                                                    network={item.value}
                                                    size="lg"
                                                />

                                                <p className="mt-2 text-sm font-bold">
                                                    {item.name}
                                                </p>

                                                {network === item.value && (
                                                    <CheckCircle2
                                                        size={18}
                                                        className="mt-1 text-green-600"
                                                    />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="mt-6">
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Airtime Phone Number
                                </label>

                                <div className="relative">
                                    <Phone
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="tel"
                                        value={phone}
                                        maxLength={11}
                                        inputMode="numeric"
                                        placeholder="08012345678"
                                        onChange={(e) =>
                                            setPhone(
                                                e.target.value.replace(/\D/g, "")
                                            )
                                        }
                                        className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 outline-none focus:border-green-600"
                                    />
                                </div>
                            </div>

                            {/* Amount */}
                            <div className="mt-6">
                                <label className="mb-3 block text-sm font-semibold text-gray-700">
                                    Airtime Amount
                                </label>

                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                                    {swapAmounts.map((value) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() =>
                                                setAmount(String(value))
                                            }
                                            className={`rounded-xl border py-2 text-sm font-bold ${Number(amount) === value
                                                ? "border-green-600 bg-green-50 text-green-700"
                                                : "border-gray-200"
                                                }`}
                                        >
                                            ₦{value.toLocaleString()}
                                        </button>
                                    ))}
                                </div>

                                <div className="relative mt-3">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-gray-400">
                                        ₦
                                    </span>

                                    <input
                                        type="number"
                                        min="100"
                                        value={amount}
                                        placeholder="Enter custom amount"
                                        onChange={(e) =>
                                            setAmount(e.target.value)
                                        }
                                        className="h-12 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-lg font-bold outline-none focus:border-green-600"
                                    />
                                </div>
                            </div>

                            {/* Live Conversion */}
                            <div className="mt-6 rounded-2xl bg-green-50 p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Airtime Value
                                        </p>

                                        <h3 className="mt-1 text-xl font-bold">
                                            ₦
                                            {Number(
                                                amount || 0
                                            ).toLocaleString()}
                                        </h3>
                                    </div>

                                    <div className="rounded-full bg-white p-2 shadow">
                                        <ArrowDown
                                            className="text-green-600"
                                            size={18}
                                        />
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">
                                            You'll Receive
                                        </p>

                                        <h3 className="mt-1 text-2xl font-bold text-green-700">
                                            ₦
                                            {cashValue.toLocaleString("en-NG", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </h3>
                                    </div>
                                </div>

                                <div className="mt-3 border-t border-green-100 pt-3 text-sm">
                                    Current Rate:
                                    <span className="ml-2 font-bold text-green-700">
                                        {ratesLoading
                                            ? "Loading..."
                                            : currentRate
                                                ? `${Number(
                                                    currentRate.rate
                                                )}%`
                                                : "--"}
                                    </span>
                                </div>
                            </div>

                            {/* Receipt Upload */}
                            <div className="mt-7">
                                <label className="mb-3 block text-sm font-semibold text-slate-700">
                                    Airtime Screenshot
                                </label>

                                {!preview ? (
                                    <label className="flex h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-300 bg-white transition hover:bg-green-50">
                                        <Upload
                                            size={34}
                                            className="mb-3 text-green-600"
                                        />

                                        <p className="font-semibold text-gray-700">
                                            Upload Airtime Receipt
                                        </p>

                                        <span className="mt-1 text-xs text-gray-500">
                                            PNG, JPG or JPEG
                                        </span>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImage}
                                        />
                                    </label>
                                ) : (
                                    <div className="relative overflow-hidden rounded-2xl border border-gray-200">
                                        <img
                                            src={preview}
                                            alt="Receipt Preview"
                                            className="h-56 w-full object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setReceipt(null);
                                                setPreview("");
                                            }}
                                            className="absolute right-3 top-3 rounded-full bg-black/70 p-2 text-white transition hover:bg-black"
                                        >
                                            <X size={16} />
                                        </button>

                                        <div className="bg-white px-4 py-3">
                                            <p className="truncate text-sm font-medium text-gray-700">
                                                {receipt?.name}
                                            </p>

                                            <p className="text-xs text-green-600">
                                                Receipt ready for upload
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* PIN */}
                            <div className="mt-7">
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Transaction PIN
                                </label>

                                <div className="relative">
                                    <Lock
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="password"
                                        value={pin}
                                        maxLength={4}
                                        inputMode="numeric"
                                        placeholder="Enter 4-digit PIN"
                                        onChange={(e) =>
                                            setPin(
                                                e.target.value.replace(/\D/g, "")
                                            )
                                        }
                                        className="h-12 w-full rounded-xl border border-gray-200 pl-11 pr-4 text-lg tracking-[0.4em] outline-none focus:border-green-600"
                                    />
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="mt-7 rounded-2xl bg-gray-50 p-5">
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-gray-500">
                                        Network
                                    </span>

                                    <span className="font-semibold">
                                        {selectedNetwork?.name || "--"}
                                    </span>
                                </div>

                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-gray-500">
                                        Phone
                                    </span>

                                    <span className="font-semibold">
                                        {phone || "--"}
                                    </span>
                                </div>

                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-gray-500">
                                        Airtime
                                    </span>

                                    <span className="font-semibold">
                                        ₦
                                        {Number(
                                            amount || 0
                                        ).toLocaleString()}
                                    </span>
                                </div>

                                <div className="border-t pt-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-600">
                                            Cash You Receive
                                        </span>

                                        <span className="text-xl font-bold text-green-700">
                                            ₦
                                            {cashValue.toLocaleString("en-NG", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-7 flex h-14 w-full items-center justify-center rounded-2xl bg-green-600 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                            >
                                {loading ? (
                                    "Submitting..."
                                ) : (
                                    <>
                                        <Repeat2
                                            size={20}
                                            className="mr-2"
                                        />
                                        Convert Airtime
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                    {/* RIGHT SIDE */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-5"
                    >
                        {/* Security Card */}
                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="rounded-xl bg-green-100 p-2">
                                    <ShieldCheck
                                        className="text-green-600"
                                        size={22}
                                    />
                                </div>

                                <div>
                                    <h3 className="font-bold">
                                        Secure Swap
                                    </h3>

                                    <p className="text-xs text-gray-500">
                                        Protected transaction
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2
                                        size={16}
                                        className="text-green-600"
                                    />
                                    <span>Encrypted requests</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <CheckCircle2
                                        size={16}
                                        className="text-green-600"
                                    />
                                    <span>Instant verification</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <CheckCircle2
                                        size={16}
                                        className="text-green-600"
                                    />
                                    <span>Admin approval system</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <CheckCircle2
                                        size={16}
                                        className="text-green-600"
                                    />
                                    <span>Cash paid to wallet</span>
                                </div>
                            </div>
                        </div>

                        {/* Current Rate */}
                        <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-500 p-5 text-white">
                            <div className="flex items-center gap-3">
                                <Zap size={24} />

                                <div>
                                    <p className="text-green-100 text-sm">
                                        Live Conversion
                                    </p>

                                    <h3 className="text-2xl font-bold">
                                        {ratesLoading
                                            ? "--"
                                            : currentRate
                                                ? `${Number(currentRate.rate)}%`
                                                : "--"}
                                    </h3>
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-green-100">
                                Rates are updated automatically by the
                                administrator.
                            </p>
                        </div>

                        {/* How it works */}
                        <div className="rounded-3xl bg-white p-5 shadow-sm">
                            <h3 className="mb-4 font-bold">
                                How it works
                            </h3>

                            <div className="space-y-4">
                                {[
                                    "Choose your airtime network",
                                    "Enter the airtime amount",
                                    "Upload your recharge screenshot",
                                    "Receive cash directly in your wallet",
                                ].map((step, index) => (
                                    <div
                                        key={step}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                                            {index + 1}
                                        </div>

                                        <p className="text-sm text-gray-600">
                                            {step}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </main>
    );
}