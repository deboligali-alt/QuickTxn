"use client";
import { useRouter } from "next/navigation";
interface DashboardHeaderProps {
    fullName?: string;
}

export default function DashboardHeader({
    fullName,
}: DashboardHeaderProps) {
    const router = useRouter();
    const firstName = fullName?.split(" ")[0] || "User";

    return (
        <header className="mb-4 flex items-center justify-between px-1 pt-2">
            <div>
                <p className="text-xs font-medium text-gray-500">
                    Welcome back
                </p>

                <h1 className="mt-1 text-xl font-bold capitalize text-gray-900 sm:text-2xl">
                    {firstName} 👋
                </h1>
            </div>

            <button
                onClick={() => router.push("/profile")}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-green-700 font-bold"
            >
                {firstName.charAt(0).toUpperCase()}
            </button>
        </header>
    );
}