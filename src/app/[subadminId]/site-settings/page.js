import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { canViewSection } from "@/lib/admin-auth";
import SubAdminPageWrapper from "@/components/admin/SubAdminPageWrapper";
import UnauthorizedPage from "@/components/admin/UnauthorizedPage";

async function getSubadminAndValidate(cookieStore, urlId) {
    const sessionToken = cookieStore.get("subadmin_session")?.value;
    const storedUrlId = cookieStore.get("subadmin_urlid")?.value;

    if (!sessionToken || storedUrlId !== urlId) return null;

    const tokenHash = require("crypto").createHash("sha256").update(sessionToken).digest("hex");
    const session = await prisma.subAdminSession.findUnique({
        where: { tokenHash },
        include: { subAdmin: { include: { role: true } } },
    });

    if (!session) return null;

    const timeoutMin = session.subAdmin?.sessionTimeoutMin || 10;
    if (new Date() > new Date(session.createdAt.getTime() + timeoutMin * 60 * 1000)) return null;
    if (session.expiresAt < new Date()) return null;
    if (!session.subAdmin.isActive) return null;

    return session.subAdmin;
}

export default async function SubAdminSiteSettingsPage({ params }) {
    const { subadminId } = await params;
    const cookieStore = await cookies();
    const subadmin = await getSubadminAndValidate(cookieStore, subadminId);

    if (!subadmin) {
        redirect("/admin/login/subadmin");
    }

    const rolePermissions = subadmin.role?.permissions || null;
    const canView = canViewSection(rolePermissions, "siteSettings");

    if (!canView) {
        return <UnauthorizedPage sectionName="Site Settings" username={subadmin.username} />;
    }

    return (
        <SubAdminPageWrapper
            hasAccess={canView}
            sectionName="Settings"
            username={subadmin.username}
        >
            <div style={{ padding: "1rem" }}>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>⚙️ Settings</h1>
                <div style={{ background: "#fff", border: "4px solid #000", borderRadius: "16px", padding: "2rem", boxShadow: "4px 4px 0 #000" }}>
                    <p style={{ color: "#666", marginBottom: "1rem" }}>Site settings are managed from the main admin panel.</p>
                    <a href="/admin/settings" target="_blank" style={{ display: "inline-block", padding: "0.75rem 1.5rem", background: "#0084D1", color: "#fff", borderRadius: "12px", textDecoration: "none", fontWeight: 700 }}>
                        Open Settings in Admin Panel
                    </a>
                </div>
            </div>
        </SubAdminPageWrapper>
    );
}
