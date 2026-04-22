import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
    name: z.string().trim().min(1).optional(),
    fileUrl: z.string().trim().url().or(z.string().trim().startsWith("/")).optional(),
    fields: z.array(z.object({
        key: z.string(),
        label: z.string(),
        x: z.number(),
        y: z.number(),
        fontSize: z.number().optional(),
        color: z.string().optional(),
        width: z.number().optional(),
    })).optional(),
    isActive: z.boolean().optional(),
});

export async function PUT(request, { params }) {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { id } = await params;
        const payload = await request.json();
        const parsed = updateSchema.parse(payload);

        if (parsed.isActive) {
            await prisma.certificateTemplate.updateMany({
                where: { id: { not: id }, isActive: true },
                data: { isActive: false },
            });
        }

        const template = await prisma.certificateTemplate.update({
            where: { id },
            data: parsed,
        });

        return NextResponse.json({ ok: true, template });
    } catch (error) {
        if (error?.issues) {
            const firstIssue = error.issues[0];
            return NextResponse.json({ error: `${firstIssue?.path?.[0]}: ${firstIssue?.message}` }, { status: 400 });
        }
        return NextResponse.json({ error: error?.message || "Failed to update template" }, { status: 400 });
    }
}

export async function DELETE(_request, { params }) {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { id } = await params;
        await prisma.certificateTemplate.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete template" }, { status: 400 });
    }
}