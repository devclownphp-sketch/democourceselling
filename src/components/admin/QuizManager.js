"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const blankQuestion = {
    questionText: "",
    options: ["", "", "", ""],
    correctIndex: "0",
    sortOrder: "0",
};

const defaultQuiz = {
    title: "",
    heading: "",
    category: "General",
    minutes: "10",
    rating: "4.5",
    sortOrder: "0",
    isActive: true,
    questions: [{ ...blankQuestion }],
};

function normalizeQuestion(question, index) {
    return {
        questionText: question.questionText,
        options: Array.isArray(question.options) ? question.options : ["", "", "", ""],
        correctIndex: String(question.correctIndex ?? 0),
        sortOrder: String(question.sortOrder ?? index),
    };
}

export default function QuizManager({ initialQuizzes }) {
    const [quizzes, setQuizzes] = useState(initialQuizzes);
    const [form, setForm] = useState(defaultQuiz);
    const [editingId, setEditingId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const heading = useMemo(() => (editingId ? "Update Quiz" : "Create Quiz"), [editingId]);

    const setField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const setQuestionField = (index, name, value) => {
        setForm((prev) => ({
            ...prev,
            questions: prev.questions.map((question, questionIndex) =>
                questionIndex === index ? { ...question, [name]: value } : question,
            ),
        }));
    };

    const setQuestionOption = (questionIndex, optionIndex, value) => {
        setForm((prev) => ({
            ...prev,
            questions: prev.questions.map((question, index) => {
                if (index !== questionIndex) return question;
                const options = [...question.options];
                options[optionIndex] = value;
                return { ...question, options };
            }),
        }));
    };

    const addQuestion = () => {
        setForm((prev) => ({
            ...prev,
            questions: [
                ...prev.questions,
                { ...blankQuestion, sortOrder: String(prev.questions.length) },
            ],
        }));
    };

    const removeQuestion = (index) => {
        setForm((prev) => {
            if (prev.questions.length <= 1) return prev;
            const next = prev.questions.filter((_, questionIndex) => questionIndex !== index);
            return {
                ...prev,
                questions: next.map((question, nextIndex) => ({ ...question, sortOrder: String(nextIndex) })),
            };
        });
    };

    const startEdit = (quiz) => {
        setEditingId(quiz.id);
        setForm({
            title: quiz.title,
            heading: quiz.heading,
            category: quiz.category,
            minutes: String(quiz.minutes),
            rating: String(quiz.rating),
            sortOrder: String(quiz.sortOrder),
            isActive: Boolean(quiz.isActive),
            questions: (quiz.questions || []).map((question, index) => normalizeQuestion(question, index)),
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const resetForm = () => {
        setEditingId("");
        setForm(defaultQuiz);
        setError("");
        setSuccess("");
    };

    const submit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const payload = {
            ...form,
            minutes: Number(form.minutes),
            rating: Number(form.rating),
            sortOrder: Number(form.sortOrder),
            questions: form.questions.map((question, index) => ({
                questionText: question.questionText,
                options: question.options,
                correctIndex: Number(question.correctIndex),
                sortOrder: Number(question.sortOrder || index),
            })),
        };

        try {
            const response = await fetch(editingId ? `/api/admin/quizzes/${editingId}` : "/api/admin/quizzes", {
                method: editingId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not save quiz.");

            if (editingId) {
                setQuizzes((prev) => prev.map((item) => (item.id === editingId ? data.quiz : item)));
                setSuccess("Quiz updated successfully.");
            } else {
                setQuizzes((prev) => [data.quiz, ...prev]);
                setSuccess("Quiz created successfully.");
            }

            resetForm();
        } catch (submitError) {
            setError(submitError.message || "Could not save quiz.");
        } finally {
            setLoading(false);
        }
    };

    const removeQuiz = async (id) => {
        if (!window.confirm("Delete this quiz?")) return;

        try {
            const response = await fetch(`/api/admin/quizzes/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Delete failed");
            setQuizzes((prev) => prev.filter((item) => item.id !== id));
            if (editingId === id) resetForm();
        } catch {
            setError("Could not delete quiz.");
        }
    };

    return (
        <div className="stack-lg">
            <motion.form
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="panel form-grid"
                onSubmit={submit}
            >
                <h3>{heading}</h3>

                <div className="price-row">
                    <label>
                        Quiz Title
                        <input value={form.title} onChange={(event) => setField("title", event.target.value)} required />
                    </label>
                    <label>
                        Quiz Heading
                        <input value={form.heading} onChange={(event) => setField("heading", event.target.value)} required />
                    </label>
                </div>

                <div className="price-row">
                    <label>
                        Category
                        <input value={form.category} onChange={(event) => setField("category", event.target.value)} required />
                    </label>
                    <label>
                        Quiz Minutes
                        <input type="number" min="1" max="180" value={form.minutes} onChange={(event) => setField("minutes", event.target.value)} required />
                    </label>
                    <label>
                        Rating
                        <input type="number" min="1" max="5" step="0.1" value={form.rating} onChange={(event) => setField("rating", event.target.value)} required />
                    </label>
                    <label>
                        Sort Order
                        <input type="number" min="0" value={form.sortOrder} onChange={(event) => setField("sortOrder", event.target.value)} required />
                    </label>
                </div>

                <label className="inline-check">
                    <input type="checkbox" checked={form.isActive} onChange={(event) => setField("isActive", event.target.checked)} />
                    Show on public quiz page
                </label>

                <section className="panel" style={{ marginTop: "0.5rem" }}>
                    <div className="dash-header">
                        <h3>Questions & Internal Options</h3>
                        <button type="button" className="btn-ghost" onClick={addQuestion}>Add Question</button>
                    </div>

                    <div className="stack-lg" style={{ marginTop: "0.8rem" }}>
                        {form.questions.map((question, index) => (
                            <article key={`question-${index}`} className="panel" style={{ border: "1px solid var(--line)" }}>
                                <div className="dash-header">
                                    <h4>Question {index + 1}</h4>
                                    <button type="button" className="btn-danger" onClick={() => removeQuestion(index)}>
                                        Remove
                                    </button>
                                </div>
                                <label>
                                    Question Text
                                    <textarea rows={3} value={question.questionText} onChange={(event) => setQuestionField(index, "questionText", event.target.value)} required />
                                </label>
                                <div className="stack-sm" style={{ display: "grid", gap: "0.5rem" }}>
                                    {question.options.map((option, optionIndex) => (
                                        <label key={`q-${index}-opt-${optionIndex}`}>
                                            Option {optionIndex + 1}
                                            <input value={option} onChange={(event) => setQuestionOption(index, optionIndex, event.target.value)} required />
                                        </label>
                                    ))}
                                </div>
                                <div className="price-row">
                                    <label>
                                        Correct Option
                                        <select value={question.correctIndex} onChange={(event) => setQuestionField(index, "correctIndex", event.target.value)}>
                                            <option value="0">Option 1</option>
                                            <option value="1">Option 2</option>
                                            <option value="2">Option 3</option>
                                            <option value="3">Option 4</option>
                                        </select>
                                    </label>
                                    <label>
                                        Question Order
                                        <input type="number" min="0" value={question.sortOrder} onChange={(event) => setQuestionField(index, "sortOrder", event.target.value)} required />
                                    </label>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <div className="inline-actions">
                    <button className="btn-primary" type="submit" disabled={loading}>
                        {loading ? "Saving..." : heading}
                    </button>
                    {editingId && <button type="button" className="btn-ghost" onClick={resetForm}>Cancel</button>}
                </div>

                <AnimatePresence>
                    {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="error-text">{error}</motion.p>}
                    {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="success-text">{success}</motion.p>}
                </AnimatePresence>
            </motion.form>

            <section className="panel">
                <h3>All Quizzes ({quizzes.length})</h3>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Minutes</th>
                                <th>Rating</th>
                                <th>Questions</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizzes.map((quiz) => (
                                <tr key={quiz.id}>
                                    <td>{quiz.title}</td>
                                    <td>{quiz.category}</td>
                                    <td>{quiz.minutes}</td>
                                    <td>{Number(quiz.rating || 0).toFixed(1)}</td>
                                    <td>{quiz.questions?.length || 0}</td>
                                    <td>
                                        <span className={quiz.isActive ? "status-active" : "status-hidden"}>
                                            {quiz.isActive ? "Active" : "Hidden"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button type="button" className="btn-ghost" onClick={() => startEdit(quiz)}>Edit</button>
                                            <button type="button" className="btn-danger" onClick={() => removeQuiz(quiz.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {quizzes.length === 0 && (
                                <tr><td colSpan={7} className="empty-row">No quizzes yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
