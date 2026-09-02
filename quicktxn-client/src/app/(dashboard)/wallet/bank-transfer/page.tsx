"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { ArrowLeft, ArrowLeftRight, CheckCircle2, XCircle, Loader2 } from "lucide-react";
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
    const [search, setSearch] = useState("");
    const [showBanks, setShowBanks] = useState(false);

    const [bankCode, setBankCode] = useState("");
    const [bankName, setBankName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [amount, setAmount] = useState("");
    const [pin, setPin] = useState("");

    const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState<"SUCCESS" | "FAILED" | null>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadBanks = async () => {
            try {
                const res = await api.get("/wallet/banks");
                setBanks(res.data.data || []);
            } catch { }
        };

        loadBanks();

        const saved = sessionStorage.getItem("beneficiary");

        if (saved) {
            const b: Beneficiary = JSON.parse(saved);

            setAccountName(b.account_name);
            setAccountNumber(b.account_number);
            setBankCode(b.bank_code);

            const bank = banks.find((x) => x.code === b.bank_code);

            if (bank) setBankName(bank.name);

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

    const filteredBanks = banks.filter((bank) =>
        bank.name.toLowerCase().includes(search.toLowerCase())
    );

    const transferMoney = async () => {
        setStatus(null);
        setMessage("");

        if (
            !bankCode ||
            !accountNumber ||
            !accountName ||
            !amount ||
            !pin
        ) {
            setStatus("FAILED");
            setMessage("Please complete all fields.");
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

            setStatus("SUCCESS");
            setMessage(res.data.message);

            sessionStorage.setItem("payment_success", "true");
            sessionStorage.setItem(
                "last_transfer",
                JSON.stringify({
                    accountName,
                    accountNumber,
                    bankName,
                    amount,
                    reference: res.data.data.reference,
                })
            );

            setTimeout(() => {
                router.replace("/transfer-success");
            }, 1800);
        } catch (err: any) {
            setStatus("FAILED");
            setMessage(err.response?.data?.message || "Transfer failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 px-4 py-5 pb-24">
            <button
                onClick={() => router.back()}
                className="mb-4 flex items-center gap-2 text-sm text-gray-600"
            >
                <ArrowLeft size={18} />
                Back
            </button>

            <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-500 p-5 text-white">
                <div className="flex items-center gap-3">
                    <ArrowLeftRight size={26} />
                    <div>
                        <p className="text-xs text-green-100">QuickTxn</p>
                        <h1 className="text-xl font-bold">Bank Transfer</h1>
                    </div>
                </div>
            </div>

            {status === "SUCCESS" && (
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
                    <CheckCircle2 size={22} />
                    <div>
                        <p className="font-semibold">Transfer Successful</p>
                        <p className="text-sm">{message}</p>
                    </div>
                </div>
            )}

            {status === "FAILED" && (
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                    <XCircle size={22} />
                    <div>
                        <p className="font-semibold">Transfer Failed</p>
                        <p className="text-sm">{message}</p>
                    </div>
                </div>
            )}

            <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-semibold">
                        Select Bank
                    </label>

                    <input
                        value={search}
                        onFocus={() => setShowBanks(true)}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setShowBanks(true);
                        }}
                        placeholder="Search bank..."
                        className="h-12 w-full rounded-xl border px-4 outline-none focus:border-green-600"
                    />

                    {showBanks && (
                        <div className="mt-2 max-h-56 overflow-y-auto rounded-xl border bg-white">
                            {filteredBanks.map((bank) => (
                                <button
                                    key={bank.code}
                                    onClick={() => {
                                        setBankCode(bank.code);
                                        setBankName(bank.name);
                                        setSearch(bank.name);
                                        setShowBanks(false);
                                    }}
                                    className="block w-full border-b px-4 py-3 text-left text-sm hover:bg-green-50 last:border-0"
                                >
                                    {bank.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold">
                        Account Number
                    </label>

                    <input
                        maxLength={10}
                        value={accountNumber}
                        onChange={(e) =>
                            setAccountNumber(e.target.value.replace(/\D/g, ""))
                        }
                        className="h-12 w-full rounded-xl border px-4 outline-none focus:border-green-600"
                        placeholder="0123456789"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold">
                        Account Name
                    </label>

                    <input
                        readOnly
                        value={accountName}
                        className="h-12 w-full rounded-xl border border-green-200 bg-green-50 px-4 font-semibold text-green-700"
                        placeholder="Verified account name"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold">
                        Amount
                    </label>

                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="h-12 w-full rounded-xl border px-4 text-lg font-bold outline-none focus:border-green-600"
                        placeholder="₦0"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold">
                        Transaction PIN
                    </label>

                    <input
                        type="password"
                        maxLength={4}
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                        className="h-12 w-full rounded-xl border px-4 text-center tracking-[8px] outline-none focus:border-green-600"
                        placeholder="••••"
                    />
                </div>
            </div>

            <button
                onClick={transferMoney}
                disabled={loading}
                className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-green-600 font-semibold text-white disabled:opacity-60"
            >
                {loading ? (
                    <>
                        <Loader2 size={18} className="mr-2 animate-spin" />
                        Processing...
                    </>
                ) : (
                    "Transfer Money"
                )}
            </button>
        </main>
    );
}