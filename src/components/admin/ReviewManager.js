"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const MAX_REVIEW_WORDS = 80;
const MAX_QUOTE_CHARS = 100;
const MAX_MARQUEE_CHARS = 50;

function countWords(text) {
    return text?.trim().split(/\s+/).filter(Boolean).length || 0;
}

const defaultReview = {
    name: "",
    role: "Student",
    reviewText: "",
    quote: "",
    marqueeText: "",
    avatar: "",
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

function SortableReviewItem({ review, index, onEdit, onDelete, onToggleActive, onToggleFeatured }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: review.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 1,
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            layout
            className="review-sortable-item"
        >
            <div
                className="review-drag-handle"
                {...attributes}
                {...listeners}
            >
                <span style={{ fontSize: "1.2rem" }}>⋮⋮</span>
            </div>

            <div className="review-item-content">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{ background: "#000", color: "#fff", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700 }}>
                        #{index + 1}
                    </span>
                    {review.avatar && (
                        <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", border: "2px solid #000" }}>
                            <img src={review.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                    )}
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

                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "#ffd400",
                        color: "#000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                        fontSize: "1rem",
                        flexShrink: 0,
                    }}>
                        {review.avatar ? (
                            <img src={review.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                        ) : (
                            review.name?.charAt(0)?.toUpperCase() || "S"
                        )}
                    </div>
                    <div>
                        <h4 style={{ fontWeight: 700, margin: 0 }}>{review.name}</h4>
                        <p style={{ fontSize: "0.8rem", color: "#666", margin: "0.25rem 0 0" }}>{review.role}</p>
                    </div>
                </div>

                {review.marqueeText && (
                    <p style={{ fontSize: "0.85rem", color: "#2563eb", fontStyle: "italic", margin: "0.5rem 0" }}>
                        Marquee: "{review.marqueeText}"
                    </p>
                )}
                {review.quote && (
                    <p style={{ fontSize: "0.85rem", fontStyle: "italic", margin: "0.5rem 0" }}>
                        "{review.quote}"
                    </p>
                )}
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
                <button
                    onClick={() => onToggleActive(review)}
                    style={{
                        padding: "0.4rem 0.8rem",
                        background: review.isActive ? "#fff" : "#22c55e",
                        color: review.isActive ? "#000" : "#fff",
                        border: "2px solid #000",
                        borderRadius: "10px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "0.75rem",
                    }}
                >
                    {review.isActive ? "Disable" : "Enable"}
                </button>
                <button
                    onClick={() => onToggleFeatured(review)}
                    style={{
                        padding: "0.4rem 0.8rem",
                        background: review.isFeatured ? "#ffd400" : "#fff",
                        color: "#000",
                        border: "2px solid #000",
                        borderRadius: "10px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "0.75rem",
                    }}
                >
                    {review.isFeatured ? "Remove Marquee" : "Add to Marquee"}
                </button>
                <button
                    onClick={() => onEdit(review)}
                    style={{
                        padding: "0.4rem 0.8rem",
                        background: "#ffd400",
                        color: "#000",
                        border: "2px solid #000",
                        borderRadius: "10px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "0.75rem",
                    }}
                >
                    Edit
                </button>
                <button
                    onClick={() => onDelete(review.id)}
                    style={{
                        padding: "0.4rem 0.8rem",
                        background: "#fff",
                        color: "#ef4444",
                        border: "2px solid #ef4444",
                        borderRadius: "10px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "0.75rem",
                    }}
                >
                    Delete
                </button>
            </div>
        </motion.div>
    );
}

