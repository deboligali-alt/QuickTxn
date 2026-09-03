"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    Eye,
    Shield,
    KeyRound,
    Lock,
    Trash2,
    Users,
    Wallet,
    Smartphone,
    ArrowLeftRight,
} from "lucide-react";

import {
    getAllUsers,
    getUser,
    toggleUserStatus,
    resetUserPin,
    resetPassword,
    deleteUser,
} from "@/services/adminUser.service";

interface User {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    role: string;
    balance: number;
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
    total_transactions?: number;
    total_airtime_swaps?: number;
    total_data_purchases?: number;
}

interface UserDetails extends User {
    total_transactions: number;
    total_airtime_swaps: number;
    total_data_purchases: number;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] =
        useState<UserDetails | null>(null);

    // NEW RESPONSE STATE
    const [status, setStatus] = useState<
        "SUCCESS" | "FAILED" | "PENDING" | ""
    >("");

    const [message, setMessage] = useState("");

    const router = useRouter();

    const loadUsers = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await getAllUsers(token);
            setUsers(response.users);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleView = async (id: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await getUser(token, id);
            setSelectedUser(response.data);
        } catch (error: any) {
            setStatus("FAILED");
            setMessage(
                error.response?.data?.message ||
                "Unable to load user."
            );
        }
    };

    const handleStatus = async (id: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            setStatus("PENDING");
            setMessage("Updating user status...");

            const res = await toggleUserStatus(token, id);

            setStatus("SUCCESS");
            setMessage(res.message);

            loadUsers();
        } catch (error: any) {
            setStatus("FAILED");
            setMessage(
                error.response?.data?.message ||
                "Unable to update user status."
            );
        }
    };

    const handleResetPin = async (id: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            setStatus("PENDING");
            setMessage("Resetting transaction PIN...");

            const res = await resetUserPin(token, id);

            setStatus("SUCCESS");
            setMessage(res.message);
        } catch (error: any) {
            setStatus("FAILED");
            setMessage(
                error.response?.data?.message ||
                "Unable to reset PIN."
            );
        }
    };

    const handleResetPassword = async (id: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            setStatus("PENDING");
            setMessage("Generating password reset token...");

            const res = await resetPassword(token, id);

            setStatus("SUCCESS");
            setMessage(res.message);
        } catch (error: any) {
            setStatus("FAILED");
            setMessage(
                error.response?.data?.message ||
                "Unable to reset password."
            );
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Deactivate this user?")) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            setStatus("PENDING");
            setMessage("Deactivating user...");

            const res = await deleteUser(token, id);

            setStatus("SUCCESS");
            setMessage(res.message);

            loadUsers();
            setSelectedUser(null);
        } catch (error: any) {
            setStatus("FAILED");
            setMessage(
                error.response?.data?.message ||
                "Unable to deactivate user."
            );
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.full_name
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            user.email
                .toLowerCase()
                .includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-8 text-center text-lg">
                Loading users...
            </div>
        );

    }

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="rounded-lg bg-white p-2 shadow hover:bg-gray-100"
                    >
                        <ArrowLeftRight size={20} />
                    </button>

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            User Management
                        </h1>
                        <p className="text-gray-500">
                            Manage all registered QuickTxn users
                        </p>
                    </div>
                </div>

                {/* Backend Response Message */}
                {message && (
                    <div
                        className={`mb-5 rounded-xl border px-4 py-3 text-sm font-medium ${status === "SUCCESS"
                                ? "border-green-200 bg-green-50 text-green-700"
                                : status === "FAILED"
                                    ? "border-red-200 bg-red-50 text-red-700"
                                    : "border-yellow-200 bg-yellow-50 text-yellow-700"
                            }`}
                    >
                        {message}
                    </div>
                )}

                {/* Search */}
                <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-3.5 text-gray-400"
                            size={18}
                        />

                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-green-500"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-600">
                                <tr>
                                    <th className="px-5 py-4">User</th>
                                    <th className="px-5 py-4">Balance</th>
                                    <th className="px-5 py-4">Status</th>
                                    <th className="px-5 py-4">Role</th>
                                    <th className="px-5 py-4">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-t border-gray-100 hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-4">
                                            <div>
                                                <p className="font-semibold">
                                                    {user.full_name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 font-semibold text-green-600">
                                            ₦{Number(user.balance).toLocaleString()}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${user.is_active
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {user.is_active ? "Active" : "Blocked"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                {user.role}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => handleView(user.id)}
                                                className="rounded-lg bg-green-50 p-2 text-green-700 hover:bg-green-100"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* User Details Modal */}
                {selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-bold">User Details</h2>

                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="text-2xl text-gray-400"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-xl bg-gray-50 p-4">
                                    <p className="font-bold">
                                        {selectedUser.full_name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {selectedUser.email}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {selectedUser.phone}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-green-50 p-4">
                                        <Wallet className="mb-2 text-green-600" />
                                        <p className="text-xs text-gray-500">Balance</p>
                                        <p className="font-bold text-green-700">
                                            ₦{Number(selectedUser.balance).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-blue-50 p-4">
                                        <Users className="mb-2 text-blue-600" />
                                        <p className="text-xs text-gray-500">
                                            Transactions
                                        </p>
                                        <p className="font-bold">
                                            {selectedUser.total_transactions}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-purple-50 p-4">
                                        <Smartphone className="mb-2 text-purple-600" />
                                        <p className="text-xs text-gray-500">
                                            Data Purchases
                                        </p>
                                        <p className="font-bold">
                                            {selectedUser.total_data_purchases}
                                        </p>
                                    </div>

                                    <div className="rounded-xl bg-orange-50 p-4">
                                        <ArrowLeftRight className="mb-2 text-orange-600" />
                                        <p className="text-xs text-gray-500">
                                            Airtime Swaps
                                        </p>
                                        <p className="font-bold">
                                            {selectedUser.total_airtime_swaps}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <button
                                        onClick={() => handleStatus(selectedUser.id)}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                                    >
                                        <Shield size={18} />
                                        {selectedUser.is_active
                                            ? "Block User"
                                            : "Activate User"}
                                    </button>

                                    <button
                                        onClick={() => handleResetPin(selectedUser.id)}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-semibold text-white hover:bg-amber-600"
                                    >
                                        <KeyRound size={18} />
                                        Reset Transaction PIN
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleResetPassword(selectedUser.id)
                                        }
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700"
                                    >
                                        <Lock size={18} />
                                        Reset Password
                                    </button>

                                    <button
                                        onClick={() => handleDelete(selectedUser.id)}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700"
                                    >
                                        <Trash2 size={18} />
                                        Deactivate User
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}