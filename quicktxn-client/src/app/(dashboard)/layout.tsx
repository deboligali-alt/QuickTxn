"use client";

import Sidebar from "@/components/layout/Sidebar";
import BottomNavigation from "@/components/layout/dashboard/BottomNavigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="lg:ml-72">
                {children}
            </div>

            {/* Mobile Bottom Navigation */}
            <BottomNavigation />
        </div>
    );
}