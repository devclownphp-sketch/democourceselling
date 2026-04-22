import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
    name: z.string().trim().min(2).max(50).optional(),
    permissions: z.array(z.string()).optional(),
});

export async function PUT(request, { params }) {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { id } = await params;
        const payload = await request.json();
        const parsed = updateSchema.parse(payload);

        const role = await prisma.role.update({
            where: { id },
            data: parsed,
        });

        return NextResponse.json({ ok: true, role });
    } catch (error) {
        if (error?.issues) {
            const firstIssue = error.issues[0];
            return NextResponse.json({ error: `${firstIssue?.path?.[0]}: ${firstIssue?.message}` }, { status: 400 });
        }
        return NextResponse.json({ error: error?.message || "Failed to update role" }, { status: 400 });
    }
}

export async function DELETE(_request, { params }) {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { id } = await params;

        const subadmins = await prisma.subAdmin.findMany({
            where: { roleId: id },
        });

        if (subadmins.length > 0) {
            return NextResponse.json({
                error: `Cannot delete role. ${subadmins.length} subadmin(s) are using this role.`,
            }, { status: 400 });
        }

        await prisma.role.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete role" }, { status: 400 });
    }
}