import { requireAdmin } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import "../globals.css";
import "../panel/panel.css";

export const metadata = {
  title: "EnergieMIND Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireAdmin();

  return (
    <html lang="en">
      <body className="panel-body">
        <div className="panel-layout">
          <AdminSidebar profile={profile} />
          <main className="panel-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
