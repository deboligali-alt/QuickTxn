"use client";

import { useEffect, useState } from "react";
import {
    CheckCircle2,
    XCircle,
    Eye,
    RefreshCw,
    ShieldCheck,
} from "lucide-react";
import api from "@/lib/axios";

interface KYC {
    id: string;
    full_name: string;
    email: string;
    document_type: string;
    document_number: string;
    document_image: string;
    status: string;
    created_at: string;
}

export default function KYCPage() {
    const [kyc, setKyc] = useState<KYC[]>([]);
    const [selected, setSelected] = useState<KYC | null>(null);

    const loadKYC = async () => {
        const res = await api.get("/admin/kyc");
        setKyc(res.data.data || []);
    };

    useEffect(() => {
        loadKYC();
    }, []);

    const approve = async (id: string) => {
        await api.patch(`/admin/kyc/${id}/approve`);
        loadKYC();
        setSelected(null);
    };

    const reject = async (id: string) => {
        await api.patch(`/admin/kyc/${id}/reject`);
        loadKYC();
        setSelected(null);
    };

    return (
        <main className="mx-auto max-w-7xl space-y-8 p-8">

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-4xl font-bold">
                        KYC Verification
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Review and verify user identity documents.
                    </p>
                </div>

                <button
                    onClick={loadKYC}
                    className="rounded-xl bg-green-600 p-3 text-white"
                >
                    <RefreshCw size={20} />
                </button>

            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow">

                <table className="min-w-full">

                    <thead className="bg-slate-100">
                        <tr>
                            <th className="px-5 py-4 text-left">
                                User
                            </th>
                            <th className="px-5 py-4 text-left">
                                Document
                            </th>
                            <th className="px-5 py-4 text-left">
                                Status
                            </th>
                            <th className="px-5 py-4 text-left">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>

                        {kyc.map((item) => (

                            <tr
                                key={item.id}
                                className="border-b hover:bg-slate-50"
                            >

                                <td className="px-5 py-5">

                                    <p className="font-semibold">
                                        {item.full_name}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {item.email}
                                    </p>

                                </td>

                                <td className="px-5 py-5">

                                    <p>{item.document_type}</p>

                                    <p className="text-sm text-slate-500">
                                        {item.document_number}
                                    </p>

                                </td>

                                <td className="px-5 py-5">

                                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                                        {item.status}
                                    </span>

                                </td>

                                <td className="px-5 py-5">

                                    <button
                                        onClick={() => setSelected(item)}
                                        className="rounded-lg bg-blue-600 p-2 text-white"
                                    >
                                        <Eye size={18} />
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {selected && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                    <div className="w-full max-w-2xl rounded-3xl bg-white p-6">

                        <div className="mb-6 flex items-center gap-3">

                            <ShieldCheck className="text-green-600" size={28} />

                            <h2 className="text-2xl font-bold">
                                Verify Identity
                            </h2>

                        </div>

                        <div className="space-y-3">

                            <p>
                                <strong>Name:</strong>{" "}
                                {selected.full_name}
                            </p>

                            <p>
                                <strong>Email:</strong>{" "}
                                {selected.email}
                            </p>

                            <p>
                                <strong>Document:</strong>{" "}
                                {selected.document_type}
                            </p>

                            <p>
                                <strong>Number:</strong>{" "}
                                {selected.document_number}
                            </p>

                        </div>

                        <img
                            src={selected.document_image}
                            className="mt-6 h-72 w-full rounded-xl object-cover"
                        />

                        <div className="mt-6 flex gap-3">

                            <button
                                onClick={() => approve(selected.id)}
                                className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white"
                            >
                                Approve
                            </button>

                            <button
                                onClick={() => reject(selected.id)}
                                className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white"
                            >
                                Reject
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </main>
    );
}