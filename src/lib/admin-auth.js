import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE_NAME = "admin_session";
const SUBADMIN_SESSION_COOKIE_NAME = "subadmin_session";
const SUBADMIN_URLID_COOKIE = "subadmin_urlid";

export function generateUrlId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function hashToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createAdminIfMissing() {
    const count = await prisma.admin.count();
    if (count > 0) return;

    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "admin123";
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.admin.create({
        data: {
            username,
            passwordHash,
            createdByUsername: "bootstrap",
        },
    });
}

export async function verifyAdminCredentials(username, password) {
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) return null;

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return null;
    return admin;
}

export async function createAdminSession(adminId) {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    const timeoutMin = settings?.sessionTimeoutMin || 10;
    const maxSessions = settings?.maxSessions || 2;

    await prisma.adminSession.deleteMany({
        where: {
            adminId,
            expiresAt: { lt: new Date() },
        },
    });

    const activeSessions = await prisma.adminSession.findMany({
        where: {
            adminId,
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "asc" },
    });

    while (activeSessions.length >= maxSessions) {
        const oldest = activeSessions.shift();
        if (oldest) {
            await prisma.adminSession.delete({ where: { id: oldest.id } }).catch(() => null);
        }
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + timeoutMin * 60 * 1000);

    await prisma.adminSession.create({
        data: {
            adminId,
            tokenHash,
            expiresAt,
        },
    });

    return { token, expiresAt };
}

export function attachSessionCookie(response, token, expiresAt) {
    response.cookies.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: expiresAt,
    });
}

export function clearSessionCookie(response) {
    response.cookies.set(SESSION_COOKIE_NAME, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    });
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const tokenHash = hashToken(token);
    const session = await prisma.adminSession.findUnique({
        where: { tokenHash },
        include: { admin: true },
    });

    if (!session) return null;

    const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    const timeoutMin = settings?.sessionTimeoutMin || 10;
    const timeoutAt = new Date(session.createdAt.getTime() + timeoutMin * 60 * 1000);

    if (new Date() > timeoutAt) {
        await prisma.adminSession.delete({ where: { id: session.id } }).catch(() => null);
        return null;
    }

    if (session.expiresAt < new Date()) {
        await prisma.adminSession.delete({ where: { id: session.id } }).catch(() => null);
        return null;
    }

    return session;
}

export async function getSessionAdmin() {
    const session = await getSession();
    return session?.admin || null;
}

export async function requireAdmin() {
    const admin = await getSessionAdmin();
    if (!admin) {
        redirect("/admin/login");
    }
    return admin;
}

