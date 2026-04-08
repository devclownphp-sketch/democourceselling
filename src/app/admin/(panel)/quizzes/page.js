import QuizManager from "@/components/admin/QuizManager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminQuizzesPage() {
    const quizzes = await prisma.quiz.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: {
            questions: {
                orderBy: { sortOrder: "asc" },
            },
        },
    });

    return <QuizManager initialQuizzes={quizzes} />;
}
