import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request, { params }) {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { id, sessionId } = await params;
        await prisma.subAdminSession.deleteMany({
            where: { id: sessionId, subAdminId: id },
        });
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Failed to logout session" }, { status: 400 });
    }
}