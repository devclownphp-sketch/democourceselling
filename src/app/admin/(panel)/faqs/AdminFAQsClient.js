"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconQuestion } from "@/components/Icons";

const defaultForm = {
    question: "",
    answer: "",
    sortOrder: 0,
};

export default function AdminFAQsClient({ initialFaqs = [] }) {
    const [faqs, setFaqs] = useState(initialFaqs);
    const [form, setForm] = useState(defaultForm);
    const [editingId, setEditingId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const resetForm = () => {
        setEditingId("");
        setForm(defaultForm);
        setError("");
        setSuccess("");
    };

    const startEdit = (faq) => {
        setEditingId(faq.id);
        setForm({
            question: faq.question,
            answer: faq.answer,
            sortOrder: faq.sortOrder || 0,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const url = editingId ? `/api/admin/faqs/${editingId}` : "/api/admin/faqs";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            if (editingId) {
                setFaqs((prev) => prev.map((f) => (f.id === editingId ? data.faq : f)));
                setSuccess("FAQ updated successfully!");
            } else {
                setFaqs((prev) => [data.faq, ...prev]);
                setSuccess("FAQ added successfully!");
            }
            resetForm();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (faq) => {
        try {
            const res = await fetch(`/api/admin/faqs/${faq.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !faq.isActive }),
            });
            const data = await res.json();
            if (res.ok) {
                setFaqs((prev) => prev.map((f) => (f.id === faq.id ? data.faq : f)));
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this FAQ?")) return;
        setError("");
        try {
            const res = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            setFaqs((prev) => prev.filter((f) => f.id !== id));
            if (editingId === id) resetForm();
            setSuccess("FAQ deleted successfully!");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="stack-lg">
            {/* Add/Edit Form */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="panel"
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                    <div>
                        <h3>{editingId ? "Edit FAQ" : "Add New FAQ"}</h3>
                        <p className="muted-text" style={{ marginTop: "0.25rem" }}>
                            {editingId ? "Update the selected FAQ" : "Create a new frequently asked question"}
                        </p>
                    </div>
                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            style={{
                                padding: "0.5rem 1rem",
                                background: "#fee2e2",
                                color: "#ef4444",
                                border: "2px solid #ef4444",
                                borderRadius: "12px",
                                fontWeight: 700,
                                cursor: "pointer",
                                fontSize: "0.85rem",
                            }}
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Question *</span>
                        <input
                            name="question"
                            value={form.question}
                            onChange={handleChange}
                            placeholder="e.g., What courses do you offer?"
                            required
                            style={{
                                width: "100%",
                                padding: "0.875rem 1rem",
                                border: "4px solid #000",
                                borderRadius: "16px",
                                fontSize: "1rem",
                                fontWeight: 500,
                            }}
                        />
                    </label>

                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Answer *</span>
                        <textarea
                            name="answer"
                            value={form.answer}
                            onChange={handleChange}
                            placeholder="e.g., We offer free computer courses including..."
                            rows={4}
                            required
                            style={{
                                width: "100%",
                                padding: "0.875rem 1rem",
                                border: "4px solid #000",
                                borderRadius: "16px",
                                fontSize: "1rem",
                                fontWeight: 500,
                                resize: "vertical",
                            }}
                        />
                    </label>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem", alignItems: "end" }}>
                        <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>Sort Order</span>
                            <input
                                type="number"
                                name="sortOrder"
                                value={form.sortOrder}
                                onChange={handleChange}
                                min="0"
                                style={{
                                    padding: "0.875rem 1rem",
                                    border: "4px solid #000",
                                    borderRadius: "16px",
                                    fontSize: "1rem",
                                    fontWeight: 500,
                                }}
                            />
                        </label>
                        <div />
                    </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: "0.875rem 2rem",
                            background: "#000",
                            color: "#ffd400",
                            border: "4px solid #000",
                            borderRadius: "16px",
                            fontWeight: 800,
                            fontSize: "1rem",
                            cursor: loading ? "not-allowed" : "pointer",
                            boxShadow: "4px 4px 0 #ffd400",
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? "Saving..." : editingId ? "Update FAQ" : "Add FAQ"}
                    </button>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                marginTop: "1rem",
                                padding: "0.75rem 1rem",
                                background: "#fef2f2",
                                border: "2px solid #ef4444",
                                borderRadius: "12px",
                                color: "#ef4444",
                                fontWeight: 600,
                            }}
                        >
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                marginTop: "1rem",
                                padding: "0.75rem 1rem",
                                background: "#ecfdf5",
                                border: "2px solid #22c55e",
                                borderRadius: "12px",
                                color: "#22c55e",
                                fontWeight: 600,
                            }}
                        >
                            {success}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.form>

            {/* FAQ List */}
            <section className="panel">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <div>
                        <h3>All FAQs ({faqs.length})</h3>
                        <p className="muted-text" style={{ marginTop: "0.25rem" }}>
                            Click Edit to modify or Delete to remove permanently.
                        </p>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            style={{
                                padding: "1.25rem",
                                background: faq.isActive ? "#fff" : "#f8f8f8",
                                border: "4px solid #000",
                                borderRadius: "20px",
                                boxShadow: "4px 4px 0 #000",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                                <div style={{ flex: 1, minWidth: "200px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                                        <span style={{
                                            width: "32px",
                                            height: "32px",
                                            background: "#ffd400",
                                            border: "2px solid #000",
                                            borderRadius: "8px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 800,
                                            fontSize: "0.85rem",
                                        }}>
                                            {index + 1}
                                        </span>
                                        <span style={{
                                            padding: "0.25rem 0.75rem",
                                            background: faq.isActive ? "#22c55e" : "#ef4444",
                                            color: "#fff",
                                            borderRadius: "999px",
                                            fontSize: "0.7rem",
                                            fontWeight: 700,
                                        }}>
                                            {faq.isActive ? "ACTIVE" : "INACTIVE"}
                                        </span>
                                        <span style={{
                                            padding: "0.25rem 0.75rem",
                                            background: "#f0f0f0",
                                            borderRadius: "999px",
                                            fontSize: "0.7rem",
                                            fontWeight: 600,
                                            color: "#666",
                                        }}>
                                            Order: {faq.sortOrder || 0}
                                        </span>
                                    </div>
                                    <h4 style={{ fontWeight: 800, marginBottom: "0.5rem", fontSize: "1.1rem" }}>
                                        <IconQuestion size={16} style={{ marginRight: "8px", color: "#667eea" }} />
                                        {faq.question}
                                    </h4>
                                    <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.5, paddingLeft: "24px" }}>
                                        {faq.answer}
                                    </p>
                                </div>
                                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                                    <button
                                        onClick={() => toggleActive(faq)}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            background: faq.isActive ? "#fff" : "#22c55e",
                                            color: faq.isActive ? "#000" : "#fff",
                                            border: "2px solid #000",
                                            borderRadius: "12px",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        {faq.isActive ? "Disable" : "Enable"}
                                    </button>
                                    <button
                                        onClick={() => startEdit(faq)}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            background: "#ffd400",
                                            color: "#000",
                                            border: "2px solid #000",
                                            borderRadius: "12px",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            fontSize: "0.8rem",
                                            boxShadow: "2px 2px 0 #000",
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(faq.id)}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            background: "#fff",
                                            color: "#ef4444",
                                            border: "2px solid #ef4444",
                                            borderRadius: "12px",
                                            fontWeight: 700,
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
                    {faqs.length === 0 && (
                        <div style={{
                            textAlign: "center",
                            padding: "3rem",
                            background: "#f8f8f8",
                            border: "4px dashed #ccc",
                            borderRadius: "20px",
                        }}>
                            <IconQuestion size={48} style={{ color: "#ccc", marginBottom: "1rem" }} />
                            <h4 style={{ color: "#666", marginBottom: "0.5rem" }}>No FAQs Yet</h4>
                            <p style={{ color: "#999", fontSize: "0.9rem" }}>
                                Add your first FAQ using the form above.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
