import Sidebar from "@/components/layout/Sidebar";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="flex h-screen overflow-hidden bg-slate-100">
                {/* Sidebar (Desktop only) */}
                <aside className="hidden lg:block">
                    <Sidebar />
                </aside>

                {/* Main Content */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    <main className="flex-1 overflow-y-auto bg-slate-50">
                        <div className="mx-auto w-full max-w-md">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}