export async function requireAdminApi() {
    const admin = await getSessionAdmin();
    if (admin) {
        return {
            admin,
            unauthorized: null,
        };
    }

    const subadmin = await getSessionSubAdmin();
    if (subadmin) {
        return {
            admin: subadmin,
            unauthorized: null,
        };
    }

    return {
        admin: null,
        unauthorized: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
}

export async function requireAnyAdmin() {
    const admin = await getSessionAdmin();
    if (admin) return { type: "admin", user: admin };

    const subadmin = await getSessionSubAdmin();
    if (subadmin) return { type: "subadmin", user: subadmin };

    return null;
}

export async function requireAnyAdminApi() {
    const result = await requireAnyAdmin();
    if (!result) {
        return {
            user: null,
            unauthorized: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    return {
        user: result.user,
        type: result.type,
        unauthorized: null,
    };
}

export async function verifySubAdminCredentials(username, password) {
    const subadmin = await prisma.subAdmin.findUnique({
        where: { username },
        include: { role: true },
    });
    if (!subadmin) return null;

    if (!subadmin.isActive) return null;

    const ok = await bcrypt.compare(password, subadmin.passwordHash);
    if (!ok) return null;
    return subadmin;
}

export async function createSubAdminSession(subadmin) {
    if (!subadmin) return null;

    let urlId = subadmin.urlId;
    if (!urlId) {
        urlId = generateUrlId();
        await prisma.subAdmin.update({
            where: { id: subadmin.id },
            data: { urlId },
        });
    }

    const timeoutMin = subadmin.sessionTimeoutMin || 10;
    const maxSessions = subadmin.maxSessions || 2;

    await prisma.subAdminSession.deleteMany({
        where: {
            subAdminId: subadmin.id,
            expiresAt: { lt: new Date() },
        },
    });

    const activeSessions = await prisma.subAdminSession.findMany({
        where: {
            subAdminId: subadmin.id,
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "asc" },
    });

    while (activeSessions.length >= maxSessions) {
        const oldest = activeSessions.shift();
        if (oldest) {
            await prisma.subAdminSession.delete({ where: { id: oldest.id } }).catch(() => null);
        }
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);
    const expiresAt = new Date(Date.now() + timeoutMin * 60 * 1000);

    await prisma.subAdminSession.create({
        data: {
            subAdminId: subadmin.id,
            tokenHash,
            expiresAt,
        },
    });

    return { token, expiresAt, urlId };
}

export function attachSubAdminSessionCookie(response, token, expiresAt, urlId) {
    response.cookies.set(SUBADMIN_SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: expiresAt,
    });
    response.cookies.set(SUBADMIN_URLID_COOKIE, urlId, {
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        expires: expiresAt,
    });
}

export function clearSubAdminSessionCookie(response) {
    response.cookies.set(SUBADMIN_SESSION_COOKIE_NAME, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    });
    response.cookies.set(SUBADMIN_URLID_COOKIE, "", {
        httpOnly: false,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
    });
}

export async function getSubAdminSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SUBADMIN_SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const tokenHash = hashToken(token);
    const session = await prisma.subAdminSession.findUnique({
        where: { tokenHash },
        include: { subAdmin: { include: { role: true } } },
    });

    if (!session) return null;

    const timeoutMin = session.subAdmin?.sessionTimeoutMin || 10;
    const timeoutAt = new Date(session.createdAt.getTime() + timeoutMin * 60 * 1000);

    if (new Date() > timeoutAt) {
        await prisma.subAdminSession.delete({ where: { id: session.id } }).catch(() => null);
        return null;
    }

    if (session.expiresAt < new Date()) {
        await prisma.subAdminSession.delete({ where: { id: session.id } }).catch(() => null);
        return null;
    }

    return session;
}

export async function getSessionSubAdmin() {
    const session = await getSubAdminSession();
    return session?.subAdmin || null;
}

export function checkPermission(subadmin, permission) {
    if (!subadmin) return false;
    if (!subadmin.role) return true;
    const permissions = subadmin.role.permissions || [];
    return permissions.includes(permission);
}

export function checkAnyPermission(subadmin, permissionList) {
    if (!subadmin) return false;
    if (!subadmin.role) return true;
    const permissions = subadmin.role.permissions || [];
    return permissionList.some(p => permissions.includes(p));
}

export function getSubAdminPermissions(subadmin) {
    if (!subadmin) return [];
    if (!subadmin.role) return [];
    return subadmin.role.permissions || [];
}

export function hasPermission(rolePermissions, permission) {
    if (!rolePermissions || !Array.isArray(rolePermissions)) return false;
    return rolePermissions.includes(permission);
}

export function canAccessSection(rolePermissions, section) {
    if (rolePermissions === null || rolePermissions === undefined) return true;
    if (!Array.isArray(rolePermissions)) return true;
    const sectionViewPermissions = {
        dashboard: "dashboard.view",
        courses: "courses.view",
        studyMaterials: "materials.view",
        categories: "types.view",
        pdfs: "pdfs.view",
        quizzes: "quizzes.view",
        blogs: "blogs.view",
        faqs: "faqs.view",
        features: "features.view",
        reviews: "reviews.view",
        marquee: "marquee.view",
        colors: "colors.view",
        certificates: "certificates.view",
        siteSettings: "settings.view",
        subadmins: "subadmins.view",
        roles: "roles.view",
        contacts: "contacts.view",
    };

    const viewPermission = sectionViewPermissions[section];
    if (!viewPermission) return false;
    return hasPermission(rolePermissions, viewPermission);
}

export function canViewSection(rolePermissions, section) {
    return canAccessSection(rolePermissions, section);
}

export function getSectionViewPermission(section) {
    const sectionViewPermissions = {
        dashboard: "dashboard.view",
        courses: "courses.view",
        studyMaterials: "materials.view",
        categories: "types.view",
        pdfs: "pdfs.view",
        quizzes: "quizzes.view",
        blogs: "blogs.view",
        faqs: "faqs.view",
        features: "features.view",
        reviews: "reviews.view",
        marquee: "marquee.view",
        colors: "colors.view",
        certificates: "certificates.view",
        siteSettings: "settings.view",
        subadmins: "subadmins.view",
        roles: "roles.view",
        contacts: "contacts.view",
    };
    return sectionViewPermissions[section] || null;
}

