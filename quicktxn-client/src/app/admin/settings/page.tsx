"use client";

import { useState } from "react";
import { Save, Shield, Building2, Wallet } from "lucide-react";

export default function AdminSettingsPage() {
    const [company, setCompany] = useState("QuickTxn");
    const [supportEmail, setSupportEmail] = useState("support@quicktxn.com");
    const [minimumSwap, setMinimumSwap] = useState(500);
    const [walletName, setWalletName] = useState("QuickTxn Wallet");

    const saveSettings = () => {
        alert("Settings saved successfully.");
    };

    return (
        <main className="mx-auto max-w-5xl space-y-8 p-8">

            <div>
                <h1 className="text-4xl font-bold">Admin Settings</h1>
                <p className="mt-2 text-slate-500">
                    Configure your QuickTxn platform.
                </p>
            </div>

            {/* Company */}

            <section className="rounded-3xl bg-white p-6 shadow">

                <div className="mb-6 flex items-center gap-3">
                    <Building2 className="text-green-600" />
                    <h2 className="text-xl font-bold">Company Information</h2>
                </div>

                <div className="space-y-4">

                    <div>
                        <label className="mb-2 block font-medium">Company Name</label>
                        <input
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">Support Email</label>
                        <input
                            value={supportEmail}
                            onChange={(e) => setSupportEmail(e.target.value)}
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-green-600"
                        />
                    </div>

                </div>

            </section>

            {/* Wallet */}

            <section className="rounded-3xl bg-white p-6 shadow">

                <div className="mb-6 flex items-center gap-3">
                    <Wallet className="text-blue-600" />
                    <h2 className="text-xl font-bold">Wallet Settings</h2>
                </div>

                <div className="space-y-4">

                    <div>
                        <label className="mb-2 block font-medium">Wallet Name</label>
                        <input
                            value={walletName}
                            onChange={(e) => setWalletName(e.target.value)}
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Minimum Airtime Swap (₦)
                        </label>
                        <input
                            type="number"
                            value={minimumSwap}
                            onChange={(e) => setMinimumSwap(Number(e.target.value))}
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-600"
                        />
                    </div>

                </div>

            </section>

            {/* Security */}

            <section className="rounded-3xl bg-white p-6 shadow">

                <div className="mb-6 flex items-center gap-3">
                    <Shield className="text-purple-600" />
                    <h2 className="text-xl font-bold">Security</h2>
                </div>

                <div className="space-y-4">

                    <div className="flex items-center justify-between rounded-xl border p-4">
                        <div>
                            <h3 className="font-semibold">Require Admin Authentication</h3>
                            <p className="text-sm text-slate-500">
                                Extra verification before sensitive actions.
                            </p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-5 w-5" />
                    </div>

                    <div className="flex items-center justify-between rounded-xl border p-4">
                        <div>
                            <h3 className="font-semibold">Email Alerts</h3>
                            <p className="text-sm text-slate-500">
                                Receive notifications for new conversions.
                            </p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-5 w-5" />
                    </div>

                </div>

            </section>

            <button
                onClick={saveSettings}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-8 py-4 font-semibold text-white hover:bg-green-700"
            >
                <Save size={18} />
                Save Settings
            </button>

        </main>
    );
}