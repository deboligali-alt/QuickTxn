"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    color?: string;
}

export default function StatCard({
    title,
    value,
    icon,
    color = "bg-green-500",
}: StatCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="rounded-2xl bg-white p-6 shadow-lg border border-slate-100"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500">{title}</p>

                    <h2 className="mt-2 text-3xl font-bold text-slate-900">
                        {value}
                    </h2>
                </div>

                <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl text-white ${color}`}
                >
                    {icon}
                </div>
            </div>
        </motion.div>
    );
}