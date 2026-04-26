import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { canViewSection, checkPermission } from "@/lib/admin-auth";
import SubAdminPageWrapper from "@/components/admin/SubAdminPageWrapper";
import FeatureManager from "@/components/admin/FeatureManager";
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

export default async function SubAdminFeaturesPage({ params }) {
    const { subadminId } = await params;
    const cookieStore = await cookies();
    const subadmin = await getSubadminAndValidate(cookieStore, subadminId);

    if (!subadmin) {
        redirect("/admin/login/subadmin");
    }

    const rolePermissions = subadmin.role?.permissions || null;
    const canView = canViewSection(rolePermissions, "features");

    if (!canView) {
        return <UnauthorizedPage sectionName="Features" username={subadmin.username} />;
    }

    const features = await prisma.feature.findMany({
        orderBy: { sortOrder: "asc" },
    });

    const canCreate = checkPermission(subadmin, "features.create");
    const canEdit = checkPermission(subadmin, "features.edit");
    const canDelete = checkPermission(subadmin, "features.delete");

    return (
        <SubAdminPageWrapper
            hasAccess={canView}
            sectionName="Features"
            username={subadmin.username}
        >
            <div style={{ padding: "1rem" }}>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>✨ Features</h1>
                <FeatureManager
                    initialFeatures={features}
                    canCreate={canCreate}
                    canEdit={canEdit}
                    canDelete={canDelete}
                />
            </div>
        </SubAdminPageWrapper>
    );
}
