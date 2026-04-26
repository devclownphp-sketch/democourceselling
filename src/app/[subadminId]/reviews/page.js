import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { checkPermission, canViewSection } from "@/lib/admin-auth";
import ReviewManager from "@/components/admin/ReviewManager";
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

async function getReviews() {
    try {
        return await prisma.review.findMany({
            orderBy: { createdAt: "desc" },
        });
    } catch {
        return [];
    }
}

export default async function SubAdminReviewsPage({ params }) {
    const { subadminId } = await params;
    const cookieStore = await cookies();
    const subadmin = await getSubadminAndValidate(cookieStore, subadminId);

    if (!subadmin) {
        redirect("/admin/login/subadmin");
    }

    const rolePermissions = subadmin.role?.permissions || null;
    const canView = canViewSection(rolePermissions, "reviews");

    if (!canView) {
        return <UnauthorizedPage sectionName="Reviews" username={subadmin.username} />;
    }

    const reviews = await getReviews();

    const canCreate = checkPermission(subadmin, "reviews.create");
    const canEdit = checkPermission(subadmin, "reviews.edit");
    const canDelete = checkPermission(subadmin, "reviews.delete");
    const canManageMarquee = checkPermission(subadmin, "reviews.marquee");

    return (
        <SubAdminPageWrapper
            hasAccess={canView}
            sectionName="Reviews"
            username={subadmin.username}
        >
            <div style={{ padding: "1rem" }}>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>⭐ Reviews</h1>
                <ReviewManager
                    initialReviews={reviews}
                    canCreate={canCreate}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    canManageMarquee={canManageMarquee}
                />
            </div>
        </SubAdminPageWrapper>
    );
}