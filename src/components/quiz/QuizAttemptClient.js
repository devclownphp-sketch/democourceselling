"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { IconClock, IconStar } from "@/components/Icons";

function difficultyStyle(difficulty) {
    const d = (difficulty || "Easy").toLowerCase();
    if (d === "medium") return { bg: "#fef9c3", color: "#854d0e", border: "#ca8a04" };
    if (d === "hard") return { bg: "#fef2f2", color: "#991b1b", border: "#dc2626" };
    return { bg: "#ecfdf5", color: "#166534", border: "#16a34a" };
}

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
    const ds = difficultyStyle(quiz.difficulty);

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
        <div className="mx-auto w-[min(980px,94vw)] py-10 md:py-14" style={{ color: "var(--text-dark)" }}>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <Link
                    href="/quiz"
                    className="text-sm font-semibold hover:underline"
                    style={{ color: "var(--primary)" }}
                >
                    ← Back to Quizzes
                </Link>
                <div
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
                    style={{ border: "2px solid var(--border)", background: "var(--paper)", color: "var(--text-dark)" }}
                >
                    <IconClock size={14} /> {formatTime(Math.max(0, secondsLeft))}
                </div>
            </div>

            <section
                className="rounded-2xl p-5 md:p-7"
                style={{ border: "2px solid var(--border)", background: "var(--paper)", boxShadow: "var(--shadow-md)" }}
            >
                <div className="flex items-center gap-3 flex-wrap mb-2">
                    <p
                        className="text-xs font-semibold uppercase tracking-[0.14em]"
                        style={{ color: "var(--primary)" }}
                    >
                        {quiz.category}
                    </p>
                    <span
                        className="text-xs font-bold px-2 py-1 rounded-full"
                        style={{ background: ds.bg, color: ds.color, border: `1px solid ${ds.border}` }}
                    >
                        {quiz.difficulty || "Easy"}
                    </span>
                </div>
                <h1 className="text-3xl font-bold md:text-4xl" style={{ color: "var(--text-dark)" }}>
                    {quiz.heading}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
                    <span>{quiz.title}</span>
                    <span className="inline-flex items-center gap-1">
                        <IconStar size={13} color="var(--star)" /> {Number(quiz.rating || 4.5).toFixed(1)}
                    </span>
                    <span>{totalQuestions} Questions</span>
                    <span>{quiz.minutes} Minutes</span>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                            width: `${progressPercent}%`,
                            background: "linear-gradient(to right, var(--secondary), var(--primary))",
                        }}
                    />
                </div>
                <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    {progressPercent}% complete — {Object.keys(selected).length} of {totalQuestions} answered
                </p>
            </section>

            <section className="mt-5 space-y-4">
                {quiz.questions.map((question, index) => {
                    const selectedIndex = selected[question.id];
                    return (
                        <article
                            key={question.id}
                            className="rounded-2xl p-5"
                            style={{
                                border: "2px solid var(--border)",
                                background: "var(--paper)",
                                boxShadow: "var(--shadow-sm)",
                            }}
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <span
                                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                                    style={{
                                        background: "var(--primary)",
                                        color: "#fff",
                                    }}
                                >
                                    {index + 1}
                                </span>
                                <p className="text-sm font-semibold leading-relaxed" style={{ color: "var(--text-dark)" }}>
                                    {question.questionText}
                                </p>
                            </div>
                            <div className="ml-0 space-y-2">
                                {question.options.map((option, optionIndex) => {
                                    const isSelected = selectedIndex === optionIndex;
                                    const isCorrect = submitted && question.correctIndex === optionIndex;
                                    const isWrongSelected = submitted && isSelected && !isCorrect;

                                    return (
                                        <button
                                            key={`${question.id}-option-${optionIndex}`}
                                            type="button"
                                            onClick={() => chooseOption(question.id, optionIndex)}
                                            className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-all"
                                            style={{
                                                border: `2px solid ${isCorrect ? "var(--success)" : isWrongSelected ? "var(--danger)" : isSelected ? "var(--primary)" : "var(--border)"}`,
                                                background: isCorrect
                                                    ? "var(--success-light)"
                                                    : isWrongSelected
                                                    ? "var(--danger-light)"
                                                    : isSelected
                                                    ? "var(--primary-light)"
                                                    : "var(--paper)",
                                                color: "var(--text-dark)",
                                                boxShadow: isSelected && !submitted ? "0 0 0 3px rgba(0, 132, 209, 0.15)" : "none",
                                            }}
                                            disabled={submitted}
                                        >
                                            <span
                                                className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold mr-2"
                                                style={{
                                                    background: isSelected ? "var(--primary)" : "var(--bg-alt)",
                                                    color: isSelected ? "#fff" : "var(--text-muted)",
                                                    border: isSelected ? "none" : "1px solid var(--border)",
                                                }}
                                            >
                                                {String.fromCharCode(65 + optionIndex)}
                                            </span>
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </article>
                    );
                })}
            </section>

            <section
                className="mt-6 rounded-2xl p-5"
                style={{ border: "2px solid var(--border)", background: "var(--bg-alt)" }}
            >
                {!submitted ? (
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                            {Object.keys(selected).length}/{totalQuestions} questions answered
                        </p>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all"
                            style={{
                                background: "var(--primary)",
                                color: "#fff",
                                boxShadow: "var(--shadow-sm)",
                            }}
                            onClick={submitQuiz}
                        >
                            Submit Quiz
                        </button>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-xl font-bold" style={{ color: "var(--text-dark)" }}>
                            Your Score: {score}/{totalQuestions}
                        </h2>
                        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                            {score === totalQuestions
                                ? "Perfect score! Well done!"
                                : `${totalQuestions - score} answer(s) were incorrect. Correct choices are highlighted in green.`}
                        </p>
                        <div className="mt-3 flex gap-3">
                            <Link
                                href="/quiz"
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-sm transition-all"
                                style={{
                                    background: "var(--bg-alt)",
                                    color: "var(--text-dark)",
                                    border: "2px solid var(--border)",
                                }}
                            >
                                ← Back to Quizzes
                            </Link>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
