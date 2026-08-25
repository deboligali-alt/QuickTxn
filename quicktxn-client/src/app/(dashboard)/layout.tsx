import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto w-full max-w-md">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}