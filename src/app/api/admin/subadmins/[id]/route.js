import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

const updateSchema = z.object({
    username: z.string().trim().min(3).max(30).optional(),
    password: z.string().min(6).optional(),
    roleId: z.string().trim().optional().nullable(),
    sessionTimeoutMin: z.number().int().min(1).max(60).optional(),
    maxSessions: z.number().int().min(1).max(5).optional(),
    isActive: z.boolean().optional(),
});

export async function PUT(request, { params }) {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { id } = await params;
        const payload = await request.json();
        const parsed = updateSchema.parse(payload);

        const updateData = { ...parsed };
        if (parsed.password) {
            updateData.passwordHash = await bcrypt.hash(parsed.password, 12);
            delete updateData.password;
        }

        const subadmin = await prisma.subAdmin.update({
            where: { id },
            data: updateData,
            include: { role: true },
        });

        return NextResponse.json({ ok: true, subadmin });
    } catch (error) {
        if (error?.issues) {
            const firstIssue = error.issues[0];
            return NextResponse.json({ error: `${firstIssue?.path?.[0]}: ${firstIssue?.message}` }, { status: 400 });
        }
        return NextResponse.json({ error: error?.message || "Failed to update subadmin" }, { status: 400 });
    }
}

export async function DELETE(_request, { params }) {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { id } = await params;
        await prisma.subAdmin.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete subadmin" }, { status: 400 });
    }
}