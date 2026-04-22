import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
    name: z.string().trim().min(2, "Name is required").max(50),
    permissions: z.array(z.string()).default([]),
});

export async function GET() {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    const roles = await prisma.role.findMany({
        orderBy: { name: "asc" },
    });

    return NextResponse.json({ roles });
}

export async function POST(request) {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    if (admin.username !== "clown") {
        return NextResponse.json({ error: "Only main admin can create roles" }, { status: 403 });
    }

    try {
        const payload = await request.json();
        const parsed = createSchema.parse(payload);

        const existing = await prisma.role.findUnique({
            where: { name: parsed.name },
        });

        if (existing) {
            return NextResponse.json({ error: "Role name already exists" }, { status: 400 });
        }

        const role = await prisma.role.create({
            data: parsed,
        });

        return NextResponse.json({ ok: true, role });
    } catch (error) {
        if (error?.issues) {
            const firstIssue = error.issues[0];
            return NextResponse.json({ error: `${firstIssue?.path?.[0]}: ${firstIssue?.message}` }, { status: 400 });
        }
        return NextResponse.json({ error: error?.message || "Failed to create role" }, { status: 400 });
    }
}