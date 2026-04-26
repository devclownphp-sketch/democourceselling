import { NextResponse } from "next/server";
import { clearSubAdminSessionCookie, getSubAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
    const session = await getSubAdminSession();
    if (session) {
        const fullSession = await prisma.subAdminSession.findFirst({
            where: { subAdminId: session.id },
        });
        if (fullSession) {
            await prisma.subAdminSession.delete({ where: { id: fullSession.id } }).catch(() => null);
        }
    }

    const response = NextResponse.json({ ok: true });
    clearSubAdminSessionCookie(response);
    return response;
}