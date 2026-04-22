import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
    await requireAdminApi();

    try {
        const { id } = params;
        const body = await request.json();
        const { icon, title, description, color, sortOrder, isActive } = body;

        const feature = await prisma.feature.update({
            where: { id },
            data: {
                ...(icon && { icon }),
                ...(title && { title }),
                ...(description && { description }),
                ...(color && { color }),
                ...(typeof sortOrder === "number" && { sortOrder }),
                ...(typeof isActive === "boolean" && { isActive }),
            },
        });

        return NextResponse.json({ feature });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await requireAdminApi();

    try {
        const { id } = params;
        await prisma.feature.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
