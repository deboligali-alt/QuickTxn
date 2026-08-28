"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { ArrowLeftRight } from "lucide-react";
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

    // Load banks + beneficiary
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

    // Auto verify account
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
        if (
            !bankCode ||
            !accountNumber ||
            !accountName ||
            !amount ||
            !pin
        ) {
            alert("Complete all fields");
            return;
        }

        try {
            setLoading(true);

            await api.post("/wallet/bank-transfer", {
                bankCode,
                accountNumber,
                accountName,
                amount: Number(amount),
                pin,
            });

            const save = window.confirm(
                `Transfer successful.\n\nDo you want to save ${accountName} as a beneficiary?`
            );

            if (save) {
                const selectedBank = banks.find(
                    (b) => b.code === bankCode
                );

                await api.post("/beneficiaries", {
                    accountName,
                    accountNumber,
                    bankName: selectedBank?.name || "",
                    bankCode,
                });
            }
            const selectedBank = banks.find(
                (b) => b.code === bankCode
            );

            sessionStorage.setItem(
                "last_transfer",
                JSON.stringify({
                    accountName,
                    accountNumber,
                    bankName: selectedBank?.name,
                    amount,
                })
            );

            sessionStorage.setItem("payment_success", "true");

            router.push("/transfer-success");
        } catch (error: any) {
            alert(error.response?.data?.message || "Transfer failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4 pb-24">
            <h1 className="mb-6 text-2xl font-bold">Bank Transfer</h1>

            <div className="rounded-3xl bg-gradient-to-br from-green-600 to-emerald-600 p-6 text-white">
                <div className="flex items-center gap-3">
                    <ArrowLeftRight size={28} />

                    <div>
                        <p className="text-sm text-green-100">Send Money</p>
                        <h2 className="text-xl font-bold">Fast & Secure</h2>
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
                        onChange={(e) => setBankCode(e.target.value)}
                        className="w-full rounded-2xl border bg-white p-4"
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
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full rounded-2xl border bg-white p-4"
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
                        className="w-full rounded-2xl border bg-gray-100 p-4 font-semibold text-green-700"
                        placeholder="Verified name"
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
                        className="w-full rounded-2xl border bg-white p-4 text-xl font-bold"
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
                        onChange={(e) => setPin(e.target.value)}
                        className="w-full rounded-2xl border bg-white p-4"
                        placeholder="****"
                    />
                </div>
            </div>

            <button
                onClick={transferMoney}
                disabled={loading}
                className="mt-8 w-full rounded-2xl bg-green-600 py-4 text-lg font-semibold text-white disabled:opacity-60"
            >
                {loading ? "Processing..." : "Transfer Money"}
            </button>
        </main>
    );
}