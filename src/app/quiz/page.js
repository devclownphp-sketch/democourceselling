import Link from "next/link";
import { prisma } from "@/lib/prisma";
import VisitTracker from "@/components/VisitTracker";
import { IconClock, IconStar, IconQuiz } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function QuizListPage() {
    const quizzes = await prisma.quiz.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        include: {
            questions: {
                select: { id: true },
            },
        },
    });

    return (
        <div className="quiz-page">
            <VisitTracker />

            {/* Header */}
            <div className="quiz-header">
                <div className="quiz-header-content">
                    <p className="quiz-subtitle">Practice Tests</p>
                    <h1 className="quiz-title">All Computer Course Quizzes</h1>
                    <p className="quiz-desc">Test your knowledge and skills with free online practice for every topic</p>
                </div>
            </div>

            {/* Quiz Grid */}
            <div className="quiz-container">
                <div className="quiz-grid">
                    {quizzes.map((quiz) => (
                        <article key={quiz.id} className="brutal-quiz-card">
                            <div className="brutal-quiz-card-header">
                                <div>
                                    <p className="brutal-quiz-category">{quiz.category}</p>
                                    <h2 className="brutal-quiz-title">{quiz.title}</h2>
                                </div>
                                <IconQuiz size={26} color="#ffd400" />
                            </div>
                            <div className="brutal-quiz-card-body">
                                <p className="brutal-quiz-heading">{quiz.heading}</p>
                                <div className="brutal-quiz-meta">
                                    <span className="brutal-quiz-meta-item">
                                        <IconClock size={12} /> {quiz.minutes} mins
                                    </span>
                                    <span className="brutal-quiz-meta-item">{quiz.questions.length} Questions</span>
                                    <span className="brutal-quiz-meta-item">
                                        <IconStar size={12} color="#ffd400" /> {Number(quiz.rating || 4.5).toFixed(1)}
                                    </span>
                                </div>
                                <div className="brutal-quiz-action">
                                    <Link href={`/quiz/${quiz.slug}`} className="brutal-quiz-btn">
                                        Start Quiz
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}

                    {quizzes.length === 0 && (
                        <div className="brutal-quiz-empty">
                            No quizzes are active yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
