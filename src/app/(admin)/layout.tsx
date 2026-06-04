import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { AuthGate } from "@/components/AuthGate";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate>
      <div className="app">
        <Sidebar />
        <main className="main">
          <Topbar />
          {children}
        </main>
      </div>
    </AuthGate>
  );
}
