import { NextResponse } from "next/server";
import { parseCoursePayload } from "@/lib/course-schema";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

async function uniqueSlugForUpdate(id, title) {
    const base = slugify(title);
    let slug = base;
    let index = 1;

    while (true) {
        const existing = await prisma.course.findUnique({ where: { slug } });
        if (!existing || existing.id === id) return slug;
        index += 1;
        slug = `${base}-${index}`;
    }
}

export async function PUT(request, { params }) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { id } = await params;
        const payload = await request.json();
        const parsed = parseCoursePayload(payload);
        const slug = await uniqueSlugForUpdate(id, parsed.title);

        const course = await prisma.course.update({
            where: { id },
            data: {
                ...parsed,
                slug,
            },
            include: { courseType: true },
        });

        return NextResponse.json({ ok: true, course });
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
                error: error?.message || "Could not update course.",
            },
            { status: 400 },
        );
    }
}

export async function DELETE(_request, { params }) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { id } = await params;
        await prisma.course.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Could not delete course." }, { status: 400 });
    }
}
