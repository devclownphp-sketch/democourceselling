import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VisitTracker from "@/components/VisitTracker";
import QuizAttemptClient from "@/components/quiz/QuizAttemptClient";

export const dynamic = "force-dynamic";

export default async function QuizDetailPage({ params }) {
    const { slug } = await params;

    const quiz = await prisma.quiz.findUnique({
        where: { slug },
        include: {
            questions: {
                orderBy: { sortOrder: "asc" },
            },
        },
    });

    if (!quiz || !quiz.isActive) {
        notFound();
    }

    return (
        <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text-dark)" }}>
            <VisitTracker />
            <QuizAttemptClient quiz={quiz} />
        </div>
    );
}
