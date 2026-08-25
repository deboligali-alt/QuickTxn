"use client";

interface DashboardHeaderProps {
    fullName?: string;
}

export default function DashboardHeader({
    fullName,
}: DashboardHeaderProps) {
    const firstName = fullName?.split(" ")[0] || "User";

    return (
        <header className="px-4 pt-5 pb-3">
            <p className="text-sm text-gray-500">
                Welcome back
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
                {firstName} 👋
            </h1>
        </header>
    );
}