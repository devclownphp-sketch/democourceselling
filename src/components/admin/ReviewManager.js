"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MAX_REVIEW_WORDS, countWords } from "@/lib/review-schema";

const defaultReview = {
    name: "",
    role: "Student",
    reviewText: "",
    rating: "5",
    sortOrder: "0",
    isActive: true,
};

function toFormReview(review) {
    return {
        ...review,
        rating: String(review.rating ?? 5),
        sortOrder: String(review.sortOrder ?? 0),
        isActive: Boolean(review.isActive),
    };
}

export default function ReviewManager({ initialReviews, googleReviewUrl }) {
    const [reviews, setReviews] = useState(initialReviews);
    const [form, setForm] = useState(defaultReview);
    const [editingId, setEditingId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const heading = useMemo(() => (editingId ? "✏️ Update Review" : "➕ Create Review"), [editingId]);
    const wordCount = useMemo(() => countWords(form.reviewText), [form.reviewText]);

    const onChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const startEdit = (review) => {
        setEditingId(review.id);
        setForm(toFormReview(review));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const resetForm = () => {
        setEditingId("");
        setForm(defaultReview);
        setError("");
        setSuccess("");
    };

    const submit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (wordCount > MAX_REVIEW_WORDS) {
            setError(`Review must be ${MAX_REVIEW_WORDS} words or fewer.`);
            setLoading(false);
            return;
        }

        const payload = {
            ...form,
            rating: Number(form.rating),
            sortOrder: Number(form.sortOrder),
        };

        try {
            const response = await fetch(editingId ? `/api/admin/reviews/${editingId}` : "/api/admin/reviews", {
                method: editingId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not save review.");

            if (editingId) {
                setReviews((prev) => prev.map((item) => (item.id === editingId ? data.review : item)));
                setSuccess("✅ Review updated successfully!");
            } else {
                setReviews((prev) => [data.review, ...prev]);
                setSuccess("✅ Review created successfully!");
            }

            resetForm();
        } catch (submitError) {
            setError(submitError.message || "Could not save review.");
        } finally {
            setLoading(false);
        }
    };

    const removeReview = async (id) => {
        if (!window.confirm("Delete this review?")) return;

        try {
            const response = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Delete failed");
            setReviews((prev) => prev.filter((item) => item.id !== id));
            if (editingId === id) resetForm();
        } catch {
            setError("Could not delete review.");
        }
    };

    return (
        <div className="stack-lg">
            <motion.form
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="panel form-grid"
                onSubmit={submit}
            >
                <div className="dash-header" style={{ alignItems: "flex-start" }}>
                    <div>
                        <h1>⭐ Reviews</h1>
                        <p className="muted-text">Keep each review within {MAX_REVIEW_WORDS} words so the marquee cards stay the same size.</p>
                    </div>
                    <a
                        href={googleReviewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-ghost"
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                    >
                        ➕ Add on Google
                    </a>
                </div>

                <h3>{heading}</h3>

                <label>
                    👤 Reviewer Name
                    <input name="name" value={form.name} onChange={onChange} placeholder="Enter reviewer name" required />
                </label>

                <label>
                    🧾 Role / Tagline
                    <input name="role" value={form.role} onChange={onChange} placeholder="Student, Parent, Working Professional" required />
                </label>

                <div className="price-row">
                    <label>
                        ⭐ Rating
                        <select name="rating" value={form.rating} onChange={onChange} required>
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <option key={rating} value={rating}>{rating}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        🔢 Sort Order
                        <input type="number" min="0" name="sortOrder" value={form.sortOrder} onChange={onChange} required />
                    </label>
                </div>

                <label>
                    💬 Review Text
                    <textarea
                        rows={5}
                        name="reviewText"
                        value={form.reviewText}
                        onChange={onChange}
                        placeholder="Write a short review within the word limit"
                        maxLength={220}
                        required
                    />
                    <span className="muted-text">Words: {wordCount}/{MAX_REVIEW_WORDS}</span>
                </label>

                <label className="inline-check">
                    <input type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} />
                    👁️ Show on front page
                </label>

                <div className="inline-actions">
                    <motion.button className="btn-primary" type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        {loading ? "⏳ Saving..." : heading}
                    </motion.button>
                    {editingId && (
                        <button className="btn-ghost" type="button" onClick={resetForm}>
                            ❌ Cancel
                        </button>
                    )}
                </div>

                <AnimatePresence>
                    {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="error-text">⚠️ {error}</motion.p>}
                    {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="success-text">{success}</motion.p>}
                </AnimatePresence>
            </motion.form>

            <section className="panel">
                <h3>🧑‍🎓 All Reviews ({reviews.length})</h3>
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Rating</th>
                                <th>Word Limit</th>
                                <th>Status</th>
                                <th>Order</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review) => (
                                <tr key={review.id}>
                                    <td>
                                        <div>
                                            <strong>{review.name}</strong>
                                            <div className="muted-text" title={review.reviewText}>{review.reviewText}</div>
                                        </div>
                                    </td>
                                    <td>{review.rating} / 5</td>
                                    <td>
                                        <span className="click-badge">{countWords(review.reviewText)}/{MAX_REVIEW_WORDS}</span>
                                    </td>
                                    <td>
                                        <span className={review.isActive ? "status-active" : "status-hidden"}>
                                            {review.isActive ? "🟢 Active" : "🔴 Hidden"}
                                        </span>
                                    </td>
                                    <td>{review.sortOrder}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button type="button" className="btn-ghost" onClick={() => startEdit(review)}>
                                                ✏️ Edit
                                            </button>
                                            <button type="button" className="btn-danger" onClick={() => removeReview(review.id)}>
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {reviews.length === 0 && (
                                <tr><td colSpan={6} className="empty-row">📦 No reviews yet. Add the first one above!</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}