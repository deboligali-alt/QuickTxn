"use client";

import { CheckCircle, X } from "lucide-react";

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
        <div className="fixed top-5 left-1/2 z-[100] w-[90%] max-w-sm -translate-x-1/2">
            <div className="flex items-start gap-3 rounded-2xl bg-gray-900 p-4 text-white shadow-2xl">
                <CheckCircle className="mt-0.5 text-green-400" size={22} />

                <div className="flex-1">
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm text-gray-300">{message}</p>
                </div>

                <button onClick={onClose}>
                    <X size={18} className="text-gray-400" />
                </button>
            </div>
        </div>
    );
}