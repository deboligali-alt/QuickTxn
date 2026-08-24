"use client";

import { useEffect, useState } from "react";
import { Building2, Save, RefreshCw } from "lucide-react";
import api from "@/lib/axios";

interface BankAccount {
    id: string;
    bank_name: string;
    account_name: string;
    account_number: string;
    is_active: boolean;
}

export default function BankAccountPage() {
    const [account, setAccount] = useState<BankAccount>({
        id: "",
        bank_name: "",
        account_name: "",
        account_number: "",
        is_active: true,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const loadAccount = async () => {
        try {
            const res = await api.get("/admin/bank-account");
            setAccount(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAccount();
    }, []);

    const save = async () => {
        try {
            setSaving(true);

            await api.put("/admin/bank-account", account);

            alert("Bank account updated successfully.");
        } catch (err) {
            alert("Unable to update bank account.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <main className="mx-auto max-w-3xl space-y-8 p-8">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-4xl font-bold">
                        Bank Account
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Manage the wallet funding receiving account.
                    </p>

                </div>

                <button
                    onClick={loadAccount}
                    className="rounded-xl bg-green-600 p-3 text-white"
                >
                    <RefreshCw size={20} />
                </button>

            </div>

            <div className="rounded-3xl bg-white p-8 shadow">

                <div className="mb-8 flex items-center gap-3">

                    <Building2
                        className="text-green-600"
                        size={28}
                    />

                    <h2 className="text-2xl font-bold">
                        Receiving Account
                    </h2>

                </div>

                <div className="space-y-5">

                    <div>

                        <label className="mb-2 block font-medium">
                            Bank Name
                        </label>

                        <input
                            value={account.bank_name}
                            onChange={(e) =>
                                setAccount({
                                    ...account,
                                    bank_name: e.target.value,
                                })
                            }
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block font-medium">
                            Account Name
                        </label>

                        <input
                            value={account.account_name}
                            onChange={(e) =>
                                setAccount({
                                    ...account,
                                    account_name: e.target.value,
                                })
                            }
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
                        />

                    </div>

                    <div>

                        <label className="mb-2 block font-medium">
                            Account Number
                        </label>

                        <input
                            value={account.account_number}
                            onChange={(e) =>
                                setAccount({
                                    ...account,
                                    account_number: e.target.value,
                                })
                            }
                            className="w-full rounded-xl border px-4 py-3 text-lg font-semibold outline-none focus:border-green-600"
                        />

                    </div>

                    <div className="flex items-center justify-between rounded-xl border p-4">

                        <div>

                            <p className="font-semibold">
                                Active Account
                            </p>

                            <p className="text-sm text-slate-500">
                                Users will see this account when funding their wallet.
                            </p>

                        </div>

                        <input
                            type="checkbox"
                            checked={account.is_active}
                            onChange={(e) =>
                                setAccount({
                                    ...account,
                                    is_active: e.target.checked,
                                })
                            }
                            className="h-5 w-5"
                        />

                    </div>

                    <button
                        onClick={save}
                        disabled={saving}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >

                        <Save size={18} />

                        {saving ? "Saving..." : "Save Changes"}

                    </button>

                </div>

            </div>

        </main>
    );
}