export default function ReviewManager({ initialReviews = [], googleReviewUrl = "#" }) {
    const [reviews, setReviews] = useState(initialReviews);
    const [form, setForm] = useState(defaultReview);
    const [editingId, setEditingId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const wordCount = useMemo(() => countWords(form.reviewText), [form.reviewText]);
    const quoteCount = useMemo(() => form.quote?.length || 0, [form.quote]);
    const marqueeCount = useMemo(() => form.marqueeText?.length || 0, [form.marqueeText]);

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
            const payload = { ...form };

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

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const response = await fetch("/api/admin/upload/avatar", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            setForm((prev) => ({ ...prev, avatar: data.url }));
        } catch (err) {
            setError("Failed to upload avatar");
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = reviews.findIndex((r) => r.id === active.id);
        const newIndex = reviews.findIndex((r) => r.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const newOrder = arrayMove(reviews, oldIndex, newIndex);
        setReviews(newOrder);

        try {
            const orderedIds = newOrder.map((r) => r.id);
            await fetch("/api/admin/reviews/reorder", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderedIds }),
            });
        } catch (e) {
            console.error("Failed to save order:", e);
        }
    };

    return (
        <div className="stack-lg">
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
                            Drag handles to reorder. Reviews shown in marquee animation.
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
                        Avatar (optional)
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            style={{ padding: "0.5rem", border: "4px solid #000", borderRadius: "16px", fontSize: "0.9rem" }}
                        />
                    </label>

                    {form.avatar && (
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "#f5f5f5", borderRadius: "12px" }}>
                            <div style={{ width: 60, height: 60, borderRadius: "50%", overflow: "hidden", border: "3px solid #000" }}>
                                <img src={form.avatar} alt="Avatar preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            <button
                                type="button"
                                onClick={() => setForm((prev) => ({ ...prev, avatar: "" }))}
                                style={{ padding: "0.5rem 1rem", background: "#ef4444", color: "#fff", border: "2px solid #000", borderRadius: "10px", fontWeight: 600, cursor: "pointer" }}
                            >
                                Remove
                            </button>
                        </div>
                    )}

                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        Marquee Text (max {MAX_MARQUEE_CHARS} chars)
                        <input
                            name="marqueeText"
                            value={form.marqueeText}
                            onChange={onChange}
                            placeholder="Short text for auto-scroll marquee..."
                            maxLength={MAX_MARQUEE_CHARS}
                            style={{ padding: "0.75rem 1rem", border: "4px solid #000", borderRadius: "16px", fontSize: "1rem" }}
                        />
                        <span style={{ fontSize: "0.8rem", color: marqueeCount > MAX_MARQUEE_CHARS * 0.9 ? "#ef4444" : "#666" }}>
                            {marqueeCount}/{MAX_MARQUEE_CHARS}
                        </span>
                    </label>

                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        Full Review ({MAX_REVIEW_WORDS} words max)
                        <textarea
                            name="reviewText"
                            value={form.reviewText}
                            onChange={onChange}
                            rows={4}
                            placeholder="Write the full review here..."
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
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "#ef4444", fontWeight: 600 }}>
                            {error}
                        </motion.p>
                    )}
                    {success && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "#22c55e", fontWeight: 600 }}>
                            {success}
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.form>

            <section className="panel">
                <h3>All Reviews ({reviews.length})</h3>
                <p style={{ color: "#666", marginTop: "0.5rem", marginBottom: "1rem" }}>
                    Drag the ⋮⋮ handle to reorder. Toggle active/inactive or featured for marquee.
                </p>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={reviews.map((r) => r.id)} strategy={verticalListSortingStrategy}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {reviews.map((review, index) => (
                                <SortableReviewItem
                                    key={review.id}
                                    review={review}
                                    index={index}
                                    onEdit={startEdit}
                                    onDelete={removeReview}
                                    onToggleActive={toggleActive}
                                    onToggleFeatured={toggleFeatured}
                                />
                            ))}
                            {reviews.length === 0 && (
                                <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
                                    No reviews yet. Add one above.
                                </p>
                            )}
                        </div>
                    </SortableContext>
                </DndContext>
            </section>

            <style jsx>{`
                .review-sortable-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 1.25rem;
                    background: #fff;
                    border: 4px solid #000;
                    border-radius: 20px;
                    box-shadow: 4px 4px 0 #000;
                    transition: all 0.2s ease;
                }
                .review-sortable-item:hover {
                    box-shadow: 6px 6px 0 #000;
                }
                .review-drag-handle {
                    padding: 0.5rem;
                    cursor: grab;
                    color: #666;
                    border-radius: 8px;
                    background: #f5f5f5;
                    transition: all 0.2s ease;
                }
                .review-drag-handle:hover {
                    background: #ffd400;
                    color: #000;
                }
                .review-drag-handle:active {
                    cursor: grabbing;
                }
                .review-item-content {
                    flex: 1;
                    min-width: 0;
                }
            `}</style>
        </div>
    );
}