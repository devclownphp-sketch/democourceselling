import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { orderedIds } = await request.json();

        if (!Array.isArray(orderedIds)) {
            return NextResponse.json({ error: "orderedIds must be an array" }, { status: 400 });
        }

        const updates = orderedIds.map((id, index) =>
            prisma.review.update({
                where: { id },
                data: { sortOrder: orderedIds.length - index },
            })
        );

        await prisma.$transaction(updates);

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Reorder error:", error);
        return NextResponse.json({ error: "Failed to reorder reviews" }, { status: 500 });
    }
}