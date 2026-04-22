"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CategoryLogo from "../CategoryLogo";

const ICON_OPTIONS = [
    { value: "book", label: "📚 Book" },
    { value: "computer", label: "💻 Computer" },
    { value: "code", label: "⌨️ Code" },
    { value: "web", label: "🌐 Web" },
    { value: "data", label: "📊 Data" },
    { value: "design", label: "🎨 Design" },
    { value: "database", label: "💾 Database" },
    { value: "network", label: "🔗 Network" },
    { value: "security", label: "🔒 Security" },
    { value: "mobile", label: "📱 Mobile" },
    { value: "cloud", label: "☁️ Cloud" },
    { value: "chart", label: "📈 Chart" },
];

const COLOR_OPTIONS = [
    { value: "#6366f1", label: "Indigo" },
    { value: "#8b5cf6", label: "Purple" },
    { value: "#ec4899", label: "Pink" },
    { value: "#ef4444", label: "Red" },
    { value: "#f97316", label: "Orange" },
    { value: "#f59e0b", label: "Amber" },
    { value: "#22c55e", label: "Green" },
    { value: "#10b981", label: "Emerald" },
    { value: "#14b8a6", label: "Teal" },
    { value: "#0ea5e9", label: "Sky" },
    { value: "#3b82f6", label: "Blue" },
    { value: "#a855f7", label: "Violet" },
    { value: "#ffd400", label: "Yellow" },
];

const defaultForm = {
    name: "",
    icon: "book",
    color: "#6366f1",
    isActive: true,
};

export default function StudyMaterialCategoryManager({ initialCategories = [] }) {
    const [categories, setCategories] = useState(initialCategories);
    const [form, setForm] = useState(defaultForm);
    const [editingId, setEditingId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const heading = editingId ? "✏️ Update Category" : "➕ Add Category";

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const resetForm = () => {
        setEditingId("");
        setForm(defaultForm);
        setError("");
        setSuccess("");
    };

    const startEdit = (cat) => {
        setEditingId(cat.id);
        setForm({
            name: cat.name,
            icon: cat.icon || "book",
            color: cat.color || "#6366f1",
            isActive: Boolean(cat.isActive),
        });
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const url = editingId ? `/api/admin/study-materials/categories/${editingId}` : "/api/admin/study-materials/categories";
            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to save category");

            if (editingId) {
                setCategories((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...data } : c)));
                setSuccess("✅ Category updated!");
            } else {
                setCategories((prev) => [...prev, data]);
                setSuccess("✅ Category created!");
            }
            resetForm();
        } catch (err) {
            setError(err.message || "Failed to save");
        } finally {
            setLoading(false);
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm("Delete this category?")) return;
        try {
            const response = await fetch(`/api/admin/study-materials/categories/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Delete failed");
            setCategories((prev) => prev.filter((c) => c.id !== id));
            if (editingId === id) resetForm();
        } catch {
            setError("Failed to delete category");
        }
    };

    return (
        <div className="stack-lg">
            <motion.form
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="panel form-grid"
                onSubmit={submit}
            >
                <h3>{heading}</h3>
                <label>
                    📁 Category Name *
                    <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        placeholder="e.g., Programming, Accounting, Design..."
                        required
                        style={inputStyle}
                    />
                </label>

                <label>
                    🎨 Icon Style
                    <select name="icon" value={form.icon} onChange={onChange} style={inputStyle}>
                        {ICON_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </label>

                <label>
                    🌈 Accent Color
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                            {COLOR_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setForm((p) => ({ ...p, color: opt.value }))}
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "50%",
                                        background: opt.value,
                                        border: form.color === opt.value ? "3px solid #fff" : "2px solid transparent",
                                        boxShadow: form.color === opt.value ? "0 0 0 2px #000" : "none",
                                        cursor: "pointer",
                                    }}
                                    title={opt.label}
                                />
                            ))}
                        </div>
                        <input
                            type="color"
                            name="color"
                            value={form.color}
                            onChange={onChange}
                            style={{ width: "50px", height: "36px", border: "3px solid #000", borderRadius: "10px", cursor: "pointer" }}
                        />
                    </div>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={form.isActive}
                        onChange={onChange}
                        style={{ width: "20px", height: "20px", cursor: "pointer" }}
                    />
                    <span style={{ fontWeight: 600 }}>✅ Active (show in filter)</span>
                </label>

                <div style={{ padding: "1rem", background: "#f5f5f5", borderRadius: "12px", border: "3px solid #000" }}>
                    <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.75rem" }}>Preview:</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div
                            style={{
                                width: "56px",
                                height: "56px",
                                borderRadius: "12px",
                                background: `${form.color}20`,
                                border: `3px solid ${form.color}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CategoryLogo category={form.name || "book"} size={40} />
                        </div>
                        <div>
                            <p style={{ fontWeight: 700, fontSize: "1rem" }}>{form.name || "Category Name"}</p>
                            <p style={{ fontSize: "0.8rem", color: "#666" }}>{form.isActive ? "Will appear in filters" : "Hidden from users"}</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                    <button type="submit" disabled={loading} className="btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
                        {loading ? "⏳ Saving..." : heading}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="btn-ghost">❌ Cancel</button>
                    )}
                </div>

                <AnimatePresence>
                    {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: "#ef4444", fontWeight: 600 }}>⚠️ {error}</motion.p>}
                    {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ color: "#22c55e", fontWeight: 600 }}>{success}</motion.p>}
                </AnimatePresence>
            </motion.form>

            <section className="panel">
                <h3>📂 All Categories ({categories.length})</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
                    {categories.map((cat) => (
                        <div key={cat.id} className="cert-item">
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
                                <div
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "10px",
                                        background: `${cat.color}20`,
                                        border: `2px solid ${cat.color}`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <CategoryLogo category={cat.name} size={32} />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 700, margin: 0 }}>{cat.name}</p>
                                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                                        <span style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem", borderRadius: "999px", background: cat.isActive ? "#22c55e" : "#ef4444", color: "#fff", fontWeight: 700 }}>
                                            {cat.isActive ? "Active" : "Hidden"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button onClick={() => startEdit(cat)} className="btn-sm btn-primary">✏️ Edit</button>
                                <button onClick={() => deleteCategory(cat.id)} className="btn-sm btn-danger">🗑️ Delete</button>
                            </div>
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>No categories yet. Create one above.</p>
                    )}
                </div>
            </section>
        </div>
    );
}

const inputStyle = { padding: "0.75rem 1rem", border: "4px solid #000", borderRadius: "16px", fontSize: "1rem", width: "100%" };
