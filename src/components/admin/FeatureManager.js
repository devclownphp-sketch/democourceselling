"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconCheck, IconFree, IconPdf, IconRocket, IconLock, IconPhone, IconTool, IconStar, IconGrad } from "@/components/Icons";

const ICON_OPTIONS = [
    { value: "check", label: "Check", Icon: IconCheck },
    { value: "free", label: "Free", Icon: IconFree },
    { value: "pdf", label: "PDF", Icon: IconPdf },
    { value: "rocket", label: "Rocket", Icon: IconRocket },
    { value: "lock", label: "Lock", Icon: IconLock },
    { value: "phone", label: "Phone", Icon: IconPhone },
    { value: "tool", label: "Tool", Icon: IconTool },
    { value: "star", label: "Star", Icon: IconStar },
    { value: "grad", label: "Grad", Icon: IconGrad },
];

const COLOR_OPTIONS = [
    "#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f97316", "#f59e0b", "#22c55e", "#10b981", "#14b8a6", "#0ea5e9", "#3b82f6", "#a855f7"
];

const defaultForm = {
    icon: "check",
    title: "",
    description: "",
    color: "#6366f1",
};

export default function FeatureManager({ initialFeatures = [] }) {
    const [features, setFeatures] = useState(initialFeatures);
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

    const startEdit = (feature) => {
        setEditingId(feature.id);
        setForm({
            icon: feature.icon || "check",
            title: feature.title,
            description: feature.description,
            color: feature.color || "#6366f1",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const url = editingId ? `/api/admin/features/${editingId}` : "/api/admin/features";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            if (editingId) {
                setFeatures((prev) => prev.map((f) => (f.id === editingId ? data.feature : f)));
                setSuccess("Feature updated!");
            } else {
                setFeatures((prev) => [...prev, data.feature]);
                setSuccess("Feature added!");
            }
            resetForm();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (feature) => {
        try {
            const res = await fetch(`/api/admin/features/${feature.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !feature.isActive }),
            });
            const data = await res.json();
            if (res.ok) {
                setFeatures((prev) => prev.map((f) => (f.id === feature.id ? data.feature : f)));
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this feature?")) return;
        try {
            const res = await fetch(`/api/admin/features/${id}`, { method: "DELETE" });
            if (res.ok) {
                setFeatures((prev) => prev.filter((f) => f.id !== id));
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
                <h3>{editingId ? "Edit Feature" : "Add New Feature"}</h3>

                {/* Icon Picker */}
                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    Icon
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {ICON_OPTIONS.map((opt) => {
                            const IconComponent = opt.Icon;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setForm((prev) => ({ ...prev, icon: opt.value }))}
                                    style={{
                                        padding: "0.75rem",
                                        background: form.icon === opt.value ? "#000" : "#fff",
                                        color: form.icon === opt.value ? "#fff" : "#000",
                                        border: "4px solid #000",
                                        borderRadius: "12px",
                                        cursor: "pointer",
                                        boxShadow: form.icon === opt.value ? "4px 4px 0 #000" : "none",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <IconComponent size={20} />
                                </button>
                            );
                        })}
                    </div>
                </label>

                {/* Title */}
                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    Title
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="100% Free Learning"
                        required
                        style={{
                            width: "100%",
                            padding: "0.75rem 1rem",
                            border: "4px solid #000",
                            borderRadius: "16px",
                            fontSize: "1rem",
                        }}
                    />
                </label>

                {/* Description */}
                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    Description
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Access courses and resources with no hidden costs."
                        rows={2}
                        required
                        style={{
                            width: "100%",
                            padding: "0.75rem 1rem",
                            border: "4px solid #000",
                            borderRadius: "16px",
                            fontSize: "1rem",
                            resize: "vertical",
                        }}
                    />
                </label>

                {/* Color Picker */}
                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    Accent Color
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                        {COLOR_OPTIONS.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => setForm((prev) => ({ ...prev, color }))}
                                style={{
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    background: color,
                                    border: form.color === color ? "4px solid #000" : "4px solid transparent",
                                    cursor: "pointer",
                                    boxShadow: form.color === color ? "0 0 0 3px #ffd400" : "none",
                                    transition: "all 0.2s ease",
                                }}
                            />
                        ))}
                        <input
                            type="color"
                            name="color"
                            value={form.color}
                            onChange={handleChange}
                            style={{ width: "50px", height: "36px", border: "4px solid #000", borderRadius: "8px", cursor: "pointer" }}
                        />
                    </div>
                </label>

                {/* Submit */}
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <button
                        type="submit"
                        disabled={loading}
                        className="brutal-btn"
                        style={{ opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? "Saving..." : editingId ? "Update Feature" : "Add Feature"}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="brutal-btn brutal-btn-outline">
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

            {/* Features List */}
            <section className="panel">
                <h3>Features ({features.length})</h3>
                <p className="muted-text">Toggle active/inactive without deleting.</p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                    {features.map((feature, index) => {
                        const IconComp = ICON_OPTIONS.find((i) => i.value === feature.icon)?.Icon || IconCheck;
                        return (
                            <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    padding: "1rem 1.25rem",
                                    background: feature.isActive ? "#fff" : "#f5f5f5",
                                    border: "4px solid #000",
                                    borderRadius: "24px",
                                    boxShadow: "4px 4px 0 #000",
                                    display: "flex",
                                    gap: "1rem",
                                    alignItems: "flex-start",
                                }}
                            >
                                <div
                                    style={{
                                        width: "48px",
                                        height: "48px",
                                        borderRadius: "12px",
                                        background: `${feature.color || "#6366f1"}20`,
                                        color: feature.color || "#6366f1",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <IconComp size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                                        <span style={{ fontWeight: 700, color: "#666" }}>#{index + 1}</span>
                                        <span
                                            style={{
                                                padding: "0.2rem 0.6rem",
                                                background: feature.isActive ? "#22c55e" : "#ef4444",
                                                color: "#fff",
                                                borderRadius: "999px",
                                                fontSize: "0.75rem",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {feature.isActive ? "ACTIVE" : "INACTIVE"}
                                        </span>
                                    </div>
                                    <h4 style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{feature.title}</h4>
                                    <p style={{ fontSize: "0.9rem", color: "#666" }}>{feature.description}</p>
                                </div>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                    <button
                                        onClick={() => toggleActive(feature)}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            background: feature.isActive ? "#fff" : "#22c55e",
                                            color: feature.isActive ? "#000" : "#fff",
                                            border: "2px solid #000",
                                            borderRadius: "12px",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        {feature.isActive ? "Disable" : "Enable"}
                                    </button>
                                    <button
                                        onClick={() => startEdit(feature)}
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
                                        onClick={() => handleDelete(feature.id)}
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
                            </motion.div>
                        );
                    })}
                    {features.length === 0 && (
                        <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
                            No features yet. Add one above.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}
