"use client";

import { useEffect, useState } from "react";

import {
    getAllDataPlans,
    deleteDataPlan,
    toggleDataPlanStatus,
    updateDataPlan,
    createDataPlan,
} from "@/services/adminDataPlan.service";
interface DataPlan {
    id: string;
    network: string;
    plan_name: string;
    plan_code: string;
    amount: string;
    is_active: boolean;
}
export default function AdminDataPlansPage() {
    const [showEditModal, setShowEditModal] = useState(false);

    const [editingPlan, setEditingPlan] =
        useState<DataPlan | null>(null);

    const [editForm, setEditForm] = useState({
        network: "",
        plan_name: "",
        plan_code: "",
        amount: "",
        is_active: true,
    });

    const [showAddModal, setShowAddModal] = useState(false);

    const [newPlan, setNewPlan] = useState({
        network: "MTN",
        plan_name: "",
        plan_code: "",
        amount: "",
    });

    const handleCreate = async () => {

        const token = localStorage.getItem("token");

        if (!token) return;

        try {

            const response = await createDataPlan(
                token,
                {
                    network: newPlan.network,
                    plan_name: newPlan.plan_name,
                    plan_code: newPlan.plan_code,
                    amount: Number(newPlan.amount),
                }
            );

            setPlans((prev) => [...prev, response.data]);

            setNewPlan({
                network: "MTN",
                plan_name: "",
                plan_code: "",
                amount: "",
            });

            setShowAddModal(false);

            alert("Data plan created successfully.");

        } catch (error) {

            console.error(error);

            alert("Failed to create data plan.");

        }

    };

    const handleUpdate = async () => {

        if (!editingPlan) return;

        const token = localStorage.getItem("token");

        if (!token) return;

        try {

            const response = await updateDataPlan(
                token,
                editingPlan.id,
                {
                    network: editForm.network,
                    plan_name: editForm.plan_name,
                    plan_code: editForm.plan_code,
                    amount: Number(editForm.amount),
                    is_active: editForm.is_active,
                }
            );

            setPlans((prev) =>
                prev.map((plan) =>
                    plan.id === editingPlan.id
                        ? response.data
                        : plan
                )
            );

            setShowEditModal(false);

            alert("Updated successfully.");

        } catch (error) {

            console.error(error);

            alert("Failed to update.");

        }

    };

    const openEditModal = (plan: DataPlan) => {

        setEditingPlan(plan);

        setEditForm({
            network: plan.network,
            plan_name: plan.plan_name,
            plan_code: plan.plan_code,
            amount: plan.amount,
            is_active: plan.is_active,
        });

        setShowEditModal(true);

    };
    const handleToggleStatus = async (id: string) => {

        const token = localStorage.getItem("token");

        if (!token) return;

        try {

            const response = await toggleDataPlanStatus(
                token,
                id
            );

            setPlans((prev) =>
                prev.map((plan) =>
                    plan.id === id
                        ? response.data
                        : plan
                )
            );

        } catch (error) {

            console.error(error);

            alert("Failed to update status.");

        }

    };

    const handleDelete = async (id: string) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this data plan?"
        );

        if (!confirmed) return;

        const token = localStorage.getItem("token");

        if (!token) return;

        try {

            await deleteDataPlan(token, id);

            setPlans((prev) =>
                prev.filter((plan) => plan.id !== id)
            );

            alert("Data plan deleted successfully.");

        } catch (error) {

            console.error(error);

            alert("Failed to delete data plan.");

        }

    };
    const [plans, setPlans] =
        useState<DataPlan[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const loadPlans = async () => {

            const token = localStorage.getItem("token");

            if (!token) return;

            try {

                const response =
                    await getAllDataPlans(token);

                setPlans(response.data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        loadPlans();

    }, []);
    return (
        <div className="p-6">

            <div className="mb-6 flex items-center justify-between">

                <div>

                    <h1 className="text-3xl font-bold">
                        Data Plans
                    </h1>

                    <p className="mt-1 text-slate-500">
                        Manage all available data plans.
                    </p>

                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                    + Add Data Plan
                </button>

            </div>

            <div className="rounded-xl bg-white p-6 shadow">

                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <input
                        type="text"
                        placeholder="Search data plans..."
                        className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-600 md:max-w-sm"
                    />

                    <select
                        className="rounded-lg border px-4 py-3 outline-none focus:border-green-600"
                    >
                        <option>All Networks</option>
                        <option>MTN</option>
                        <option>AIRTEL</option>
                        <option>GLO</option>
                        <option>9MOBILE</option>
                    </select>

                </div>

                <div className="overflow-x-auto">

                    <table className="min-w-full">

                        <thead className="border-b bg-slate-100">

                            <tr>

                                <th className="px-4 py-3 text-left">
                                    Network
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Plan
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Code
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Amount
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-center">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan={6}
                                        className="py-10 text-center"
                                    >
                                        Loading...
                                    </td>

                                </tr>

                            ) : plans.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={6}
                                        className="py-10 text-center"
                                    >
                                        No Data Plans Found.
                                    </td>

                                </tr>

                            ) : (

                                plans.map((plan) => (

                                    <tr
                                        key={plan.id}
                                        className="border-b hover:bg-slate-50"
                                    >

                                        <td className="px-4 py-4">
                                            {plan.network}
                                        </td>

                                        <td className="px-4 py-4">
                                            {plan.plan_name}
                                        </td>

                                        <td className="px-4 py-4">
                                            {plan.plan_code}
                                        </td>

                                        <td className="px-4 py-4">
                                            ₦{Number(plan.amount).toLocaleString()}
                                        </td>

                                        <td className="px-4 py-4">

                                            <button
                                                onClick={() => handleToggleStatus(plan.id)}
                                                className={`rounded-full px-3 py-1 text-sm font-semibold ${plan.is_active
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {plan.is_active ? "Active" : "Inactive"}
                                            </button>

                                        </td>

                                        <td className="px-4 py-4 text-center">

                                            <button
                                                onClick={() => openEditModal(plan)}
                                                className="mr-2 rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(plan.id)}
                                                className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

                    <div className="w-full max-w-md rounded-xl bg-white p-6">

                        <h2 className="mb-6 text-2xl font-bold">
                            Edit Data Plan
                        </h2>

                        <input
                            className="mb-4 w-full rounded border p-3"
                            placeholder="Network"
                            value={editForm.network}
                            onChange={(e) =>
                                setEditForm({
                                    ...editForm,
                                    network: e.target.value,
                                })
                            }
                        />

                        <input
                            className="mb-4 w-full rounded border p-3"
                            placeholder="Plan Name"
                            value={editForm.plan_name}
                            onChange={(e) =>
                                setEditForm({
                                    ...editForm,
                                    plan_name: e.target.value,
                                })
                            }
                        />

                        <input
                            className="mb-4 w-full rounded border p-3"
                            placeholder="Plan Code"
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
                            className="mb-6 w-full rounded border p-3"
                            placeholder="Amount"
                            value={editForm.amount}
                            onChange={(e) =>
                                setEditForm({
                                    ...editForm,
                                    amount: e.target.value,
                                })
                            }
                        />

                        <div className="flex justify-end gap-3">

                            <button
                                onClick={() =>
                                    setShowEditModal(false)
                                }
                                className="rounded bg-gray-300 px-4 py-2"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpdate}
                                className="rounded bg-green-600 px-4 py-2 text-white"
                            >
                                Save Changes
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

                    <div className="w-full max-w-md rounded-xl bg-white p-6">

                        <h2 className="mb-6 text-2xl font-bold">
                            Add Data Plan
                        </h2>

                        <select
                            className="mb-4 w-full rounded border p-3"
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

                        <input
                            className="mb-4 w-full rounded border p-3"
                            placeholder="Plan Name"
                            value={newPlan.plan_name}
                            onChange={(e) =>
                                setNewPlan({
                                    ...newPlan,
                                    plan_name: e.target.value,
                                })
                            }
                        />

                        <input
                            className="mb-4 w-full rounded border p-3"
                            placeholder="Plan Code"
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
                            className="mb-6 w-full rounded border p-3"
                            placeholder="Amount"
                            value={newPlan.amount}
                            onChange={(e) =>
                                setNewPlan({
                                    ...newPlan,
                                    amount: e.target.value,
                                })
                            }
                        />

                        <div className="flex justify-end gap-3">

                            <button
                                onClick={() => setShowAddModal(false)}
                                className="rounded bg-gray-300 px-4 py-2"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleCreate}
                                className="rounded bg-green-600 px-4 py-2 text-white"
                            >
                                Add Plan
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}