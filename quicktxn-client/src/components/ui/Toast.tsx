"use client";

import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
    show: boolean;
    title: string;
    message: string;
    onClose: () => void;
}

export default function Toast({
    show,
    title,
    message,
    onClose,
}: ToastProps) {
    if (!show) return null;

    return (
        <div className="fixed left-1/2 top-5 z-[100] w-[92%] max-w-sm -translate-x-1/2 animate-in slide-in-from-top duration-300">
            <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-2xl border border-green-100">
                <div className="rounded-full bg-green-100 p-2">
                    <CheckCircle2 size={22} className="text-green-600" />
                </div>

                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{message}</p>
                </div>

                <button onClick={onClose}>
                    <X size={18} className="text-gray-400" />
                </button>
            </div>
        </div>
    );
}