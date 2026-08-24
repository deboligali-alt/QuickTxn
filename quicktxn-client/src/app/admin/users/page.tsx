"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";

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

    // Dashboard totals (optional)
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

          

        } catch (error) {

            console.error(error);

        }

    };
    const handleStatus = async (id: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        await toggleUserStatus(token, id);
        loadUsers();
    };

    const handleResetPin = async (id: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        await resetUserPin(token, id);
        alert("Transaction PIN reset successfully.");
    };

    const handleResetPassword = async (id: string) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        await resetPassword(token, id);
        alert("Password reset token generated.");
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Deactivate this user?")) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        await deleteUser(token, id);
        loadUsers();
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
        <main className="mx-auto max-w-7xl p-8">

            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                    <h1 className="text-3xl font-bold">
                        User Management
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage all registered QuickTxn users.
                    </p>
                </div>

                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600 md:w-80"
                />

            </div>

            {/* Top Statistics */}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-2xl bg-white p-5 shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Total Users</p>
                            <h2 className="mt-2 text-3xl font-bold">
                                {users.length}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-green-100 p-3 text-green-700">
                            <Users size={24} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Wallet Balance</p>
                            <h2 className="mt-2 text-2xl font-bold">
                                ₦{users
                                    .reduce((sum, user) => sum + Number(user.balance), 0)
                                    .toLocaleString("en-NG")}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                            <Wallet size={24} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Transactions</p>
                            <h2 className="mt-2 text-3xl font-bold">
                                {users.reduce(
                                    (sum, user) => sum + (user.total_transactions ?? 0)
                                    , 0
                                )}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                            <ArrowLeftRight size={24} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm">Airtime Swaps</p>
                            <h2 className="mt-2 text-3xl font-bold">
                                {users.reduce(
                                    (sum, user) => sum + (user.total_airtime_swaps ?? 0)
                                    , 0
                                )}
                            </h2>
                        </div>

                        <div className="rounded-xl bg-yellow-100 p-3 text-yellow-700">
                            <Smartphone size={24} />
                        </div>
                    </div>
                </div>

            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow">

                <div className="overflow-x-auto">

                    <table className="min-w-full">

                        <thead className="bg-slate-100">

                            <tr>
                                <th className="px-6 py-4 text-left">
                                    Name
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Email
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Phone
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Role
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Balance
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Verified
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-left">
                                    Joined
                                </th>

                                <th className="px-6 py-4 text-center">
                                    Actions
                                </th>

                            </tr>

                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="py-10 text-center text-slate-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b hover:bg-slate-50 transition"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-700">
                                                    {user.full_name.charAt(0).toUpperCase()}
                                                </div>

                                                <div>
                                                    <p className="font-semibold">{user.full_name}</p>
                                                    <p className="text-sm text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 text-slate-600">
                                            {user.email}
                                        </td>

                                        <td className="px-6 py-5">
                                            {user.phone}
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                {user.role}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5 font-semibold text-green-600">
                                            ₦{Number(user.balance).toLocaleString("en-NG")}
                                        </td>

                                        <td className="px-6 py-5">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${user.is_verified
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {user.is_verified ? "Verified" : "Pending"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${user.is_active
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {user.is_active ? "Active" : "Suspended"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5 text-slate-500">
                                            {new Date(user.created_at).toLocaleDateString("en-NG")}
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleView(user.id)}
                                                    className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                <button
                                                    onClick={() => handleStatus(user.id)}
                                                    className={`rounded-lg p-2 text-white ${user.is_active
                                                        ? "bg-yellow-500 hover:bg-yellow-600"
                                                        : "bg-green-600 hover:bg-green-700"
                                                        }`}
                                                >
                                                    <Shield size={16} />
                                                </button>

                                                <button
                                                    onClick={() => handleResetPin(user.id)}
                                                    className="rounded-lg bg-purple-600 p-2 text-white hover:bg-purple-700"
                                                >
                                                    <KeyRound size={16} />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>

                    </table>

                </div>

            </div>
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">

                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-8 text-white">
                            <div className="flex items-center gap-4">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold">
                                    {selectedUser.full_name.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <h2 className="text-3xl font-bold">
                                        {selectedUser.full_name}
                                    </h2>

                                    <p className="text-green-100">
                                        {selectedUser.email}
                                    </p>

                                    <div className="mt-3 flex gap-2">
                                        <span className="rounded-full bg-white/20 px-3 py-1 text-sm">
                                            {selectedUser.role}
                                        </span>

                                        <span
                                            className={`rounded-full px-3 py-1 text-sm ${selectedUser.is_active
                                                ? "bg-green-200 text-green-900"
                                                : "bg-red-200 text-red-900"
                                                }`}
                                        >
                                            {selectedUser.is_active ? "Active" : "Suspended"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="space-y-6 p-6">

                            <div className="grid gap-4 md:grid-cols-2">

                                <Info
                                    label="Phone Number"
                                    value={selectedUser.phone}
                                />

                                <Info
                                    label="Wallet Balance"
                                    value={`₦${Number(selectedUser.balance).toLocaleString("en-NG")}`}
                                />

                                <Info
                                    label="Transactions"
                                    value={selectedUser.total_transactions ?? 0}
                                />

                                <Info
                                    label="Airtime Swaps"
                                    value={selectedUser.total_airtime_swaps ?? 0}
                                />

                                <Info
                                    label="Data Purchases"
                                    value={selectedUser.total_data_purchases ?? 0}
                                />

                                <Info
                                    label="Joined"
                                    value={new Date(
                                        selectedUser.created_at
                                    ).toLocaleDateString("en-NG")}
                                />

                            </div>

                            {/* Quick Actions */}
                            <div className="grid gap-3 md:grid-cols-2">

                                <button
                                    onClick={() => handleResetPin(selectedUser.id)}
                                    className="rounded-xl bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700"
                                >
                                    Reset PIN
                                </button>

                                <button
                                    onClick={() => handleResetPassword(selectedUser.id)}
                                    className="rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                                >
                                    Reset Password
                                </button>

                                <button
                                    onClick={() => handleStatus(selectedUser.id)}
                                    className="rounded-xl bg-yellow-500 py-3 font-semibold text-white hover:bg-yellow-600"
                                >
                                    {selectedUser.is_active
                                        ? "Suspend User"
                                        : "Activate User"}
                                </button>

                                <button
                                    onClick={() => handleDelete(selectedUser.id)}
                                    className="rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700"
                                >
                                    Deactivate User
                                </button>

                            </div>

                            <button
                                onClick={() => setSelectedUser(null)}
                                className="w-full rounded-xl border py-3 font-semibold hover:bg-slate-50"
                            >
                                Close
                            </button>

                        </div>

                    </div>
                </div>
            )}

        </main>
    );
}

function Info({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-2xl bg-slate-50 p-4">
            <p className="mb-1 text-sm text-slate-500">
                {label}
            </p>

            <h3 className="text-xl font-bold text-slate-800">
                {value}
            </h3>
        </div>
    );
}