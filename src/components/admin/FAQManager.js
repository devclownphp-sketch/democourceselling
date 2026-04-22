"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const defaultForm = {
    question: "",
    answer: "",
};

export default function FAQManager({ initialFaqs = [] }) {
    const [faqs, setFaqs] = useState(initialFaqs);
    const [form, setForm] = useState(defaultForm);
    const [editingId, setEditingId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setEditingId("");
        setForm(defaultForm);
        setError("");
    };

    const startEdit = (faq) => {
        setEditingId(faq.id);
        setForm({ question: faq.question, answer: faq.answer });
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
                setFaqs((prev) => [...prev, data.faq]);
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
        try {
            const res = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
            if (res.ok) {
                setFaqs((prev) => prev.filter((f) => f.id !== id));
                if (editingId === id) resetForm();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Add/Edit Form */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="panel"
                style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
                <h3>{editingId ? "Edit FAQ" : "Add New FAQ"}</h3>

                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    Question
                    <input
                        name="question"
                        value={form.question}
                        onChange={handleChange}
                        placeholder="Enter question..."
                        required
                        style={{
                            width: "100%",
                            padding: "0.75rem 1rem",
                            border: "2px solid #000",
                            borderRadius: "16px",
                            fontSize: "1rem",
                        }}
                    />
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    Answer
                    <textarea
                        name="answer"
                        value={form.answer}
                        onChange={handleChange}
                        placeholder="Enter answer..."
                        rows={3}
                        required
                        style={{
                            width: "100%",
                            padding: "0.75rem 1rem",
                            border: "2px solid #000",
                            borderRadius: "16px",
                            fontSize: "1rem",
                            resize: "vertical",
                        }}
                    />
                </label>

                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
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
                        {loading ? "Saving..." : editingId ? "Update FAQ" : "Add FAQ"}
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

            {/* FAQ List */}
            <section className="panel">
                <h3>FAQs ({faqs.length})</h3>
                <p className="muted-text">Toggle active/inactive without deleting.</p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={faq.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                padding: "1rem 1.25rem",
                                background: faq.isActive ? "#fff" : "#f5f5f5",
                                border: "4px solid #000",
                                borderRadius: "24px",
                                boxShadow: "4px 4px 0 #000",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                                        <span style={{ fontWeight: 700, color: "#666" }}>#{index + 1}</span>
                                        <span
                                            style={{
                                                padding: "0.2rem 0.6rem",
                                                background: faq.isActive ? "#22c55e" : "#ef4444",
                                                color: "#fff",
                                                borderRadius: "999px",
                                                fontSize: "0.75rem",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {faq.isActive ? "ACTIVE" : "INACTIVE"}
                                        </span>
                                    </div>
                                    <h4 style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{faq.question}</h4>
                                    <p style={{ fontSize: "0.9rem", color: "#666" }}>{faq.answer}</p>
                                </div>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button
                                        onClick={() => toggleActive(faq)}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            background: faq.isActive ? "#fff" : "#22c55e",
                                            color: faq.isActive ? "#000" : "#fff",
                                            border: "2px solid #000",
                                            borderRadius: "12px",
                                            fontWeight: 600,
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
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            fontSize: "0.8rem",
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
                    {faqs.length === 0 && (
                        <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
                            No FAQs yet. Add one above.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}
