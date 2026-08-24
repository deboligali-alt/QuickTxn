import { Suspense } from "react";
import VerifyOTPClient from "./VerifyOTPClient";

export default function VerifyOTPPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen flex items-center justify-center">
                    Loading...
                </main>
            }
        >
            <VerifyOTPClient />
        </Suspense>
    );
}