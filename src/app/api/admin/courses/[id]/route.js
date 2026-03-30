import { NextResponse } from "next/server";
import { ZodError } from "zod";
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
        });

        return NextResponse.json({ ok: true, course });
    } catch (error) {
        if (error instanceof ZodError) {
            const fieldErrors = error.flatten().fieldErrors;
            const firstError = Object.values(fieldErrors).flat().find(Boolean);
            return NextResponse.json(
                {
                    error: firstError || "Validation failed. Please check the form fields.",
                    details: fieldErrors,
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
