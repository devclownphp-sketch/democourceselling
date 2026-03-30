import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { parseCoursePayload } from "@/lib/course-schema";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

async function createUniqueSlug(baseTitle) {
    const base = slugify(baseTitle);
    let slug = base;
    let index = 1;

    while (true) {
        const exists = await prisma.course.findUnique({ where: { slug } });
        if (!exists) return slug;
        index += 1;
        slug = `${base}-${index}`;
    }
}

export async function GET() {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    const courses = await prisma.course.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ courses });
}

export async function POST(request) {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const payload = await request.json();
        const parsed = parseCoursePayload(payload);
        const slug = await createUniqueSlug(parsed.title);

        const course = await prisma.course.create({
            data: {
                ...parsed,
                slug,
                adminId: admin.id,
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
                error: error?.message || "Could not create course.",
            },
            { status: 400 },
        );
    }
}
