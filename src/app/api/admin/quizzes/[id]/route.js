import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { parseQuizPayload } from "@/lib/quiz-schema";

async function uniqueSlugForUpdate(id, title) {
    const base = slugify(title);
    let slug = base;
    let index = 1;

    while (true) {
        const existing = await prisma.quiz.findUnique({ where: { slug } });
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
        const parsed = parseQuizPayload(payload);
        const slug = await uniqueSlugForUpdate(id, parsed.title);

        const quiz = await prisma.quiz.update({
            where: { id },
            data: {
                title: parsed.title,
                heading: parsed.heading,
                slug,
                category: parsed.category,
                minutes: parsed.minutes,
                rating: parsed.rating,
                sortOrder: parsed.sortOrder,
                isActive: parsed.isActive,
                questions: {
                    deleteMany: {},
                    create: parsed.questions.map((question, index) => ({
                        questionText: question.questionText,
                        options: question.options,
                        correctIndex: question.correctIndex,
                        sortOrder: question.sortOrder ?? index,
                    })),
                },
            },
            include: {
                questions: {
                    orderBy: { sortOrder: "asc" },
                },
            },
        });

        return NextResponse.json({ ok: true, quiz });
    } catch (error) {
        if (error?.issues) {
            const firstIssue = error.issues[0];
            const fieldName = firstIssue?.path?.[0] || "";
            const message = firstIssue?.message || "Validation failed.";
            return NextResponse.json({ error: `${fieldName}: ${message}` }, { status: 400 });
        }

        return NextResponse.json({ error: error?.message || "Could not update quiz." }, { status: 400 });
    }
}

export async function DELETE(_request, { params }) {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const { id } = await params;
        await prisma.quiz.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Could not delete quiz." }, { status: 400 });
    }
}
