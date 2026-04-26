import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAccessibleSections } from "@/lib/admin-auth";

import SubAdminShell from "@/components/admin/SubAdminShell";

export default async function SubAdminLayout({ children, params }) {
    const { subadminId } = await params;
    const cookieStore = await cookies();

    const sessionToken = cookieStore.get("subadmin_session")?.value;
    const storedUrlId = cookieStore.get("subadmin_urlid")?.value;

    if (!sessionToken || storedUrlId !== subadminId) {
        redirect("/admin/login/subadmin");
    }

    const tokenHash = require("crypto").createHash("sha256").update(sessionToken).digest("hex");
    const session = await prisma.subAdminSession.findUnique({
        where: { tokenHash },
        include: {
            subAdmin: {
                include: { role: true }
            }
        },
    });

    if (!session) {
        redirect("/admin/login/subadmin");
    }

    const timeoutMin = session.subAdmin?.sessionTimeoutMin || 10;
    const timeoutAt = new Date(session.createdAt.getTime() + timeoutMin * 60 * 1000);

    if (new Date() > timeoutAt || session.expiresAt < new Date()) {
        await prisma.subAdminSession.delete({ where: { id: session.id } }).catch(() => null);
        redirect("/admin/login/subadmin");
    }

    const subadmin = session.subAdmin;
    if (!subadmin.isActive) {
        redirect("/admin/login/subadmin");
    }

    const rolePermissions = subadmin.role?.permissions || null;
    const accessibleSections = getAccessibleSections(rolePermissions);

    return (
        <SubAdminShell subadmin={subadmin} accessibleSections={accessibleSections}>
            {children}
        </SubAdminShell>
    );
}