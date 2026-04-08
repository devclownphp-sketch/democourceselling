import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { parseCourseTypePayload } from "@/lib/course-type-schema";

export async function PUT(request, { params }) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { id } = await params;
        const payload = await request.json();
        const parsed = parseCourseTypePayload(payload);

        const courseType = await prisma.courseType.update({
            where: { id },
            data: parsed,
        });

        return NextResponse.json({ ok: true, courseType });
    } catch (error) {
        if (error?.issues) {
            const firstIssue = error.issues[0];
            const fieldName = firstIssue?.path?.[0] || "";
            const message = firstIssue?.message || "Validation failed.";
            return NextResponse.json({ error: `${fieldName}: ${message}` }, { status: 400 });
        }

        return NextResponse.json({ error: error?.message || "Could not update course type." }, { status: 400 });
    }
}

export async function DELETE(_request, { params }) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { id } = await params;
        await prisma.courseType.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Could not delete course type." }, { status: 400 });
    }
}
