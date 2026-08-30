"use client";

interface DashboardHeaderProps {
    fullName?: string;
}

export default function DashboardHeader({
    fullName,
}: DashboardHeaderProps) {
    const firstName = fullName?.split(" ")[0] || "User";

    return (
        <header className="mb-4 flex items-center justify-between px-1 pt-2">
            <div>
                <p className="text-xs font-medium text-gray-500">
                    Welcome back
                </p>

                <h1 className="mt-1 text-xl font-bold capitalize leading-tight text-gray-900 sm:text-2xl">
                    {firstName} 👋
                </h1>
            </div>
        </header>
    );
}