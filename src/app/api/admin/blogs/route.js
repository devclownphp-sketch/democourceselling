import { NextResponse } from "next/server";
import { parseBlogPayload } from "@/lib/blog-schema";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

async function createUniqueSlug(baseTitle) {
    const base = slugify(baseTitle);
    let slug = base;
    let index = 1;

    while (true) {
        const exists = await prisma.blog.findUnique({ where: { slug } });
        if (!exists) return slug;
        index += 1;
        slug = `${base}-${index}`;
    }
}

export async function GET() {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    const blogs = await prisma.blog.findMany({
        orderBy: { createdAt: "desc" },
        include: { admin: { select: { username: true } } },
    });
    return NextResponse.json({ blogs });
}

export async function POST(request) {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const payload = await request.json();
        const parsed = parseBlogPayload(payload);
        const slug = await createUniqueSlug(parsed.title);

        const blog = await prisma.blog.create({
            data: {
                ...parsed,
                slug,
                adminId: admin.id,
            },
            include: { admin: { select: { username: true } } },
        });

        return NextResponse.json({ ok: true, blog });
    } catch (error) {
        if (error?.issues) {
            const firstIssue = error.issues[0];
            const fieldName = firstIssue?.path?.[0] || "";
            const message = firstIssue?.message || "Validation failed.";
            return NextResponse.json(
                {
                    error: `${fieldName}: ${message}`,
                },
                { status: 400 },
            );
        }

        return NextResponse.json(
            {
                error: error?.message || "Could not create blog.",
            },
            { status: 400 },
        );
    }
}
