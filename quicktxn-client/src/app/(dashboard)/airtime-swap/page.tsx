"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
    ArrowLeft,
    Upload,
    Repeat,
    Phone,
    Wallet,
} from "lucide-react";
import NetworkLogo from "@/components/ui/NetworkLogo";
import { toast } from "sonner";

const networks = ["MTN", "AIRTEL", "GLO", "9MOBILE"];

export default function AirtimeSwapPage() {
    const router = useRouter();

    const [network, setNetwork] = useState("MTN");
    const [phone, setPhone] = useState("");
    const [amount, setAmount] = useState("");
    const [screenshot, setScreenshot] = useState("");
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);

    // Convert image to Base64
    const handleImage = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);

        const reader = new FileReader();

        reader.onloadend = () => {
            setScreenshot(reader.result as string);
        };

        reader.readAsDataURL(file);
    };

    const submitSwap = async () => {
        if (!phone || !amount || !screenshot) {
            toast.error("Complete all fields");
            return;
        }

        try {
            setLoading(true);

            await api.post("/airtime-swap", {
                network,
                senderPhone: phone,
                amount: Number(amount),
                screenshot,
            });

            toast.success("Swap request submitted");

            router.push("/dashboard");
        } catch (err: any) {
            toast.error(
                err.response?.data?.message || "Submission failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-md p-4 pb-24">
                {/* Premium Back Button */}
                <button
                    onClick={() => router.back()}
                    className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition-all hover:bg-gray-100 hover:shadow-md active:scale-95"
                >
                    <ArrowLeft size={20} className="text-gray-700" />
                </button>

                {/* Header */}
                <div className="rounded-3xl bg-gradient-to-r from-pink-500 to-red-500 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <Repeat size={30} />
                        <div>
                            <p className="text-sm text-pink-100">
                                Convert Airtime
                            </p>
                            <h1 className="text-2xl font-bold">
                                Airtime to Cash
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-lg font-bold">
                        Swap Details
                    </h2>

                    <label className="mb-2 block text-sm font-medium">
                        Select Network
                    </label>

                    <div className="mb-5 grid grid-cols-2 gap-3">
                        {networks.map((item) => (
                            <button
                                key={item}
                                onClick={() => setNetwork(item)}
                                className={`rounded-2xl border-2 p-3 transition ${network === item
                                    ? "border-pink-500 bg-pink-50"
                                    : "border-gray-200"
                                    }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <NetworkLogo
                                        network={item}
                                        size="lg"
                                    />
                                    <span className="text-sm font-bold">
                                        {item}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>

                    <label className="mb-2 block text-sm font-medium">
                        Sender Phone
                    </label>

                    <div className="relative mb-4">
                        <Phone
                            size={18}
                            className="absolute left-4 top-4 text-gray-400"
                        />

                        <input
                            value={phone}
                            maxLength={11}
                            onChange={(e) =>
                                setPhone(
                                    e.target.value.replace(/\D/g, "")
                                )
                            }
                            placeholder="08012345678"
                            className="w-full rounded-xl border p-3 pl-11 outline-none focus:border-pink-500"
                        />
                    </div>

                    <label className="mb-2 block text-sm font-medium">
                        Airtime Amount
                    </label>

                    <div className="relative mb-4">
                        <Wallet
                            size={18}
                            className="absolute left-4 top-4 text-gray-400"
                        />

                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="₦1000"
                            className="w-full rounded-xl border p-3 pl-11 text-xl font-bold outline-none focus:border-pink-500"
                        />
                    </div>

                    <label className="mb-2 block text-sm font-medium">
                        Upload Airtime Receipt
                    </label>

                    <label className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-gray-300 p-6 transition hover:border-pink-500">
                        <Upload
                            size={30}
                            className="mb-2 text-gray-400"
                        />

                        <p className="text-sm font-medium">
                            {fileName || "Choose Screenshot"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            JPG, PNG or JPEG
                        </p>

                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImage}
                        />
                    </label>

                    {/* Preview */}
                    {screenshot && (
                        <img
                            src={screenshot}
                            alt="Receipt Preview"
                            className="mt-4 h-40 w-full rounded-xl object-cover"
                        />
                    )}

                    <button
                        onClick={submitSwap}
                        disabled={loading}
                        className="mt-6 w-full rounded-xl bg-pink-600 py-4 font-semibold text-white transition hover:bg-pink-700 disabled:opacity-60"
                    >
                        {loading
                            ? "Submitting..."
                            : "Submit Request"}
                    </button>
                </div>
            </div>
        </main>
    );
}