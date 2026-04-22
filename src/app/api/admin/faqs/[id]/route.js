import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
    await requireAdminApi();

    try {
        const { id } = params;
        const body = await request.json();
        const { question, answer, sortOrder, isActive } = body;

        const faq = await prisma.fAQ.update({
            where: { id },
            data: {
                ...(question && { question }),
                ...(answer && { answer }),
                ...(typeof sortOrder === "number" && { sortOrder }),
                ...(typeof isActive === "boolean" && { isActive }),
            },
        });

        return NextResponse.json({ faq });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    await requireAdminApi();

    try {
        const { id } = params;
        await prisma.fAQ.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
