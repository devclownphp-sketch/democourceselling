import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { checkPermission, canViewSection } from "@/lib/admin-auth";
import CourseManager from "@/components/admin/CourseManager";
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

async function getCourses() {
    try {
        const courses = await prisma.course.findMany({
            orderBy: { createdAt: "desc" },
            include: { courseType: true },
        });
        return courses.map(c => ({
            ...c,
            originalPrice: Number(c.originalPrice || 0),
            offerPrice: Number(c.offerPrice || 0),
            rating: Number(c.rating || 4.5),
            discountPercent: Number(c.discountPercent || 0),
        }));
    } catch {
        return [];
    }
}

async function getCourseTypes() {
    try {
        return await prisma.courseType.findMany({ orderBy: { sortOrder: "asc" } });
    } catch {
        return [];
    }
}

export default async function SubAdminCoursesPage({ params }) {
    const { subadminId } = await params;
    const cookieStore = await cookies();
    const subadmin = await getSubadminAndValidate(cookieStore, subadminId);

    if (!subadmin) {
        redirect("/admin/login/subadmin");
    }

    const rolePermissions = subadmin.role?.permissions || null;
    const canView = canViewSection(rolePermissions, "courses");

    if (!canView) {
        return <UnauthorizedPage sectionName="Courses" username={subadmin.username} />;
    }

    const courses = await getCourses();
    const courseTypes = await getCourseTypes();

    const canCreate = checkPermission(subadmin, "courses.create");
    const canEdit = checkPermission(subadmin, "courses.edit");
    const canDelete = checkPermission(subadmin, "courses.delete");

    return (
        <SubAdminPageWrapper
            hasAccess={canView}
            sectionName="courses"
            username={subadmin.username}
        >
            <CourseManager
                initialCourses={courses}
                initialCourseTypes={courseTypes}
                canCreate={canCreate}
                canEdit={canEdit}
                canDelete={canDelete}
            />
        </SubAdminPageWrapper>
    );
}