import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="flex h-screen overflow-hidden bg-slate-100">

                {/* Sidebar */}
                <aside className="hidden lg:block">
                    <Sidebar />
                </aside>

                {/* Main Content */}
                <div className="flex flex-1 flex-col overflow-hidden">

                    {/* Navbar */}
                    <header className="sticky top-0 z-30 border-b bg-white shadow-sm">
                        <Navbar />
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
                        <div className="mx-auto max-w-7xl">
                            {children}
                        </div>
                    </main>

                </div>

            </div>
        </AuthGuard>
    );
}