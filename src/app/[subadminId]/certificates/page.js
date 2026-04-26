import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { checkPermission, canViewSection } from "@/lib/admin-auth";
import CertificateTemplateManager from "@/components/admin/CertificateTemplateManager";
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

async function getCertificates() {
    try {
        return await prisma.certificate.findMany({
            orderBy: { issuedAt: "desc" },
            include: { template: true, course: true },
        });
    } catch {
        return [];
    }
}

async function getTemplates() {
    try {
        return await prisma.certificateTemplate.findMany({ orderBy: { createdAt: "desc" } });
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

export default async function SubAdminCertificatesPage({ params }) {
    const { subadminId } = await params;
    const cookieStore = await cookies();
    const subadmin = await getSubadminAndValidate(cookieStore, subadminId);

    if (!subadmin) {
        redirect("/admin/login/subadmin");
    }

    const rolePermissions = subadmin.role?.permissions || null;
    const canView = canViewSection(rolePermissions, "certificates");

    if (!canView) {
        return <UnauthorizedPage sectionName="Certificates" username={subadmin.username} />;
    }

    const certificates = await getCertificates();
    const templates = await getTemplates();
    const courses = await getCourses();

    const canCreate = checkPermission(subadmin, "certificates.create");
    const canDelete = checkPermission(subadmin, "certificates.delete");
    const canManageTemplates = checkPermission(subadmin, "certificates.templates");

    return (
        <SubAdminPageWrapper
            hasAccess={canView}
            sectionName="Certificates"
            username={subadmin.username}
        >
            <div style={{ padding: "1rem" }}>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>🏆 Certificates</h1>
                <CertificateTemplateManager
                    initialCertificates={certificates}
                    initialTemplates={templates}
                    initialCourses={courses}
                    canCreate={canCreate}
                    canDelete={canDelete}
                    canManageTemplates={canManageTemplates}
                />
            </div>
        </SubAdminPageWrapper>
    );
}