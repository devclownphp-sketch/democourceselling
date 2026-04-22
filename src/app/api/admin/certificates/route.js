import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    fileUrl: z.string().trim().url().or(z.string().trim().startsWith("/")).optional().default(""),
    fields: z.array(z.object({
        key: z.string(),
        label: z.string(),
        x: z.number(),
        y: z.number(),
        fontSize: z.number().optional(),
        color: z.string().optional(),
        width: z.number().optional(),
    })).optional(),
    isActive: z.boolean().default(false),
});

export async function GET() {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    const templates = await prisma.certificateTemplate.findMany({
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ templates });
}

export async function POST(request) {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        if (admin.username !== "clown") {
            return NextResponse.json({ error: "Only main admin can create templates" }, { status: 403 });
        }

        const payload = await request.json();
        const parsed = createSchema.parse(payload);

        if (parsed.isActive) {
            await prisma.certificateTemplate.updateMany({
                where: { isActive: true },
                data: { isActive: false },
            });
        }

        const template = await prisma.certificateTemplate.create({
            data: parsed,
        });

        return NextResponse.json({ ok: true, template });
    } catch (error) {
        if (error?.issues) {
            const firstIssue = error.issues[0];
            return NextResponse.json({ error: `${firstIssue?.path?.[0]}: ${firstIssue?.message}` }, { status: 400 });
        }
        return NextResponse.json({ error: error?.message || "Failed to create template" }, { status: 400 });
    }
}