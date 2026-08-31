"use client";

import { Bell, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface Props {
    fullName?: string;
    verified?: boolean;
}

export default function DashboardHeader({
    fullName,
    verified,
}: Props) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500">Welcome back</p>

                <div className="mt-1 flex items-center gap-2">
                    <h1 className="text-2xl font-bold">
                        {fullName || "User"}
                    </h1>

                    {verified && (
                        <ShieldCheck
                            size={22}
                            className="fill-green-600 text-white"
                        />
                    )}
                </div>
            </div>

            <Link
                href="/notifications"
                className="rounded-full bg-white p-3 shadow-sm"
            >
                <Bell size={20} />
            </Link>
        </div>
    );
}