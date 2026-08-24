"use client";

import { Bell } from "lucide-react";

export default function DashboardHeader() {
    return (
        <header className="flex items-center justify-between px-4 pt-6 pb-3">
            <div className="min-w-0">
                <p className="text-sm text-gray-500">Welcome back</p>

                <h1 className="truncate text-xl font-bold">
                    Adebowale 👋
                </h1>
            </div>

            <div className="relative">
                <button className="rounded-full bg-white p-3 shadow-sm">
                    <Bell size={20} className="text-gray-700" />
                </button>

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </div>
        </header>
    );
}