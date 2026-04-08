import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { parseCourseTypePayload } from "@/lib/course-type-schema";

export async function GET() {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    const courseTypes = await prisma.courseType.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ courseTypes });
}

export async function POST(request) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const payload = await request.json();
        const parsed = parseCourseTypePayload(payload);
        const maxOrder = await prisma.courseType.aggregate({ _max: { sortOrder: true } });

        const courseType = await prisma.courseType.create({
            data: {
                ...parsed,
                sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
            },
        });

        return NextResponse.json({ ok: true, courseType });
    } catch (error) {
        if (error?.issues) {
            const firstIssue = error.issues[0];
            const fieldName = firstIssue?.path?.[0] || "";
            const message = firstIssue?.message || "Validation failed.";
            return NextResponse.json({ error: `${fieldName}: ${message}` }, { status: 400 });
        }

        return NextResponse.json({ error: error?.message || "Could not create course type." }, { status: 400 });
    }
}
