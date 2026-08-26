"use client";

import { useEffect, useState } from "react";
import {
    History,
    RefreshCw,
    ShieldCheck,
    User,
} from "lucide-react";
import api from "@/lib/api";

interface AuditLog {
    id: string;
    admin_name: string;
    action: string;
    module: string;
    ip_address: string;
    created_at: string;
}

export default function AuditLogPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);

    const loadLogs = async () => {
        const res = await api.get("/admin/audit");
        setLogs(res.data.data || []);
    };

    useEffect(() => {
        loadLogs();
    }, []);

    return (
        <main className="mx-auto max-w-7xl space-y-8 p-8">

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-4xl font-bold">
                        Audit Log
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Track every admin activity across the platform.
                    </p>
                </div>

                <button
                    onClick={loadLogs}
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
                                Admin
                            </th>
                            <th className="px-5 py-4 text-left">
                                Action
                            </th>
                            <th className="px-5 py-4 text-left">
                                Module
                            </th>
                            <th className="px-5 py-4 text-left">
                                IP Address
                            </th>
                            <th className="px-5 py-4 text-left">
                                Time
                            </th>
                        </tr>
                    </thead>

                    <tbody>

                        {logs.map((log) => (

                            <tr
                                key={log.id}
                                className="border-b hover:bg-slate-50"
                            >

                                <td className="px-5 py-5">

                                    <div className="flex items-center gap-2">

                                        <User
                                            className="text-green-600"
                                            size={18}
                                        />

                                        <span className="font-semibold">
                                            {log.admin_name}
                                        </span>

                                    </div>

                                </td>

                                <td className="px-5 py-5">
                                    {log.action}
                                </td>

                                <td className="px-5 py-5">

                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                        {log.module}
                                    </span>

                                </td>

                                <td className="px-5 py-5">
                                    {log.ip_address}
                                </td>

                                <td className="px-5 py-5 text-sm text-slate-500">
                                    {new Date(
                                        log.created_at
                                    ).toLocaleString("en-NG")}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            <div className="rounded-2xl bg-green-50 p-5">

                <div className="flex items-center gap-3">

                    <ShieldCheck className="text-green-600" />

                    <div>

                        <h3 className="font-bold text-green-700">
                            Security Notice
                        </h3>

                        <p className="text-sm text-green-600">
                            Every approval, rejection, deletion and settings
                            update should automatically create an audit record.
                        </p>

                    </div>

                </div>

            </div>

        </main>
    );
}