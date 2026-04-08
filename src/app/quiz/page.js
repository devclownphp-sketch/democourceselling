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
        <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--ink)" }}>
            <VisitTracker />
            <section className="mx-auto w-[min(1120px,94vw)] py-10 md:py-14">
                <div className="rounded-2xl px-6 py-7 text-center" style={{ border: "1px solid #dbeafe", background: "linear-gradient(180deg, #eef6ff, #f8fbff)" }}>
                    <h1 className="text-3xl font-bold md:text-4xl" style={{ color: "#1e3a8a" }}>All Computer Course Quizzes</h1>
                    <p className="mt-2 text-sm" style={{ color: "#64748b" }}>Test your knowledge and skills with free online practice for every topic</p>
                </div>

                <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz) => (
                        <article key={quiz.id} className="overflow-hidden rounded-xl shadow-sm transition hover:-translate-y-1 hover:shadow-lg" style={{ border: "1px solid #dbe0ea", background: "#ffffff" }}>
                            <div className="flex items-center justify-between px-4 py-5" style={{ background: "linear-gradient(120deg, #0f172a, #1d4ed8)", color: "#ffffff" }}>
                                <div>
                                    <p className="text-[11px] uppercase tracking-wider" style={{ opacity: 0.85 }}>{quiz.category}</p>
                                    <h2 className="mt-1 text-xl font-semibold leading-tight">{quiz.title}</h2>
                                </div>
                                <IconQuiz size={26} color="#93c5fd" />
                            </div>
                            <div className="p-4">
                                <p className="text-sm font-semibold" style={{ color: "#1f2937" }}>{quiz.heading}</p>
                                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs" style={{ color: "#64748b" }}>
                                    <span className="inline-flex items-center gap-1"><IconClock size={12} /> {quiz.minutes} mins</span>
                                    <span>{quiz.questions.length} Questions</span>
                                    <span className="inline-flex items-center gap-1"><IconStar size={12} color="#f59e0b" /> {Number(quiz.rating || 4.5).toFixed(1)}</span>
                                </div>
                                <div className="mt-4">
                                    <Link href={`/quiz/${quiz.slug}`} className="inline-flex rounded-md px-3 py-2 text-xs font-semibold text-white transition hover:brightness-110" style={{ background: "#0284c7" }}>
                                        Start Quiz
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}

                    {quizzes.length === 0 && (
                        <div className="rounded-xl border border-dashed p-8 text-center sm:col-span-2 lg:col-span-3" style={{ borderColor: "var(--line)", background: "var(--paper)", color: "var(--text-muted)" }}>
                            No quizzes are active yet.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
