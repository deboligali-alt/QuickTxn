"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import {
    ShieldCheck,
    Search,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
} from "lucide-react";
import { toast } from "sonner";

interface KYC {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    bvn: string;
    id_type: string;
    id_image: string;
    selfie_image: string;
    status: "PENDING" | "VERIFIED" | "REJECTED";
    created_at: string;
}

export default function AdminKYCPage() {
    const [kycList, setKycList] = useState<KYC[]>([]);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<KYC | null>(null);
    const [loading, setLoading] = useState(true);

    const loadKYC = async () => {
        try {
            const res = await api.get("/admin/kyc");
            setKycList(res.data.data);
        } catch {
            toast.error("Unable to load KYC records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadKYC();
    }, []);

    const filtered = useMemo(() => {
        return kycList.filter((item) =>
            `${item.full_name} ${item.email} ${item.phone}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [kycList, search]);

    const stats = {
        pending: kycList.filter((x) => x.status === "PENDING").length,
        verified: kycList.filter((x) => x.status === "VERIFIED").length,
        rejected: kycList.filter((x) => x.status === "REJECTED").length,
    };

    const approve = async (id: string) => {
        try {
            await api.patch(`/admin/kyc/${id}/approve`);
            toast.success("KYC Approved");
            loadKYC();
            setSelected(null);
        } catch {
            toast.error("Approval failed");
        }
    };

    const reject = async (id: string) => {
        const reason = prompt("Reason for rejection") || "Rejected";

        try {
            await api.patch(`/admin/kyc/${id}/reject`, {
                reason,
            });

            toast.success("KYC Rejected");
            loadKYC();
            setSelected(null);
        } catch {
            toast.error("Rejection failed");
        }
    };

    if (loading) {
        return (
            <main className="p-8">
                <p>Loading KYC...</p>
            </main>
        );
    }

    return (
        <main className="space-y-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">
                    KYC Verification Center
                </h1>
                <p className="text-gray-500">
                    Review and approve customer identity verification.
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                    title="Pending"
                    value={stats.pending}
                    color="yellow"
                    icon={<Clock size={22} />}
                />

                <StatCard
                    title="Verified"
                    value={stats.verified}
                    color="green"
                    icon={<CheckCircle size={22} />}
                />

                <StatCard
                    title="Rejected"
                    value={stats.rejected}
                    color="red"
                    icon={<XCircle size={22} />}
                />
            </div>

            {/* Search */}
            <div className="relative">
                <Search
                    className="absolute left-4 top-3.5 text-gray-400"
                    size={18}
                />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, email or phone..."
                    className="w-full rounded-xl border bg-white py-3 pl-11 pr-4"
                />
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl bg-white shadow">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr className="text-left text-sm text-gray-600">
                            <th className="p-4">User</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((user) => (
                            <tr
                                key={user.id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="p-4">
                                    <p className="font-semibold">
                                        {user.full_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {user.email}
                                    </p>
                                </td>

                                <td>
                                    <StatusBadge status={user.status} />
                                </td>

                                <td className="text-sm">
                                    {new Date(
                                        user.created_at
                                    ).toLocaleDateString()}
                                </td>

                                <td>
                                    <button
                                        onClick={() => setSelected(user)}
                                        className="mr-3 text-green-600"
                                    >
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6">
                        <div className="mb-5 flex items-center gap-3">
                            <ShieldCheck
                                className="text-green-600"
                                size={28}
                            />
                            <div>
                                <h2 className="text-xl font-bold">
                                    {selected.full_name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {selected.email}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="mb-1 text-xs text-gray-500">
                                    BVN
                                </p>
                                <p className="font-semibold">
                                    {selected.bvn}
                                </p>
                            </div>

                            <div>
                                <p className="mb-1 text-xs text-gray-500">
                                    ID Type
                                </p>
                                <p className="font-semibold">
                                    {selected.id_type}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="mb-2 font-medium">
                                    Identity Card
                                </p>

                                <img
                                    src={selected.id_image}
                                    alt="ID"
                                    className="h-56 w-full rounded-xl border object-cover"
                                />
                            </div>

                            <div>
                                <p className="mb-2 font-medium">
                                    Selfie
                                </p>

                                <img
                                    src={selected.selfie_image}
                                    alt="Selfie"
                                    className="h-56 w-full rounded-xl border object-cover"
                                />
                            </div>
                        </div>

                        {selected.status === "PENDING" && (
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
                        )}

                        <button
                            onClick={() => setSelected(null)}
                            className="mt-3 w-full rounded-xl border py-3 font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}

function StatCard({
    title,
    value,
    color,
    icon,
}: any) {
    const colors: any = {
        green: "bg-green-50 text-green-600",
        yellow: "bg-yellow-50 text-yellow-600",
        red: "bg-red-50 text-red-600",
    };

    return (
        <div className="rounded-2xl bg-white p-5 shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">
                        {title}
                    </p>
                    <h2 className="mt-1 text-3xl font-bold">
                        {value}
                    </h2>
                </div>

                <div
                    className={`rounded-xl p-3 ${colors[color]}`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: any = {
        PENDING:
            "bg-yellow-100 text-yellow-700",
        VERIFIED:
            "bg-green-100 text-green-700",
        REJECTED: "bg-red-100 text-red-700",
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
        >
            {status}
        </span>
    );
}