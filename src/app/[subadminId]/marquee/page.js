import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { canViewSection } from "@/lib/admin-auth";
import MarqueeSettings from "@/components/admin/MarqueeSettings";
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

export default async function SubAdminMarqueePage({ params }) {
    const { subadminId } = await params;
    const cookieStore = await cookies();
    const subadmin = await getSubadminAndValidate(cookieStore, subadminId);

    if (!subadmin) {
        redirect("/admin/login/subadmin");
    }

    const rolePermissions = subadmin.role?.permissions || null;
    const canView = canViewSection(rolePermissions, "marquee");

    if (!canView) {
        return <UnauthorizedPage sectionName="Marquee" username={subadmin.username} />;
    }

    return (
        <SubAdminPageWrapper
            hasAccess={canView}
            sectionName="Marquee"
            username={subadmin.username}
        >
            <div className="stack-lg">
                <MarqueeSettings />
            </div>
        </SubAdminPageWrapper>
    );
}
