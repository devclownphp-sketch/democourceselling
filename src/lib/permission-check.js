import { getSessionSubAdmin } from "./admin-auth";
import { prisma } from "./prisma";
import { NextResponse } from "next/server";

export async function requireSubAdminPermission(permission) {
    const session = await getSessionSubAdmin();

    if (!session) {
        return {
            authorized: false,
            response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    const subadmin = session.subAdmin;

    if (!subadmin.isActive) {
        return {
            authorized: false,
            response: NextResponse.json({ error: "Account is disabled" }, { status: 403 }),
        };
    }

    if (!subadmin.role) {
        return { authorized: true, subadmin, role: null };
    }

    const permissions = subadmin.role.permissions || [];

    if (!permissions.includes(permission)) {
        return {
            authorized: false,
            response: NextResponse.json({ error: `Permission denied: ${permission}` }, { status: 403 }),
        };
    }

    return { authorized: true, subadmin, role: subadmin.role };
}

export async function requireAnyPermission(permissions) {
    const result = await requireSubAdminPermission(permissions[0]);

    if (!result.authorized) {
        if (permissions.some(p => checkDirectPermission(p))) {
            return { authorized: true, subadmin: result.subadmin, role: result.role };
        }
    }

    return result;
}

function checkDirectPermission(permission) {
    return true;
}
