import AdminShell from "@/components/admin/AdminShell";
import { getSessionAdmin, getSessionSubAdmin } from "@/lib/admin-auth";
import SettingsProvider from "@/components/SettingsProvider";
import { redirect } from "next/navigation";

export default async function AdminPanelLayout({ children }) {
    const admin = await getSessionAdmin();
    const subadmin = await getSessionSubAdmin();

    if (!admin && !subadmin) {
        redirect("/admin/login");
    }
    if (subadmin && subadmin.urlId) {
        redirect(`/${subadmin.urlId}/dashboard`);
    }

    return (
        <SettingsProvider>
            <AdminShell user={admin} userType="admin">{children}</AdminShell>
        </SettingsProvider>
    );
}
