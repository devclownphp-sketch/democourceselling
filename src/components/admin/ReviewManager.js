"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MAX_REVIEW_WORDS = 80;
const MAX_QUOTE_CHARS = 100;

function countWords(text) {
    return text?.trim().split(/\s+/).filter(Boolean).length || 0;
}

const defaultReview = {
    name: "",
    role: "Student",
    reviewText: "",
    quote: "",
    rating: 5,
    sortOrder: 0,
    isFeatured: false,
    isActive: true,
};

function toFormReview(review) {
    return {
        ...review,
        rating: Number(review.rating ?? 5),
        sortOrder: Number(review.sortOrder ?? 0),
        isFeatured: Boolean(review.isFeatured),
        isActive: Boolean(review.isActive),
    };
}

export default function ReviewManager({ initialReviews = [], googleReviewUrl = "#" }) {
    const [reviews, setReviews] = useState(initialReviews);
    const [form, setForm] = useState(defaultReview);
    const [editingId, setEditingId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const wordCount = useMemo(() => countWords(form.reviewText), [form.reviewText]);
    const quoteCount = useMemo(() => form.quote?.length || 0, [form.quote]);

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
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

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (wordCount > MAX_REVIEW_WORDS) {
            setError(`Review must be ${MAX_REVIEW_WORDS} words or fewer.`);
            setLoading(false);
            return;
        }

        try {
            const payload = {
                ...form,
            };

            const response = await fetch(
                editingId ? `/api/admin/reviews/${editingId}` : "/api/admin/reviews",
                {
                    method: editingId ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not save review.");

            if (editingId) {
                setReviews((prev) => prev.map((item) => (item.id === editingId ? data.review : item)));
                setSuccess("Review updated!");
            } else {
                setReviews((prev) => [data.review, ...prev]);
                setSuccess("Review added!");
            }
            resetForm();
        } catch (submitError) {
            setError(submitError.message || "Could not save review.");
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (review) => {
        try {
            const response = await fetch(`/api/admin/reviews/${review.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !review.isActive }),
            });
            const data = await response.json();
            if (response.ok) {
                setReviews((prev) => prev.map((item) => (item.id === review.id ? data.review : item)));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const toggleFeatured = async (review) => {
        try {
            const response = await fetch(`/api/admin/reviews/${review.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isFeatured: !review.isFeatured }),
            });
            const data = await response.json();
            if (response.ok) {
                setReviews((prev) => prev.map((item) => (item.id === review.id ? data.review : item)));
            }
        } catch (e) {
            console.error(e);
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
            {/* Form */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="panel"
                onSubmit={submit}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                        <h3>{editingId ? "Edit Review" : "Add Review"}</h3>
                        <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.25rem" }}>
                            Reviews shown in marquee animation
                        </p>
                    </div>
                    <a
                        href={googleReviewUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            padding: "0.75rem 1.25rem",
                            background: "#ffd400",
                            color: "#000",
                            border: "4px solid #000",
                            borderRadius: "16px",
                            fontWeight: 700,
                            textDecoration: "none",
                            boxShadow: "4px 4px 0 #000",
                        }}
                    >
                        Add Google Review ↗
                    </a>
                </div>

                <div style={{ display: "grid", gap: "1rem" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        Name
                        <input
                            name="name"
                            value={form.name}
                            onChange={onChange}
                            placeholder="Student name"
                            required
                            style={{ padding: "0.75rem 1rem", border: "4px solid #000", borderRadius: "16px", fontSize: "1rem" }}
                        />
                    </label>

                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        Role
                        <input
                            name="role"
                            value={form.role}
                            onChange={onChange}
                            placeholder="Student, Developer, etc."
                            required
                            style={{ padding: "0.75rem 1rem", border: "4px solid #000", borderRadius: "16px", fontSize: "1rem" }}
                        />
                    </label>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            Rating
                            <select
                                name="rating"
                                value={form.rating}
                                onChange={onChange}
                                style={{ padding: "0.75rem 1rem", border: "4px solid #000", borderRadius: "16px", fontSize: "1rem" }}
                            >
                                {[5, 4, 3, 2, 1].map((r) => (
                                    <option key={r} value={r}>{r} Stars</option>
                                ))}
                            </select>
                        </label>
                        <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            Sort Order
                            <input
                                type="number"
                                name="sortOrder"
                                value={form.sortOrder}
                                onChange={onChange}
                                min="0"
                                style={{ padding: "0.75rem 1rem", border: "4px solid #000", borderRadius: "16px", fontSize: "1rem" }}
                            />
                        </label>
                    </div>

                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        Marquee Quote (max {MAX_QUOTE_CHARS} chars)
                        <input
                            name="quote"
                            value={form.quote}
                            onChange={onChange}
                            placeholder="Short quote for marquee..."
                            maxLength={MAX_QUOTE_CHARS}
                            style={{ padding: "0.75rem 1rem", border: "4px solid #000", borderRadius: "16px", fontSize: "1rem" }}
                        />
                        <span style={{ fontSize: "0.8rem", color: quoteCount > MAX_QUOTE_CHARS * 0.9 ? "#ef4444" : "#666" }}>
                            {quoteCount}/{MAX_QUOTE_CHARS}
                        </span>
                    </label>

                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        Full Review ({MAX_REVIEW_WORDS} words max)
                        <textarea
                            name="reviewText"
                            value={form.reviewText}
                            onChange={onChange}
                            rows={3}
                            placeholder="Full review text..."
                            style={{ padding: "0.75rem 1rem", border: "4px solid #000", borderRadius: "16px", fontSize: "1rem", resize: "vertical" }}
                        />
                        <span style={{ fontSize: "0.8rem", color: wordCount > MAX_REVIEW_WORDS ? "#ef4444" : "#666" }}>
                            {wordCount}/{MAX_REVIEW_WORDS} words
                        </span>
                    </label>

                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", fontWeight: 600 }}>
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={form.isActive}
                                onChange={onChange}
                                style={{ width: "20px", height: "20px" }}
                            />
                            Active
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", fontWeight: 600 }}>
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={form.isFeatured}
                                onChange={onChange}
                                style={{ width: "20px", height: "20px" }}
                            />
                            Show in Marquee
                        </label>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: "0.75rem 1.5rem",
                            background: "#000",
                            color: "#fff",
                            border: "4px solid #000",
                            borderRadius: "16px",
                            fontWeight: 700,
                            cursor: loading ? "not-allowed" : "pointer",
                            boxShadow: "4px 4px 0 #000",
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? "Saving..." : editingId ? "Update" : "Add Review"}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            style={{
                                padding: "0.75rem 1.5rem",
                                background: "#fff",
                                color: "#000",
                                border: "4px solid #000",
                                borderRadius: "16px",
                                fontWeight: 700,
                                cursor: "pointer",
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ color: "#ef4444", fontWeight: 600 }}
                        >
                            {error}
                        </motion.p>
                    )}
                    {success && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ color: "#22c55e", fontWeight: 600 }}
                        >
                            {success}
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.form>

            {/* List */}
            <section className="panel">
                <h3>All Reviews ({reviews.length})</h3>
                <p style={{ color: "#666", marginTop: "0.5rem", marginBottom: "1rem" }}>
                    Toggle active/inactive or featured for marquee without deleting.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                padding: "1.25rem",
                                background: review.isActive ? "#fff" : "#f5f5f5",
                                border: "4px solid #000",
                                borderRadius: "24px",
                                boxShadow: "4px 4px 0 #000",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                                <div style={{ flex: 1, minWidth: "200px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                                        <span style={{ background: "#000", color: "#fff", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700 }}>
                                            #{index + 1}
                                        </span>
                                        <span style={{
                                            padding: "0.2rem 0.6rem",
                                            borderRadius: "999px",
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            background: review.isActive ? "#22c55e" : "#ef4444",
                                            color: "#fff",
                                        }}>
                                            {review.isActive ? "ACTIVE" : "INACTIVE"}
                                        </span>
                                        <span style={{
                                            padding: "0.2rem 0.6rem",
                                            borderRadius: "999px",
                                            fontSize: "0.75rem",
                                            fontWeight: 700,
                                            background: review.isFeatured ? "#ffd400" : "#ddd",
                                            color: review.isFeatured ? "#000" : "#666",
                                        }}>
                                            MARQUEE {review.isFeatured ? "★" : ""}
                                        </span>
                                    </div>
                                    <h4 style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{review.name}</h4>
                                    <p style={{ fontSize: "0.85rem", color: "#666" }}>{review.role}</p>
                                    {review.quote && (
                                        <p style={{ marginTop: "0.5rem", fontStyle: "italic", fontSize: "0.9rem" }}>
                                            "{review.quote}"
                                        </p>
                                    )}
                                </div>
                                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                    <button
                                        onClick={() => toggleActive(review)}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            background: review.isActive ? "#fff" : "#22c55e",
                                            color: review.isActive ? "#000" : "#fff",
                                            border: "2px solid #000",
                                            borderRadius: "12px",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        {review.isActive ? "Disable" : "Enable"}
                                    </button>
                                    <button
                                        onClick={() => toggleFeatured(review)}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            background: review.isFeatured ? "#ffd400" : "#fff",
                                            color: "#000",
                                            border: "2px solid #000",
                                            borderRadius: "12px",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        {review.isFeatured ? "Remove Marquee" : "Add to Marquee"}
                                    </button>
                                    <button
                                        onClick={() => startEdit(review)}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            background: "#ffd400",
                                            color: "#000",
                                            border: "2px solid #000",
                                            borderRadius: "12px",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => removeReview(review.id)}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            background: "#fff",
                                            color: "#ef4444",
                                            border: "2px solid #ef4444",
                                            borderRadius: "12px",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {reviews.length === 0 && (
                        <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
                            No reviews yet. Add one above.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}
