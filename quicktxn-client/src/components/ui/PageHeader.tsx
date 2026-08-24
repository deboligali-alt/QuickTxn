"use client";

import { motion } from "framer-motion";

interface Props {
    name: string;
}

export default function PageHeader({ name }: Props) {
    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) greeting = "Good Morning";
    else if (hour < 17) greeting = "Good Afternoon";

    return (
        <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <h1 className="text-4xl font-bold text-slate-900">
                {greeting}, {name} 👋
            </h1>

            <p className="mt-2 text-slate-500">
                Welcome back to QuickTxn.
            </p>
        </motion.div>
    );
}