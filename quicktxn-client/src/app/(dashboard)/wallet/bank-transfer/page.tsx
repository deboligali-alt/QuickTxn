"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";

import {
    getBanks,
    resolveAccount,
    bankTransfer,
} from "@/services/wallet.service";

interface Bank {
    name: string;
    code: string;
}

export default function BankTransferPage() {
    const [banks, setBanks] = useState<Bank[]>([]);

    const [accountNumber, setAccountNumber] =
        useState("");

    const [bankCode, setBankCode] =
        useState("");

    const [accountName, setAccountName] =
        useState("");

    const [amount, setAmount] =
        useState("");

    const [pin, setPin] =
        useState("");

    const [loadingBanks, setLoadingBanks] =
        useState(true);

    const [resolving, setResolving] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    // ==============================
    // Load Banks
    // ==============================

    const loadBanks = useCallback(
        async () => {
            try {
                setLoadingBanks(true);
                setError("");

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    setError(
                        "Please login first."
                    );
                    return;
                }

                const response =
                    await getBanks(token);

                const bankData = response.data || [];

                const uniqueBanks = bankData.filter(
                    (bank: Bank, index: number, array: Bank[]) =>
                        index ===
                        array.findIndex(
                            (item) => item.code === bank.code
                        )
                );

                setBanks(uniqueBanks);

            } catch (error: unknown) {
                console.error(error);

                if (
                    axios.isAxiosError(error)
                ) {
                    setError(
                        error.response?.data
                            ?.message ||
                        "Unable to load banks."
                    );
                } else {
                    setError(
                        "Unable to load banks."
                    );
                }

            } finally {
                setLoadingBanks(false);
            }
        },
        []
    );

    useEffect(() => {
        loadBanks();
    }, [loadBanks]);


    // ==============================
    // Resolve Account
    // ==============================

    const handleResolveAccount =
        async () => {

            if (
                accountNumber.length !== 10
            ) {
                return;
            }

            if (!bankCode) {
                return;
            }

            try {
                setResolving(true);
                setAccountName("");
                setError("");

                const token =
                    localStorage.getItem("token");

                if (!token) {
                    setError(
                        "Please login first."
                    );
                    return;
                }

                const response =
                    await resolveAccount(
                        token,
                        accountNumber,
                        bankCode
                    );

                setAccountName(
                    response.data?.account_name ||
                    ""
                );

            } catch (error: unknown) {
                console.error(error);

                if (
                    axios.isAxiosError(error)
                ) {
                    setError(
                        error.response?.data
                            ?.message ||
                        "Unable to resolve account."
                    );
                } else {
                    setError(
                        "Unable to resolve account."
                    );
                }

            } finally {
                setResolving(false);
            }
        };


    // ==============================
    // Submit Transfer
    // ==============================

    const handleTransfer = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!bankCode) {
            setError(
                "Please select a bank."
            );
            return;
        }

        if (
            accountNumber.length !== 10
        ) {
            setError(
                "Enter a valid 10-digit account number."
            );
            return;
        }

        if (!accountName) {
            setError(
                "Please resolve the account first."
            );
            return;
        }

        if (
            Number(amount) <= 0
        ) {
            setError(
                "Enter a valid amount."
            );
            return;
        }

        if (pin.length !== 4) {
            setError(
                "Enter your 4-digit transaction PIN."
            );
            return;
        }

        try {
            setLoading(true);

            const token =
                localStorage.getItem("token");

            if (!token) {
                setError(
                    "Please login first."
                );
                return;
            }

            const response =
                await bankTransfer(
                    token,
                    {
                        accountNumber,
                        bankCode,
                        accountName,
                        amount: Number(amount),
                        pin,
                    }
                );

            setMessage(
                response.message ||
                "Bank transfer initiated successfully."
            );

            setAccountNumber("");
            setBankCode("");
            setAccountName("");
            setAmount("");
            setPin("");

        } catch (error: unknown) {
            console.error(error);

            if (
                axios.isAxiosError(error)
            ) {
                setError(
                    error.response?.data
                        ?.message ||
                    "Bank transfer failed."
                );
            } else {
                setError(
                    "Bank transfer failed."
                );
            }

        } finally {
            setLoading(false);
        }
    };


    return (
        <main className="min-h-screen bg-slate-50 p-6">

            <div className="mx-auto max-w-xl">

                <h1 className="text-3xl font-bold text-slate-900">
                    Bank Transfer
                </h1>

                <p className="mt-2 mb-8 text-slate-500">
                    Transfer money from your QuickTxn
                    wallet to a Nigerian bank account.
                </p>


                <form
                    onSubmit={handleTransfer}
                    className="space-y-6 rounded-2xl bg-white p-6 shadow-lg"
                >

                    {/* BANK */}

                    <div>

                        <label className="mb-2 block font-medium">
                            Bank
                        </label>

                        <select
                            value={bankCode}
                            onChange={(e) => {
                                setBankCode(
                                    e.target.value
                                );
                                setAccountName("");
                            }}
                            disabled={loadingBanks}
                            className="w-full rounded-xl border p-3"
                        >

                            <option value="">
                                {loadingBanks
                                    ? "Loading banks..."
                                    : "Select bank"}
                            </option>

                            {banks.map((bank, index) => (
                                <option
                                    key={`${bank.code}-${index}`}
                                    value={bank.code}
                                >
                                    {bank.name}
                                </option>
                            ))}


                        </select>

                    </div>


                    {/* ACCOUNT NUMBER */}

                    <div>

                        <label className="mb-2 block font-medium">
                            Account Number
                        </label>

                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={10}
                            value={accountNumber}
                            onChange={(e) => {
                                setAccountNumber(
                                    e.target.value.replace(
                                        /\D/g,
                                        ""
                                    )
                                );

                                setAccountName("");
                            }}
                            onBlur={
                                handleResolveAccount
                            }
                            placeholder="0123456789"
                            className="w-full rounded-xl border p-3 outline-none focus:border-green-500"
                            required
                        />

                        <p className="mt-2 text-xs text-slate-400">
                            Enter 10 digits and click outside
                            the field to resolve the account.
                        </p>

                    </div>


                    {/* ACCOUNT NAME */}

                    <div>

                        <label className="mb-2 block font-medium">
                            Account Name
                        </label>

                        <div className="rounded-xl bg-slate-100 p-3">

                            {resolving ? (
                                <span className="text-slate-500">
                                    Resolving account...
                                </span>
                            ) : accountName ? (
                                <span className="font-semibold text-green-700">
                                    {accountName}
                                </span>
                            ) : (
                                <span className="text-slate-400">
                                    Account name will appear here
                                </span>
                            )}

                        </div>

                    </div>


                    {/* AMOUNT */}

                    <div>

                        <label className="mb-2 block font-medium">
                            Amount
                        </label>

                        <input
                            type="number"
                            min="1"
                            value={amount}
                            onChange={(e) =>
                                setAmount(
                                    e.target.value
                                )
                            }
                            placeholder="5000"
                            className="w-full rounded-xl border p-3 outline-none focus:border-green-500"
                            required
                        />

                    </div>


                    {/* PIN */}

                    <div>

                        <label className="mb-2 block font-medium">
                            Transaction PIN
                        </label>

                        <input
                            type="password"
                            inputMode="numeric"
                            maxLength={4}
                            value={pin}
                            onChange={(e) =>
                                setPin(
                                    e.target.value.replace(
                                        /\D/g,
                                        ""
                                    )
                                )
                            }
                            placeholder="••••"
                            className="w-full rounded-xl border p-3 outline-none focus:border-green-500"
                            required
                        />

                    </div>


                    {/* ERROR */}

                    {error && (
                        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}


                    {/* SUCCESS */}

                    {message && (
                        <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">
                            {message}
                        </div>
                    )}


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        disabled={
                            loading ||
                            loadingBanks ||
                            resolving
                        }
                        className="w-full rounded-xl bg-green-600 p-4 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Processing..."
                            : "Transfer Money"}
                    </button>

                </form>

            </div>

        </main>
    );
}