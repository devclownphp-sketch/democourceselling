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

    const user = admin || subadmin;
    const userType = admin ? "admin" : "subadmin";

    return (
        <SettingsProvider>
            <AdminShell user={user} userType={userType}>{children}</AdminShell>
        </SettingsProvider>
    );
}
