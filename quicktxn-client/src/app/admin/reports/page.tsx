"use client";

import { useState } from "react";
import {
    Calendar,
    Download,
    FileSpreadsheet,
    FileText,
    BarChart3,
} from "lucide-react";
import api from "@/lib/axios";

export default function ReportsPage() {
    const [period, setPeriod] = useState("DAILY");
    const [loading, setLoading] = useState(false);

    const exportPDF = async () => {
        try {
            setLoading(true);

            const res = await api.get(
                `/admin/reports/pdf?period=${period}`,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(res.data);

            const a = document.createElement("a");

            a.href = url;
            a.download = `${period}-report.pdf`;
            a.click();
        } finally {
            setLoading(false);
        }
    };

    const exportExcel = async () => {
        try {
            setLoading(true);

            const res = await api.get(
                `/admin/reports/excel?period=${period}`,
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(res.data);

            const a = document.createElement("a");

            a.href = url;
            a.download = `${period}-report.xlsx`;
            a.click();
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="mx-auto max-w-5xl space-y-8 p-8">

            <div>
                <h1 className="text-4xl font-bold">
                    Reports Center
                </h1>
                <p className="mt-2 text-slate-500">
                    Export business reports in PDF and Excel.
                </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow">

                <div className="mb-6 flex items-center gap-3">
                    <BarChart3 className="text-green-600" />
                    <h2 className="text-2xl font-bold">
                        Generate Report
                    </h2>
                </div>

                <div className="space-y-5">

                    <div>
                        <label className="mb-2 block font-medium">
                            Report Period
                        </label>

                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="w-full rounded-xl border px-4 py-3"
                        >
                            <option value="DAILY">Daily</option>
                            <option value="WEEKLY">Weekly</option>
                            <option value="MONTHLY">Monthly</option>
                        </select>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">

                        <button
                            onClick={exportPDF}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-4 font-semibold text-white hover:bg-red-700"
                        >
                            <FileText size={20} />
                            Export PDF
                        </button>

                        <button
                            onClick={exportExcel}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-4 font-semibold text-white hover:bg-green-700"
                        >
                            <FileSpreadsheet size={20} />
                            Export Excel
                        </button>

                    </div>

                </div>

            </div>

            <div className="grid gap-5 md:grid-cols-3">

                <StatCard
                    title="Today's Revenue"
                    value="₦125,000"
                />

                <StatCard
                    title="Transactions"
                    value="342"
                />

                <StatCard
                    title="New Users"
                    value="28"
                />

            </div>

        </main>
    );
}

function StatCard({
    title,
    value,
}: {
    title: string;
    value: string;
}) {
    return (
        <div className="rounded-2xl bg-white p-6 shadow">

            <div className="mb-3 flex items-center gap-2 text-green-600">
                <Calendar size={18} />
                {title}
            </div>

            <h2 className="text-3xl font-bold">
                {value}
            </h2>

        </div>
    );
}