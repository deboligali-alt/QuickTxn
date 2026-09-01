"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    ArrowLeft,
    ArrowLeftRight,
    CheckCircle2,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Bank {
    name: string;
    code: string;
}

interface Beneficiary {
    account_name: string;
    account_number: string;
    bank_code: string;
}

export default function BankTransferPage() {
    const router = useRouter();

    const [banks, setBanks] = useState<Bank[]>([]);
    const [bankCode, setBankCode] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [showReceipt, setShowReceipt] = useState(false);

    const [receipt, setReceipt] = useState({
        accountName: "",
        accountNumber: "",
        bankName: "",
        amount: 0,
        reference: "",
        date: "",
    });

    useEffect(() => {
        const loadBanks = async () => {
            try {
                const res = await api.get("/wallet/banks");
                setBanks(res.data.data || []);
            } catch (err) {
                console.error(err);
            }
        };

        loadBanks();

        const saved = sessionStorage.getItem("beneficiary");

        if (saved) {
            const beneficiary: Beneficiary = JSON.parse(saved);

            setAccountName(beneficiary.account_name);
            setAccountNumber(beneficiary.account_number);
            setBankCode(beneficiary.bank_code);

            sessionStorage.removeItem("beneficiary");
        }
    }, []);

    useEffect(() => {
        const verify = async () => {
            if (accountNumber.length !== 10 || !bankCode) return;

            try {
                const res = await api.post("/wallet/resolve-account", {
                    accountNumber,
                    bankCode,
                });

                setAccountName(res.data.data.account_name);
            } catch {
                setAccountName("");
            }
        };

        verify();
    }, [accountNumber, bankCode]);

    const transferMoney = async () => {
        setError("");

        if (
            !bankCode ||
            !accountNumber ||
            !accountName ||
            !amount ||
            !pin
        ) {
            setError("Please complete all fields.");
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/wallet/bank-transfer", {
                bankCode,
                accountNumber,
                accountName,
                amount: Number(amount),
                pin,
            });

            const selectedBank = banks.find(
                (b) => b.code === bankCode
            );

            sessionStorage.setItem("payment_success", "true");

            setReceipt({
                accountName,
                accountNumber,
                bankName: selectedBank?.name || "",
                amount: Number(amount),
                reference:
                    res.data.data?.reference ||
                    res.data.reference ||
                    `TRX-${Date.now()}`,
                date: new Date().toLocaleString(),
            });

            setShowReceipt(true);

            setAmount("");
            setPin("");
        } catch (error: any) {
            setError(
                error.response?.data?.message || "Transfer failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 px-4 py-5 pb-24">
            {/* Header */}
            <button
                onClick={() => router.back()}
                className="mb-4 flex items-center gap-2 text-sm text-gray-600"
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <h1 className="text-2xl font-bold text-gray-900">
                Bank Transfer
            </h1>

            <p className="mt-1 text-sm text-gray-500">
                Send money to any Nigerian bank securely.
            </p>

            {/* Hero */}
            <div className="mt-5 rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-5 text-white shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-white/20 p-3">
                        <ArrowLeftRight size={24} />
                    </div>

                    <div>
                        <p className="text-xs text-green-100">
                            Instant Transfer
                        </p>

                        <h2 className="text-lg font-bold">
                            Fast & Secure
                        </h2>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                    {error}
                </div>
            )}

            {/* Form */}
            <div className="mt-5 space-y-4 rounded-2xl bg-white p-4 shadow-sm">
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Select Bank
                    </label>

                    <select
                        value={bankCode}
                        onChange={(e) => setBankCode(e.target.value)}
                        className="h-12 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-green-600"
                    >
                        <option value="">Choose Bank</option>

                        {banks.map((bank) => (
                            <option key={bank.code} value={bank.code}>
                                {bank.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Account Number
                    </label>

                    <input
                        value={accountNumber}
                        maxLength={10}
                        onChange={(e) =>
                            setAccountNumber(
                                e.target.value.replace(/\D/g, "")
                            )
                        }
                        className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-green-600"
                        placeholder="0123456789"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Account Name
                    </label>

                    <input
                        readOnly
                        value={accountName}
                        className="h-12 w-full rounded-xl border border-green-100 bg-green-50 px-4 text-sm font-semibold text-green-700"
                        placeholder="Verified account name"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Amount
                    </label>

                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="h-12 w-full rounded-xl border border-gray-200 px-4 text-lg font-bold outline-none focus:border-green-600"
                        placeholder="₦0"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Transaction PIN
                    </label>

                    <input
                        type="password"
                        maxLength={4}
                        value={pin}
                        onChange={(e) =>
                            setPin(e.target.value.replace(/\D/g, ""))
                        }
                        className="h-12 w-full rounded-xl border border-gray-200 px-4 text-center text-lg tracking-[8px] outline-none focus:border-green-600"
                        placeholder="••••"
                    />
                </div>
            </div>

            <button
                onClick={transferMoney}
                disabled={loading}
                className="mt-5 h-12 w-full rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
            >
                {loading ? "Processing..." : "Transfer Money"}
            </button>

            {/* Success Receipt */}
            {showReceipt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowReceipt(false)}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="rounded-full bg-green-100 p-3">
                                <CheckCircle2
                                    size={42}
                                    className="text-green-600"
                                />
                            </div>

                            <h2 className="mt-3 text-xl font-bold text-gray-900">
                                Transfer Successful
                            </h2>

                            <p className="text-sm text-gray-500">
                                Your transfer has been completed.
                            </p>

                            <h1 className="mt-4 text-3xl font-bold text-green-600">
                                ₦{receipt.amount.toLocaleString()}
                            </h1>
                        </div>

                        <div className="mt-6 space-y-3 rounded-2xl bg-gray-50 p-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">
                                    Recipient
                                </span>
                                <span className="font-semibold">
                                    {receipt.accountName}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">
                                    Account
                                </span>
                                <span>{receipt.accountNumber}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">
                                    Bank
                                </span>
                                <span>{receipt.bankName}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">
                                    Reference
                                </span>
                                <span className="text-xs font-medium">
                                    {receipt.reference}
                                </span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">
                                    Date
                                </span>
                                <span className="text-xs">
                                    {receipt.date}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setShowReceipt(false);
                                router.push("/dashboard");
                            }}
                            className="mt-6 w-full rounded-xl bg-green-600 py-3 font-semibold text-white"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}