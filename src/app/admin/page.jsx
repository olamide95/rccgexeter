import { currentAdmin } from "@/lib/auth";
import { isFirebaseConfigured } from "@/lib/firebase-admin";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Parish Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const admin = await currentAdmin();
  return (
    <div className="admin-page">
      <div className="wrap" style={{ maxWidth: 1100 }}>
        {admin
          ? <AdminDashboard email={admin.email} local={Boolean(admin.local)} />
          : <AdminLogin firebaseReady={isFirebaseConfigured()} />}
      </div>
    </div>
  );
}
