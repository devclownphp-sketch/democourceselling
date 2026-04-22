import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
import SettingsProvider from "@/components/SettingsProvider";

export default async function AdminPanelLayout({ children }) {
    const admin = await requireAdmin();
    return (
        <SettingsProvider>
            <AdminShell admin={admin}>{children}</AdminShell>
        </SettingsProvider>
    );
}
