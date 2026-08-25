"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardHeader() {
    const [name, setName] = useState("User");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) return;

                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setName(res.data.data.full_name);
            } catch (error) {
                console.error("Failed to load profile:", error);
            }
        };

        loadProfile();
    }, []);

    return (
        <header className="px-4 pt-5 pb-2">
            <p className="text-sm text-gray-500">Welcome back</p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
                {name} 👋
            </h1>
        </header>
    );
}