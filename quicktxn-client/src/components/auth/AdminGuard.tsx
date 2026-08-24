"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {

        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (!token || !user) {
            router.replace("/login");
            return;
        }

        const parsedUser = JSON.parse(user);

        if (parsedUser.role !== "ADMIN") {
            router.replace("/dashboard");
            return;
        }

        setAuthorized(true);

    }, [router]);

    if (!authorized) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-slate-500">
                    Checking admin access...
                </p>
            </div>
        );
    }

    return <>{children}</>;
}