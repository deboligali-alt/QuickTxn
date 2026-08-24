"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
    Building2,
    CreditCard,
    Search,
    Trash2,
    Plus,
    User,
    RefreshCcw,
    ShieldCheck,
    X,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import {
    getBeneficiaries,
    deleteBeneficiary,
} from "@/services/beneficiary.service";

interface Beneficiary {
    id: string;
    account_name: string;
    bank_name: string;
    account_number: string;
}

export default function BeneficiariesPage() {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const loadBeneficiaries = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please login first.");
                return;
            }

            const response = await getBeneficiaries(token);

            setBeneficiaries(response.data || []);
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ||
                    "Unable to load beneficiaries."
                );
            } else {
                toast.error("Unable to load beneficiaries.");
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadBeneficiaries();
    }, [loadBeneficiaries]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadBeneficiaries();
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login first.");
            return;
        }

        try {
            setDeleting(true);

            await deleteBeneficiary(token, deleteId);

            toast.success("Beneficiary deleted successfully.");

            setBeneficiaries((current) =>
                current.filter(
                    (beneficiary) => beneficiary.id !== deleteId
                )
            );

            setDeleteId(null);
        } catch (error: unknown) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.message ||
                    "Unable to delete beneficiary."
                );
            } else {
                toast.error("Unable to delete beneficiary.");
            }
        } finally {
            setDeleting(false);
        }
    };

    const filteredBeneficiaries = beneficiaries.filter(
        (beneficiary) =>
            beneficiary.account_name
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            beneficiary.bank_name
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            beneficiary.account_number.includes(search)
    );

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 p-6">
                <div className="mx-auto max-w-6xl">
                    <div className="animate-pulse space-y-6">
                        <div className="h-10 w-64 rounded-xl bg-slate-200" />
                        <div className="h-5 w-96 rounded-lg bg-slate-200" />

                        <div className="grid gap-5 md:grid-cols-2">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="h-40 rounded-3xl bg-white shadow-sm"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-green-600">
                            QuickTxn
                        </p>

                        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                            Beneficiaries
                        </h1>

                        <p className="mt-2 text-sm text-slate-500 sm:text-base">
                            Manage your saved bank accounts for faster
                            transfers.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCcw
                                size={17}
                                className={
                                    refreshing
                                        ? "animate-spin"
                                        : ""
                                }
                            />

                            Refresh
                        </button>

                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
                        >
                            <Plus size={18} />

                            Add Beneficiary
                        </button>
                    </div>
                </motion.div>

                {/* STATISTICS */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-4">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                <UsersIcon />
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Saved Beneficiaries
                                </p>

                                <p className="mt-1 text-2xl font-extrabold text-slate-900">
                                    {beneficiaries.length}
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-4">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <Building2 size={21} />
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Search Results
                                </p>

                                <p className="mt-1 text-2xl font-extrabold text-slate-900">
                                    {filteredBeneficiaries.length}
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
                        <div className="flex items-center gap-4">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                <ShieldCheck size={21} />
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Account Security
                                </p>

                                <p className="mt-1 font-bold text-green-700">
                                    Protected
                                </p>
                            </div>

                        </div>
                    </div>

                </div>

                {/* SEARCH */}
                <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="relative">

                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search by name, bank or account number..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                        />

                    </div>
                </div>

                {/* BENEFICIARIES */}
                {filteredBeneficiaries.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm"
                    >
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                            <CreditCard size={30} />
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            {search
                                ? "No beneficiaries found"
                                : "No saved beneficiaries"}
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            {search
                                ? "Try searching with another name, bank or account number."
                                : "Your saved bank accounts will appear here when you add a beneficiary."}
                        </p>

                        {!search && (
                            <button
                                type="button"
                                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
                            >
                                <Plus size={18} />

                                Add Beneficiary
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2">

                        {filteredBeneficiaries.map(
                            (beneficiary, index) => (
                                <motion.div
                                    key={beneficiary.id}
                                    initial={{
                                        opacity: 0,
                                        y: 20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        delay: index * 0.05,
                                    }}
                                    className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >

                                    <div className="flex items-start justify-between">

                                        <div className="flex items-center gap-4">

                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                                                <User size={22} />
                                            </div>

                                            <div>
                                                <h2 className="font-bold text-slate-900">
                                                    {
                                                        beneficiary.account_name
                                                    }
                                                </h2>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {
                                                        beneficiary.bank_name
                                                    }
                                                </p>
                                            </div>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDeleteId(
                                                    beneficiary.id
                                                )
                                            }
                                            className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                                            title="Delete beneficiary"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                    </div>

                                    <div className="mt-6 rounded-2xl bg-slate-50 p-4">

                                        <div className="flex items-center justify-between">

                                            <div>
                                                <p className="text-xs font-medium text-slate-400">
                                                    Account Number
                                                </p>

                                                <p className="mt-1 font-bold tracking-wider text-slate-800">
                                                    {
                                                        beneficiary.account_number
                                                    }
                                                </p>
                                            </div>

                                            <CreditCard
                                                size={22}
                                                className="text-slate-300"
                                            />

                                        </div>

                                    </div>

                                    <div className="mt-5 flex items-center justify-between">

                                        <span className="flex items-center gap-2 text-xs font-medium text-green-600">
                                            <ShieldCheck size={15} />
                                            Verified beneficiary
                                        </span>

                                        <button
                                            type="button"
                                            className="text-sm font-semibold text-green-600 hover:text-green-700"
                                        >
                                            Use for transfer →
                                        </button>

                                    </div>

                                </motion.div>
                            )
                        )}

                    </div>
                )}

            </div>

            {/* DELETE MODAL */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">

                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
                    >

                        <div className="flex items-start justify-between">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                                <Trash2 size={22} />
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteId(null)
                                }
                                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <h2 className="mt-6 text-2xl font-bold text-slate-900">
                            Delete beneficiary?
                        </h2>

                        <p className="mt-2 leading-6 text-slate-500">
                            This beneficiary will be removed from
                            your saved accounts. You can add the
                            account again later.
                        </p>

                        <div className="mt-7 flex gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteId(null)
                                }
                                disabled={deleting}
                                className="flex-1 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleting && (
                                    <RefreshCcw
                                        size={17}
                                        className="animate-spin"
                                    />
                                )}

                                {deleting
                                    ? "Deleting..."
                                    : "Delete"}
                            </button>

                        </div>

                    </motion.div>

                </div>
            )}
        </main>
    );
}

function UsersIcon() {
    return (
        <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}