export function getAccessibleSections(rolePermissions) {
    const sections = [
        { key: "dashboard", label: "Dashboard", icon: "📊" },
        { key: "courses", label: "Courses", icon: "📚" },
        { key: "studyMaterials", label: "Study Materials", icon: "📄" },
        { key: "pdfs", label: "PDF Notes", icon: "📝" },
        { key: "categories", label: "Categories", icon: "🏷️" },
        { key: "quizzes", label: "Quizzes", icon: "❓" },
        { key: "blogs", label: "Blogs", icon: "📝" },
        { key: "faqs", label: "FAQs", icon: "❓" },
        { key: "features", label: "Features", icon: "✨" },
        { key: "reviews", label: "Reviews", icon: "⭐" },
        { key: "marquee", label: "Marquee", icon: "🎠" },
        { key: "colors", label: "Colors", icon: "🎨" },
        { key: "certificates", label: "Certificates", icon: "🏆" },
        { key: "siteSettings", label: "Settings", icon: "⚙️" },
        { key: "contacts", label: "Contacts", icon: "📧" },
    ];

    return sections.filter(s => canAccessSection(rolePermissions, s.key));
}

export function getFirstAccessibleSection(rolePermissions) {
    const sections = [
        { key: "dashboard", label: "Dashboard", icon: "📊" },
        { key: "courses", label: "Courses", icon: "📚" },
        { key: "studyMaterials", label: "Study Materials", icon: "📄" },
        { key: "pdfs", label: "PDF Notes", icon: "📝" },
        { key: "categories", label: "Categories", icon: "🏷️" },
        { key: "quizzes", label: "Quizzes", icon: "❓" },
        { key: "blogs", label: "Blogs", icon: "📝" },
        { key: "faqs", label: "FAQs", icon: "❓" },
        { key: "features", label: "Features", icon: "✨" },
        { key: "reviews", label: "Reviews", icon: "⭐" },
        { key: "marquee", label: "Marquee", icon: "🎠" },
        { key: "colors", label: "Colors", icon: "🎨" },
        { key: "certificates", label: "Certificates", icon: "🏆" },
        { key: "siteSettings", label: "Settings", icon: "⚙️" },
        { key: "contacts", label: "Contacts", icon: "📧" },
    ];

    return sections.find(s => canAccessSection(rolePermissions, s.key)) || null;
}

export function getFirstAccessibleSectionUrl(rolePermissions, urlId) {
    const firstSection = getFirstAccessibleSection(rolePermissions);
    if (!firstSection) return null;
    const sectionSlug = firstSection.key === "dashboard" ? "dashboard" : firstSection.key.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase();
    return `/${urlId}/${sectionSlug}`;
}

export async function requireSubAdminUrlId(urlId) {
    const cookieStore = await cookies();
    const storedUrlId = cookieStore.get(SUBADMIN_URLID_COOKIE)?.value;

    if (!storedUrlId || storedUrlId !== urlId) {
        return false;
    }

    const subadmin = await getSessionSubAdmin();
    if (!subadmin || subadmin.urlId !== urlId) {
        return false;
    }

    return true;
}

export async function requireSubAdminUrlIdApi(urlId) {
    const isValid = await requireSubAdminUrlId(urlId);
    if (!isValid) {
        return {
            authorized: false,
            unauthorized: NextResponse.json(
                { error: "Access denied. You don't have permission to access this page." },
                { status: 403 }
            ),
        };
    }
    return { authorized: true, unauthorized: null };
}

export function requirePermission(subadmin, permission) {
    if (!subadmin) {
        return { allowed: false, error: null };
    }
    if (!subadmin.role) {
        return { allowed: false, error: "No role assigned" };
    }
    const permissions = subadmin.role.permissions || [];
    if (!permissions.includes(permission)) {
        return { allowed: false, error: "Permission denied" };
    }
    return { allowed: true, error: null };
}

export function requirePermissionApi(subadmin, permission) {
    const result = requirePermission(subadmin, permission);
    if (!result.allowed) {
        return {
            allowed: false,
            response: NextResponse.json(
                { error: result.error || "Permission denied. You don't have access to this action." },
                { status: 403 }
            ),
        };
    }
    return { allowed: true, response: null };
}
