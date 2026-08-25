"use client";

export default function DashboardHeader() {
    const name = "Adebowale";

    return (
        <header className="px-4 pt-5 pb-2">
            <p className="text-sm text-gray-500">
                Welcome back
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
                {name} 👋
            </h1>
        </header>
    );
}