"use client";

import {
    useEffect,
    useState,
} from "react";

import { useRouter } from "next/navigation";

export default function AuthGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const [authorized, setAuthorized] =
        useState(false);

    useEffect(() => {
        const checkAuthentication =
            () => {
                const token =
                    localStorage.getItem(
                        "token"
                    );

                if (!token) {
                    setAuthorized(false);

                    router.replace(
                        "/login"
                    );

                    return;
                }

                setAuthorized(true);
            };

        checkAuthentication();

        // Check again whenever the user
        // returns to the tab/window.
        const handleVisibilityChange =
            () => {
                if (
                    document.visibilityState ===
                    "visible"
                ) {
                    checkAuthentication();
                }
            };

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        window.addEventListener(
            "focus",
            checkAuthentication
        );

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );

            window.removeEventListener(
                "focus",
                checkAuthentication
            );
        };
    }, [router]);

    if (!authorized) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-green-600" />

                    <p className="mt-4 text-sm font-semibold text-slate-600">
                        Checking authentication...
                    </p>

                </div>
            </div>
        );
    }

    return <>{children}</>;
}