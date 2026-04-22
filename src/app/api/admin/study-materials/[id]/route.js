import { NextResponse } from "next/server";
import { requireSubAdminPermission } from "@/lib/permission-check";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
    title: z.string().trim().min(1).optional(),
    description: z.string().trim().optional(),
    category: z.string().trim().min(1).optional(),
    categoryId: z.string().optional().nullable(),
    pdfUrl: z.string().trim().url().or(z.string().trim().startsWith("/")).optional(),
    viewerType: z.enum(["embed", "drive", "s3"]).optional(),
    thumbnail: z.string().trim().url().optional().nullable(),
    sortOrder: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
});

export async function PUT(request, { params }) {
    const perm = await requireSubAdminPermission("materials.edit");
    if (!perm.authorized) return perm.response;

    try {
        const { id } = await params;
        const payload = await request.json();
        const parsed = updateSchema.parse(payload);

        const updateData = { ...parsed };
        if (parsed.categoryId === "") {
            updateData.categoryId = null;
        }

        const material = await prisma.studyMaterial.update({
            where: { id },
            data: updateData,
            include: { course: true },
        });

        return NextResponse.json({ ok: true, material });
    } catch (error) {
        if (error?.issues) {
            const firstIssue = error.issues[0];
            const fieldName = firstIssue?.path?.[0] || "";
            const message = firstIssue?.message || "Validation failed";
            return NextResponse.json({ error: `${fieldName}: ${message}` }, { status: 400 });
        }

        return NextResponse.json({ error: error?.message || "Failed to update material" }, { status: 400 });
    }
}

export async function DELETE(_request, { params }) {
    const perm = await requireSubAdminPermission("materials.delete");
    if (!perm.authorized) return perm.response;

    try {
        const { id } = await params;
        await prisma.studyMaterial.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete material" }, { status: 400 });
    }
}
