"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { IconClock, IconStar } from "@/components/Icons";

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function QuizAttemptClient({ quiz }) {
    const [selected, setSelected] = useState({});
    const [manualSubmitted, setManualSubmitted] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(quiz.minutes * 60);
    const submitted = manualSubmitted || secondsLeft <= 0;

    const totalQuestions = quiz.questions.length;

    useEffect(() => {
        if (submitted) return;

        const intervalId = setInterval(() => {
            setSecondsLeft((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [secondsLeft, submitted]);

    const score = useMemo(() => {
        return quiz.questions.reduce((count, question) => {
            return selected[question.id] === question.correctIndex ? count + 1 : count;
        }, 0);
    }, [quiz.questions, selected]);

    const progressPercent = Math.min(100, Math.round((Object.keys(selected).length / totalQuestions) * 100));

    const chooseOption = (questionId, optionIndex) => {
        if (submitted) return;
        setSelected((prev) => ({ ...prev, [questionId]: optionIndex }));
    };

    const submitQuiz = () => {
        setManualSubmitted(true);
    };

    return (
        <div className="mx-auto w-[min(980px,94vw)] py-10 md:py-14" style={{ color: "var(--ink)" }}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <Link href="/quiz" className="text-sm font-semibold hover:underline" style={{ color: "var(--brand)" }}>
                    Back to Quizzes
                </Link>
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm" style={{ border: "1px solid var(--line)", background: "var(--paper)", color: "var(--ink)" }}>
                    <IconClock size={14} /> {formatTime(Math.max(0, secondsLeft))}
                </div>
            </div>

            <section className="rounded-2xl p-5 md:p-7" style={{ border: "1px solid var(--line)", background: "var(--paper)" }}>
                <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--brand)" }}>{quiz.category}</p>
                <h1 className="mt-1 text-3xl font-bold md:text-4xl">{quiz.heading}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
                    <span>{quiz.title}</span>
                    <span className="inline-flex items-center gap-1"><IconStar size={13} color="#f59e0b" /> {Number(quiz.rating || 4.5).toFixed(1)}</span>
                    <span>{totalQuestions} Questions</span>
                    <span>{quiz.minutes} Minutes</span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full" style={{ background: "#e2e8f0" }}>
                    <div className="h-full rounded-full" style={{ width: `${progressPercent}%`, background: "linear-gradient(to right, #0ea5e9, #2563eb)" }} />
                </div>
            </section>

            <section className="mt-5 space-y-4">
                {quiz.questions.map((question, index) => {
                    const selectedIndex = selected[question.id];
                    return (
                        <article key={question.id} className="rounded-xl p-4" style={{ border: "1px solid var(--line)", background: "var(--paper)" }}>
                            <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                                Q{index + 1}. {question.questionText}
                            </p>
                            <div className="mt-3 space-y-2">
                                {question.options.map((option, optionIndex) => {
                                    const isSelected = selectedIndex === optionIndex;
                                    const isCorrect = submitted && question.correctIndex === optionIndex;
                                    const isWrongSelected = submitted && isSelected && !isCorrect;

                                    return (
                                        <button
                                            key={`${question.id}-option-${optionIndex}`}
                                            type="button"
                                            onClick={() => chooseOption(question.id, optionIndex)}
                                            className="w-full rounded-lg px-3 py-2 text-left text-sm transition"
                                            style={{
                                                border: `1px solid ${isCorrect ? "#16a34a" : isWrongSelected ? "#dc2626" : isSelected ? "#3b82f6" : "var(--line)"}`,
                                                background: isCorrect ? "#ecfdf3" : isWrongSelected ? "#fef2f2" : isSelected ? "#eff6ff" : "var(--paper)",
                                                color: "var(--ink)",
                                            }}
                                            disabled={submitted}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </article>
                    );
                })}
            </section>

            <section className="mt-6 rounded-xl p-4" style={{ border: "1px solid var(--line)", background: "var(--bg-alt)" }}>
                {!submitted ? (
                    <div className="inline-actions" style={{ justifyContent: "space-between" }}>
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                            {Object.keys(selected).length}/{totalQuestions} questions answered
                        </p>
                        <button type="button" className="btn-primary" onClick={submitQuiz}>Submit Quiz</button>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-xl font-bold" style={{ color: "var(--ink)" }}>
                            Your Score: {score}/{totalQuestions}
                        </h2>
                        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                            {score === totalQuestions ? "Perfect score." : "Answers are now highlighted with correct and incorrect choices."}
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
