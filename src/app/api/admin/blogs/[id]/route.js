import { NextResponse } from "next/server";
import { parseBlogPayload } from "@/lib/blog-schema";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

async function createUniqueSlug(baseTitle, currentSlug) {
    const base = slugify(baseTitle);
    let slug = base;
    let index = 1;

    while (true) {
        if (slug === currentSlug) return slug;
        const exists = await prisma.blog.findUnique({ where: { slug } });
        if (!exists) return slug;
        index += 1;
        slug = `${base}-${index}`;
    }
}

export async function PUT(request, { params }) {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    const { id } = await params;

    try {
        const blog = await prisma.blog.findUnique({ where: { id } });
        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        const payload = await request.json();
        const parsed = parseBlogPayload(payload);
        const slug = await createUniqueSlug(parsed.title, blog.slug);

        const updated = await prisma.blog.update({
            where: { id },
            data: {
                ...parsed,
                slug,
            },
            include: { admin: { select: { username: true } } },
        });

        return NextResponse.json({ ok: true, blog: updated });
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
                error: error?.message || "Could not update blog.",
            },
            { status: 400 },
        );
    }
}

export async function DELETE(request, { params }) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    const { id } = await params;

    try {
        const blog = await prisma.blog.findUnique({ where: { id } });
        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }

        await prisma.blog.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json(
            {
                error: error?.message || "Could not delete blog.",
            },
            { status: 400 },
        );
    }
}
