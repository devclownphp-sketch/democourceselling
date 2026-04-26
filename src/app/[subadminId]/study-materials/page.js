import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { checkPermission, canViewSection } from "@/lib/admin-auth";
import StudyMaterialManager from "@/components/admin/StudyMaterialManager";
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

async function getMaterials() {
    try {
        return await prisma.studyMaterial.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                course: { select: { id: true, title: true, slug: true } },
                materialCategory: true,
            },
        });
    } catch {
        return [];
    }
}

async function getCategories() {
    try {
        return await prisma.studyMaterialCategory.findMany({ orderBy: { sortOrder: "asc" } });
    } catch {
        return [];
    }
}

async function getCourses() {
    try {
        return await prisma.course.findMany({ select: { id: true, title: true, slug: true } });
    } catch {
        return [];
    }
}

export default async function SubAdminMaterialsPage({ params }) {
    const { subadminId } = await params;
    const cookieStore = await cookies();
    const subadmin = await getSubadminAndValidate(cookieStore, subadminId);

    if (!subadmin) {
        redirect("/admin/login/subadmin");
    }

    const rolePermissions = subadmin.role?.permissions || null;
    const canView = canViewSection(rolePermissions, "studyMaterials");

    if (!canView) {
        return <UnauthorizedPage sectionName="Study Materials" username={subadmin.username} />;
    }

    const materials = await getMaterials();
    const categories = await getCategories();
    const courses = await getCourses();

    const canCreate = checkPermission(subadmin, "materials.create");
    const canEdit = checkPermission(subadmin, "materials.edit");
    const canDelete = checkPermission(subadmin, "materials.delete");
    const canManageCategories = checkPermission(subadmin, "materials.create") || checkPermission(subadmin, "materials.edit");

    return (
        <SubAdminPageWrapper
            hasAccess={canView}
            sectionName="Study Materials"
            username={subadmin.username}
        >
            <div style={{ padding: "1rem" }}>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>📄 Study Materials</h1>
                <StudyMaterialManager
                    initialMaterials={materials}
                    initialCategories={categories}
                    initialCourses={courses}
                    canCreate={canCreate}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    canManageCategories={canManageCategories}
                />
            </div>
        </SubAdminPageWrapper>
    );
}