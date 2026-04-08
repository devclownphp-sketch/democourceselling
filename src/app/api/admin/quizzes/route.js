import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { parseQuizPayload } from "@/lib/quiz-schema";

async function createUniqueSlug(baseTitle) {
    const base = slugify(baseTitle);
    let slug = base;
    let index = 1;

    while (true) {
        const exists = await prisma.quiz.findUnique({ where: { slug } });
        if (!exists) return slug;
        index += 1;
        slug = `${base}-${index}`;
    }
}

export async function GET() {
    const { unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    const quizzes = await prisma.quiz.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: {
            questions: {
                orderBy: { sortOrder: "asc" },
            },
        },
    });

    return NextResponse.json({ quizzes });
}

export async function POST(request) {
    const { admin, unauthorized } = await requireAdminApi();
    if (unauthorized) return unauthorized;

    try {
        const payload = await request.json();
        const parsed = parseQuizPayload(payload);
        const slug = await createUniqueSlug(parsed.title);

        const quiz = await prisma.quiz.create({
            data: {
                title: parsed.title,
                heading: parsed.heading,
                slug,
                category: parsed.category,
                minutes: parsed.minutes,
                rating: parsed.rating,
                sortOrder: parsed.sortOrder,
                isActive: parsed.isActive,
                adminId: admin.id,
                questions: {
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

        return NextResponse.json({ error: error?.message || "Could not create quiz." }, { status: 400 });
    }
}
