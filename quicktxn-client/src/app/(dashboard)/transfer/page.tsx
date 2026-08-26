"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { ArrowRightLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Bank {
    name: string;
    code: string;
}

export default function TransferPage() {
    const router = useRouter();

    const [banks, setBanks] = useState<Bank[]>([]);
    const [bankCode, setBankCode] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const res = await api.get("/wallet/banks");
                setBanks(res.data.data);
            } catch (error) {
                console.error("Failed to load banks:", error);
            }
        };

        fetchBanks();
    }, []);

    useEffect(() => {
        const resolve = async () => {
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

        resolve();
    }, [accountNumber, bankCode]);
    const continueTransfer = () => {
        if (!accountName || !amount) {
            alert("Complete all fields");
            return;
        }

        sessionStorage.setItem(
            "transferData",
            JSON.stringify({
                bankCode,
                accountNumber,
                accountName,
                amount,
            })
        );

        router.push("/bank-transfer");
    };

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4 pb-24">
            <h1 className="mb-6 text-2xl font-bold">
                Bank Transfer
            </h1>

            <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-600 p-6 text-white">
                <div className="flex items-center gap-3">
                    <ArrowRightLeft size={28} />

                    <div>
                        <p className="text-sm text-green-100">
                            Send Money
                        </p>

                        <h2 className="text-xl font-bold">
                            Fast & Secure
                        </h2>
                    </div>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Select Bank
                    </label>

                    <select
                        value={bankCode}
                        onChange={(e) =>
                            setBankCode(e.target.value)
                        }
                        className="w-full rounded-2xl border bg-white p-4 outline-none"
                    >
                        <option value="">
                            Choose Bank
                        </option>

                        {banks.map((bank) => (
                            <option
                                key={bank.code}
                                value={bank.code}
                            >
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
                        type="text"
                        maxLength={10}
                        value={accountNumber}
                        onChange={(e) =>
                            setAccountNumber(e.target.value)
                        }
                        placeholder="0123456789"
                        className="w-full rounded-2xl border bg-white p-4 outline-none"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Account Name
                    </label>

                    <input
                        readOnly
                        value={accountName}
                        placeholder="Recipient name"
                        className="w-full rounded-2xl border bg-gray-100 p-4 font-semibold text-green-700"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Amount
                    </label>

                    <input
                        type="number"
                        value={amount}
                        onChange={(e) =>
                            setAmount(e.target.value)
                        }
                        placeholder="₦0"
                        className="w-full rounded-2xl border bg-white p-4 text-2xl font-bold outline-none"
                    />
                </div>
            </div>

            <button
                onClick={continueTransfer}
                disabled={loading}
                className="mt-8 w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white disabled:opacity-60"
            >
                Continue
            </button>
        </main>
    );
}