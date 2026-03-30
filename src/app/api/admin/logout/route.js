import { NextResponse } from "next/server";
import { clearSessionCookie, getSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
    const session = await getSession();
    if (session) {
        await prisma.adminSession.delete({ where: { id: session.id } }).catch(() => null);
    }

    const response = NextResponse.json({ ok: true });
    clearSessionCookie(response);
    return response;
}
