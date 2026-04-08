"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const defaultForm = {
    name: "",
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
                <label className="inline-check">
                    <input type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} />
                    👁️ Show in course type list
                </label>

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
                <p className="muted-text">Drag and drop rows to set display order for the course type dropdown.</p>
                <div className="table-wrap" style={{ marginTop: "0.8rem" }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Name</th>
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
                                    <td>{item.name}</td>
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
                                <tr><td colSpan={4} className="empty-row">No course types yet. Add one above.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
