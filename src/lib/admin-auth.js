import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE_NAME = "admin_session";
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
