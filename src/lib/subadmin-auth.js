import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

function hashToken(token) {
    return require("crypto").createHash("sha256").update(token).digest("hex");
}

export async function validateSubAdminAccess(request) {
    const cookieStore = await cookies();
    const urlId = request.nextUrl.pathname.match(/\/([A-Z0-9]{5})\//)?.[1];

    if (!urlId) {
        return { valid: false, response: NextResponse.json({ error: "Invalid URL" }, { status: 400 }) };
    }

    const sessionToken = cookieStore.get("subadmin_session")?.value;
    const storedUrlId = cookieStore.get("subadmin_urlid")?.value;

    if (!sessionToken || storedUrlId !== urlId) {
        return { valid: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }

    const tokenHash = hashToken(sessionToken);
    const session = await prisma.subAdminSession.findUnique({
        where: { tokenHash },
        include: { subAdmin: { include: { role: true } } },
    });

    if (!session) {
        return { valid: false, response: NextResponse.json({ error: "Session expired" }, { status: 401 }) };
    }

    const timeoutMin = session.subAdmin?.sessionTimeoutMin || 10;
    if (new Date() > new Date(session.createdAt.getTime() + timeoutMin * 60 * 1000)) {
        await prisma.subAdminSession.delete({ where: { id: session.id } }).catch(() => null);
        return { valid: false, response: NextResponse.json({ error: "Session expired" }, { status: 401 }) };
    }

    if (session.expiresAt < new Date()) {
        await prisma.subAdminSession.delete({ where: { id: session.id } }).catch(() => null);
        return { valid: false, response: NextResponse.json({ error: "Session expired" }, { status: 401 }) };
    }

    if (!session.subAdmin.isActive) {
        return { valid: false, response: NextResponse.json({ error: "Account disabled" }, { status: 403 }) };
    }

    return { valid: true, subadmin: session.subAdmin, urlId };
}

export function checkSubAdminPermission(subadmin, permission) {
    if (!subadmin) return false;
    if (!subadmin.role) return false;
    const permissions = subadmin.role.permissions || [];
    return permissions.includes(permission);
}

export function requireSubAdminPermission(subadmin, permission) {
    if (!checkSubAdminPermission(subadmin, permission)) {
        return NextResponse.json(
            { error: "Permission denied. You don't have access to this action." },
            { status: 403 }
        );
    }
    return null;
}

export function parseSubadminUrlId(pathname) {
    const match = pathname.match(/\/([A-Z0-9]{5})\/api\//);
    return match ? match[1] : null;
}