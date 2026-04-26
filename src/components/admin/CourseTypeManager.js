"use client";

import { useMemo, useState } from "react";
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
];

const defaultForm = {
    name: "",
    icon: "book",
    color: "#6366f1",
    isActive: true,
};

export default function CourseTypeManager({ initialCourseTypes }) {
    const [courseTypes, setCourseTypes] = useState(initialCourseTypes);
    const [form, setForm] = useState(defaultForm);
    const [editingId, setEditingId] = useState("");
    const [draggedId, setDraggedId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const heading = useMemo(() => (editingId ? "✏️ Update Course Type" : "➕ Add Course Type"), [editingId]);

    const onChange = (event) => {
        const { name, value, type, checked } = event.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const resetForm = () => {
        setEditingId("");
        setForm(defaultForm);
        setError("");
    };

    const startEdit = (courseType) => {
        setEditingId(courseType.id);
        setForm({
            name: courseType.name,
            icon: courseType.icon || "book",
            color: courseType.color || "#6366f1",
            isActive: Boolean(courseType.isActive),
        });
    };

    const submit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(editingId ? `/api/admin/course-types/${editingId}` : "/api/admin/course-types", {
                method: editingId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not save course type.");

            if (editingId) {
                setCourseTypes((prev) => prev.map((item) => (item.id === editingId ? { ...item, ...data.courseType } : item)));
                setSuccess("✅ Course type updated.");
            } else {
                setCourseTypes((prev) => [...prev, data.courseType]);
                setSuccess("✅ Course type added.");
            }

            resetForm();
        } catch (submitError) {
            setError(submitError.message || "Could not save course type.");
        } finally {
            setLoading(false);
        }
    };

    const removeCourseType = async (id) => {
        if (!window.confirm("Delete this course type?")) return;

        try {
            const response = await fetch(`/api/admin/course-types/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Delete failed");

            setCourseTypes((prev) => prev.filter((item) => item.id !== id));
            if (editingId === id) resetForm();
        } catch {
            setError("Could not delete course type.");
        }
    };

    const persistOrder = async (ordered) => {
        setCourseTypes(ordered);

        try {
            const response = await fetch("/api/admin/course-types/reorder", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderedIds: ordered.map((item) => item.id) }),
            });

            if (!response.ok) throw new Error("Could not save order.");
            setSuccess("✅ Course type order updated.");
        } catch {
            setError("Could not save drag-and-drop order.");
        }
    };

    const onDropAt = (targetId) => {
        if (!draggedId || draggedId === targetId) return;

        const current = [...courseTypes];
        const from = current.findIndex((item) => item.id === draggedId);
        const to = current.findIndex((item) => item.id === targetId);

        if (from === -1 || to === -1) return;

        const [moved] = current.splice(from, 1);
        current.splice(to, 0, moved);

        persistOrder(current);
        setDraggedId("");
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
                    🧾 Course Type Name
                    <input name="name" value={form.name} onChange={onChange} placeholder="Accounting, Programming, Typing..." required />
                </label>

                <label>
                    🎨 Icon Style
                    <select name="icon" value={form.icon} onChange={onChange}>
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
                                    onClick={() => setForm((prev) => ({ ...prev, color: opt.value }))}
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "50%",
                                        background: opt.value,
                                        border: form.color === opt.value ? "3px solid #fff" : "2px solid transparent",
                                        boxShadow: form.color === opt.value ? "0 0 0 2px #000" : "none",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
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
                            style={{ width: "60px", height: "32px", border: "none", cursor: "pointer" }}
                        />
                    </div>
                </label>

                <label className="inline-check">
                    <input type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} />
                    👁️ Show in course type list
                </label>

                <div style={{ padding: "1rem", borderRadius: "12px", background: "var(--bg-alt)", border: "1px solid var(--border)" }}>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Preview:</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div
                            style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "12px",
                                background: `${form.color}20`,
                                border: `2px solid ${form.color}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                            }}
                        >
                            <CategoryLogo category={form.name || "book"} size={50} />
                        </div>
                        <div>
                            <p style={{ fontWeight: 600, color: "var(--ink)" }}>{form.name || "Category Name"}</p>
                            <p style={{ fontSize: "0.8rem", color: form.color }}>{form.name ? `This will show for: ${form.name}` : "Enter a name to see the mapping"}</p>
                        </div>
                    </div>
                </div>

                <div className="inline-actions">
                    <button className="btn-primary" type="submit" disabled={loading}>
                        {loading ? "⏳ Saving..." : heading}
                    </button>
                    {editingId && (
                        <button className="btn-ghost" type="button" onClick={resetForm}>❌ Cancel</button>
                    )}
                </div>

                <AnimatePresence>
                    {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="error-text">⚠️ {error}</motion.p>}
                    {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="success-text">{success}</motion.p>}
                </AnimatePresence>
            </motion.form>

            <section className="panel">
                <h3>🗂️ Course Types ({courseTypes.length})</h3>
                <p className="muted-text">Drag and drop rows to set display order. Each type has its own animated logo based on the icon and color.</p>
                <div className="table-wrap" style={{ marginTop: "0.8rem" }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Icon</th>
                                <th>Name</th>
                                <th>Color</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseTypes.map((item, index) => (
                                <tr
                                    key={item.id}
                                    draggable
                                    onDragStart={() => setDraggedId(item.id)}
                                    onDragOver={(event) => event.preventDefault()}
                                    onDrop={() => onDropAt(item.id)}
                                    style={{ cursor: "grab" }}
                                >
                                    <td>
                                        <span className="click-badge">#{index + 1}</span>
                                    </td>
                                    <td>
                                        <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <CategoryLogo category={item.name} size={35} />
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                                    <td>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: item.color || "#6366f1" }} />
                                            <span style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{item.color || "#6366f1"}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={item.isActive ? "status-active" : "status-hidden"}>
                                            {item.isActive ? "🟢 Active" : "🔴 Hidden"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button type="button" className="btn-ghost" onClick={() => startEdit(item)}>✏️ Edit</button>
                                            <button type="button" className="btn-danger" onClick={() => removeCourseType(item.id)}>🗑️ Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {courseTypes.length === 0 && (
                                <tr><td colSpan={6} className="empty-row">No course types yet. Add one above.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
