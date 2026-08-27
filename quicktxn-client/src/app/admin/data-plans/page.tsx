"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Plus,
    Pencil,
    Trash2,
    Power,
    X,
} from "lucide-react";

interface DataPlan {
    id: string;
    network: string;
    plan_type: string;
    plan_name: string;
    plan_code: string;
    amount: number;
    is_active: boolean;
}

export default function AdminDataPlansPage() {
    const [plans, setPlans] = useState<DataPlan[]>([]);
    const [loading, setLoading] = useState(true);

    const [showAdd, setShowAdd] = useState(false);
    const [editing, setEditing] = useState<DataPlan | null>(null);

    const [newPlan, setNewPlan] = useState({
        network: "MTN",
        plan_type: "SME",
        plan_name: "",
        plan_code: "",
        amount: "",
    });

    const [editForm, setEditForm] = useState({
        network: "",
        plan_type: "SME",
        plan_name: "",
        plan_code: "",
        amount: "",
        is_active: true,
    });

    const loadPlans = async () => {
        try {
            const res = await api.get("/admin/data-plans");
            setPlans(res.data.data);
        } catch (err) {
            console.error(err);
            alert("Failed to load plans");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPlans();
    }, []);

    const handleCreate = async () => {
        try {
            await api.post("/admin/data-plans", {
                network: newPlan.network,
                plan_type: newPlan.plan_type,
                plan_name: newPlan.plan_name,
                plan_code: newPlan.plan_code,
                amount: Number(newPlan.amount),
            });

            setShowAdd(false);

            setNewPlan({
                network: "MTN",
                plan_type: "SME",
                plan_name: "",
                plan_code: "",
                amount: "",
            });

            loadPlans();
        } catch (err: any) {
            alert(err.response?.data?.message || "Unable to create plan");
        }
    };

    const openEdit = (plan: DataPlan) => {
        setEditing(plan);

        setEditForm({
            network: plan.network,
            plan_type: plan.plan_type,
            plan_name: plan.plan_name,
            plan_code: plan.plan_code,
            amount: String(plan.amount),
            is_active: plan.is_active,
        });
    };

    const handleUpdate = async () => {
        if (!editing) return;

        try {
            await api.put(`/admin/data-plans/${editing.id}`, {
                network: editForm.network,
                plan_type: editForm.plan_type,
                plan_name: editForm.plan_name,
                plan_code: editForm.plan_code,
                amount: Number(editForm.amount),
                is_active: editForm.is_active,
            });

            setEditing(null);
            loadPlans();
        } catch (err: any) {
            alert(err.response?.data?.message || "Update failed");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this data plan?")) return;

        try {
            await api.delete(`/admin/data-plans/${id}`);
            loadPlans();
        } catch {
            alert("Delete failed");
        }
    };

    const toggleStatus = async (id: string) => {
        try {
            await api.patch(`/admin/data-plans/${id}/status`);
            loadPlans();
        } catch {
            alert("Unable to update status");
        }
    };

    return (
        <main className="mx-auto min-h-screen max-w-md bg-gray-50 p-4 pb-24">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Data Plans</h1>

                <button
                    onClick={() => setShowAdd(true)}
                    className="rounded-xl bg-green-600 p-3 text-white"
                >
                    <Plus size={20} />
                </button>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="space-y-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className="rounded-2xl bg-white p-4 shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="font-bold">
                                        {plan.network} • {plan.plan_name}
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        {plan.plan_type}
                                    </p>

                                    <p className="mt-1 text-lg font-bold text-green-600">
                                        ₦{Number(plan.amount).toLocaleString()}
                                    </p>

                                    <span
                                        className={`mt-2 inline-block rounded-full px-2 py-1 text-xs ${plan.is_active
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-600"
                                            }`}
                                    >
                                        {plan.is_active ? "ACTIVE" : "INACTIVE"}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEdit(plan)}
                                        className="rounded-lg bg-blue-100 p-2 text-blue-600"
                                    >
                                        <Pencil size={16} />
                                    </button>

                                    <button
                                        onClick={() => toggleStatus(plan.id)}
                                        className="rounded-lg bg-yellow-100 p-2 text-yellow-600"
                                    >
                                        <Power size={16} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(plan.id)}
                                        className="rounded-lg bg-red-100 p-2 text-red-600"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ADD MODAL */}
            {showAdd && (
                <div className="fixed inset-0 z-50 flex items-end bg-black/40">
                    <div className="w-full rounded-t-3xl bg-white p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">New Data Plan</h2>

                            <button onClick={() => setShowAdd(false)}>
                                <X />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <select
                                className="w-full rounded-xl border p-3"
                                value={newPlan.network}
                                onChange={(e) =>
                                    setNewPlan({
                                        ...newPlan,
                                        network: e.target.value,
                                    })
                                }
                            >
                                <option>MTN</option>
                                <option>AIRTEL</option>
                                <option>GLO</option>
                                <option>9MOBILE</option>
                            </select>

                            <select
                                className="w-full rounded-xl border p-3"
                                value={newPlan.plan_type}
                                onChange={(e) =>
                                    setNewPlan({
                                        ...newPlan,
                                        plan_type: e.target.value,
                                    })
                                }
                            >
                                <option>SME</option>
                                <option>Corporate</option>
                                <option>Gifting</option>
                            </select>

                            <input
                                placeholder="Plan Name (1GB)"
                                className="w-full rounded-xl border p-3"
                                value={newPlan.plan_name}
                                onChange={(e) =>
                                    setNewPlan({
                                        ...newPlan,
                                        plan_name: e.target.value,
                                    })
                                }
                            />

                            <input
                                placeholder="Plan Code"
                                className="w-full rounded-xl border p-3"
                                value={newPlan.plan_code}
                                onChange={(e) =>
                                    setNewPlan({
                                        ...newPlan,
                                        plan_code: e.target.value,
                                    })
                                }
                            />

                            <input
                                type="number"
                                placeholder="Amount"
                                className="w-full rounded-xl border p-3"
                                value={newPlan.amount}
                                onChange={(e) =>
                                    setNewPlan({
                                        ...newPlan,
                                        amount: e.target.value,
                                    })
                                }
                            />

                            <button
                                onClick={handleCreate}
                                className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white"
                            >
                                Create Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {editing && (
                <div className="fixed inset-0 z-50 flex items-end bg-black/40">
                    <div className="w-full rounded-t-3xl bg-white p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold">Edit Plan</h2>

                            <button onClick={() => setEditing(null)}>
                                <X />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <select
                                className="w-full rounded-xl border p-3"
                                value={editForm.network}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        network: e.target.value,
                                    })
                                }
                            >
                                <option>MTN</option>
                                <option>AIRTEL</option>
                                <option>GLO</option>
                                <option>9MOBILE</option>
                            </select>

                            <select
                                className="w-full rounded-xl border p-3"
                                value={editForm.plan_type}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        plan_type: e.target.value,
                                    })
                                }
                            >
                                <option>SME</option>
                                <option>Corporate</option>
                                <option>Gifting</option>
                            </select>

                            <input
                                className="w-full rounded-xl border p-3"
                                value={editForm.plan_name}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        plan_name: e.target.value,
                                    })
                                }
                            />

                            <input
                                className="w-full rounded-xl border p-3"
                                value={editForm.plan_code}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        plan_code: e.target.value,
                                    })
                                }
                            />

                            <input
                                type="number"
                                className="w-full rounded-xl border p-3"
                                value={editForm.amount}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        amount: e.target.value,
                                    })
                                }
                            />

                            <button
                                onClick={handleUpdate}
                                className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white"
                            >
                                Update Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}