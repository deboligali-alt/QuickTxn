import AuthGuard from "@/components/AuthGuard";
import BottomNavigation from "@/components/layout/dashboard/BottomNavigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-slate-50">
                <main className="mx-auto w-full max-w-md pb-24">
                    {children}
                </main>

                <BottomNavigation />
            </div>
        </AuthGuard>
    );
}