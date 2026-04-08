import { NextResponse } from "next/server";
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

    const courses = await prisma.course.findMany({
        orderBy: { createdAt: "desc" },
        include: { courseType: true },
    });
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
                error: error?.message || "Could not create course.",
            },
            { status: 400 },
        );
    }
}
