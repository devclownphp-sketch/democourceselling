import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const payload = await request.json();
        const orderedIds = Array.isArray(payload?.orderedIds) ? payload.orderedIds : [];

        if (orderedIds.length === 0) {
            return NextResponse.json({ error: "orderedIds is required." }, { status: 400 });
        }

        await prisma.$transaction(
            orderedIds.map((id, index) =>
                prisma.courseType.update({
                    where: { id },
                    data: { sortOrder: index },
                }),
            ),
        );

        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Could not reorder course types." }, { status: 400 });
    }
}
