import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE_NAME = "admin_session";
const SUBADMIN_SESSION_COOKIE_NAME = "subadmin_session";
const SESSION_DAYS = 7;

function sessionExpiryDate() {
    const date = new Date();
    date.setDate(date.getDate() + SESSION_DAYS);
    return date;
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
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);
    const expiresAt = sessionExpiryDate();

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
    if (!admin) {
        return {
            admin: null,
            unauthorized: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    return {
        admin,
        unauthorized: null,
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

export async function createSubAdminSession(subadminId) {
    const subadmin = await prisma.subAdmin.findUnique({
        where: { id: subadminId },
    });

    if (!subadmin) return null;

    const timeoutMin = subadmin.sessionTimeoutMin || 30;
    const maxSessions = subadmin.maxSessions || 2;

    const activeSessions = await prisma.subAdminSession.findMany({
        where: {
            subAdminId: subadminId,
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
            subAdminId: subadminId,
            tokenHash,
            expiresAt,
        },
    });

    return { token, expiresAt };
}

export function attachSubAdminSessionCookie(response, token, expiresAt) {
    response.cookies.set(SUBADMIN_SESSION_COOKIE_NAME, token, {
        httpOnly: true,
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
