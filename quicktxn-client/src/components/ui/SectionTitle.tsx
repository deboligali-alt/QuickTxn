"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
    title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
    const router = useRouter();

    return (
        <header className="sticky top-0 z-30 bg-gray-50 px-4 pt-4 pb-3">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="rounded-full bg-white p-2 shadow-sm transition active:scale-95"
                >
                    <ArrowLeft size={22} />
                </button>

                <h1 className="text-xl font-bold text-gray-900">
                    {title}
                </h1>
            </div>
        </header>
    );
}