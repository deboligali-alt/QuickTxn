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

        const currentUser = JSON.parse(user);

        if (currentUser.role !== "ADMIN") {
            router.replace("/dashboard");
            return;
        }

        setAuthorized(true);
    }, [router]);

    if (!authorized) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-lg font-semibold">
                    Loading Admin Panel...
                </p>
            </div>
        );
    }

    return <>{children}</>;
}