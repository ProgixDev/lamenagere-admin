import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { AuthGate } from "@/components/AuthGate";
import { UserProvider } from "@/lib/user-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <AuthGate>
        <div className="app">
          <Sidebar />
          <main className="main">
            <Topbar />
            {children}
          </main>
        </div>
      </AuthGate>
    </UserProvider>
  );
}
