import { NextResponse } from "next/server";
import { requireSubAdminPermission } from "@/lib/permission-check";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
    title: z.string().trim().min(1, "Title is required"),
    description: z.string().trim().optional().default(""),
    category: z.string().trim().min(1, "Category is required"),
    categoryId: z.string().optional().nullable(),
    pdfUrl: z.string().trim().url("Invalid PDF URL").or(z.string().trim().min(1).startsWith("/")),
    viewerType: z.enum(["embed", "drive", "s3"]).default("embed"),
    thumbnail: z.string().trim().url().optional().nullable().default(null),
    sortOrder: z.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
});

export async function GET() {
    const perm = await requireSubAdminPermission("materials.view");
    if (!perm.authorized) return perm.response;

    const materials = await prisma.studyMaterial.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: { course: true },
    });

    return NextResponse.json({ materials });
}

export async function POST(request) {
    const perm = await requireSubAdminPermission("materials.create");
    if (!perm.authorized) return perm.response;

    try {
        const payload = await request.json();
        const parsed = createSchema.parse(payload);

        const material = await prisma.studyMaterial.create({
            data: {
                title: parsed.title,
                description: parsed.description,
                category: parsed.category,
                categoryId: parsed.categoryId || null,
                pdfUrl: parsed.pdfUrl,
                viewerType: parsed.viewerType,
                thumbnail: parsed.thumbnail,
                sortOrder: parsed.sortOrder,
                isActive: parsed.isActive,
            },
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

        return NextResponse.json({ error: error?.message || "Failed to create material" }, { status: 400 });
    }
}
