"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Trash2, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    getBeneficiaries,
    deleteBeneficiary,
} from "@/services/beneficiary.service";

interface Beneficiary {
    id: string;
    account_name: string;
    account_number: string;
    bank_name: string;
    bank_code: string;
    created_at?: string;
}

export default function BeneficiariesPage() {
    const router = useRouter();

    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [loading, setLoading] = useState(true);

    const loadBeneficiaries = async () => {
        try {
            const res = await getBeneficiaries();
            setBeneficiaries(res.data || []);
        } catch (error) {
            console.error("Failed to load beneficiaries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBeneficiaries();
    }, []);

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm(
            "Delete this beneficiary?"
        );

        if (!confirmed) return;

        try {
            await deleteBeneficiary(id);
            loadBeneficiaries();
        } catch (error) {
            console.error(error);
            alert("Unable to delete beneficiary.");
        }
    };

    const handleTransfer = (beneficiary: Beneficiary) => {
        sessionStorage.setItem(
            "beneficiary",
            JSON.stringify(beneficiary)
        );

        router.push("/bank-transfer");
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="mx-auto w-full max-w-4xl px-4 py-6">
                {/* Back */}
                <button
                    onClick={() => router.back()}
                    className="mb-5 flex items-center gap-2 text-gray-700"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {/* Title */}
                <h1 className="mb-6 text-3xl font-bold">
                    Beneficiaries
                </h1>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-24 animate-pulse rounded-2xl bg-white"
                            />
                        ))}
                    </div>
                ) : beneficiaries.length === 0 ? (
                    <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                        <UserRound
                            size={48}
                            className="mx-auto text-gray-300"
                        />
                        <h2 className="mt-4 text-lg font-semibold">
                            No Beneficiaries
                        </h2>
                        <p className="mt-2 text-gray-500">
                            Saved bank accounts will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {beneficiaries.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {item.account_name}
                                        </h3>

                                        <p className="text-sm text-gray-600">
                                            {item.bank_name}
                                        </p>

                                        <p className="mt-1 font-medium text-gray-500">
                                            {item.account_number}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => handleTransfer(item)}
                                    className="mt-5 w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
                                >
                                    Transfer
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}