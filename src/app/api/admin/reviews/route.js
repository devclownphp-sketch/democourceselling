import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { parseReviewPayload } from "@/lib/review-schema";

export async function GET() {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    const reviews = await prisma.review.findMany({
        orderBy: [{ sortOrder: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ reviews });
}

export async function POST(request) {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const payload = await request.json();
        const parsed = parseReviewPayload(payload);

        const review = await prisma.review.create({
            data: {
                ...parsed,
                adminId: admin.id,
            },
        });

        return NextResponse.json({ ok: true, review });
    } catch (error) {
        if (error?.issues) {
            const firstIssue = error.issues[0];
            const fieldName = firstIssue?.path?.[0] || "";
            const message = firstIssue?.message || "Validation failed.";
            return NextResponse.json({ error: `${fieldName}: ${message}` }, { status: 400 });
        }

        return NextResponse.json({ error: error?.message || "Could not create review." }, { status: 400 });
    }
}