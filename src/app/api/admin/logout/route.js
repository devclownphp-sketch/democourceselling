import { NextResponse } from "next/server";
import { clearSessionCookie, clearSubAdminSessionCookie, getSession, getSubAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
    const adminSession = await getSession();
    if (adminSession) {
        await prisma.adminSession.delete({ where: { id: adminSession.id } }).catch(() => null);
        const response = NextResponse.json({ ok: true });
        clearSessionCookie(response);
        return response;
    }
    const subadminSession = await getSubAdminSession();
    if (subadminSession) {
        const fullSession = await prisma.subAdminSession.findUnique({
            where: { subAdminId: subadminSession.id },
        });
        if (fullSession) {
            await prisma.subAdminSession.delete({ where: { id: fullSession.id } }).catch(() => null);
        }
        const response = NextResponse.json({ ok: true });
        clearSubAdminSessionCookie(response);
        return response;
    }

    return NextResponse.json({ ok: true });
}
