"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const VIEWER_TYPES = [
    { value: "embed", label: "Embed Viewer (PDF.js)" },
    { value: "drive", label: "Google Drive Link" },
    { value: "s3", label: "S3 Cloud Viewer" },
];

function SortableItem({ material, onEdit, onDelete, onToggle }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: material.id });

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
            className="sm-item"
        >
            <div className="sm-drag-handle" {...attributes} {...listeners}>
                <span>⋮⋮</span>
            </div>

            <div className="sm-thumbnail">
                {material.thumbnail ? (
                    <img src={material.thumbnail} alt="" />
                ) : (
                    <div className="sm-thumb-placeholder">📄</div>
                )}
            </div>

            <div className="sm-info">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{
                        padding: "0.2rem 0.6rem",
                        borderRadius: "999px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        background: material.isActive ? "#22c55e" : "#ef4444",
                        color: "#fff",
                    }}>
                        {material.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                    <span style={{
                        padding: "0.2rem 0.6rem",
                        borderRadius: "999px",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        background: "#6366f1",
                        color: "#fff",
                    }}>
                        {material.viewerType.toUpperCase()}
                    </span>
                </div>
                <h4 style={{ fontWeight: 700, margin: 0, fontSize: "1rem" }}>{material.title}</h4>
                <p style={{ fontSize: "0.8rem", color: "#666", margin: "0.25rem 0 0" }}>{material.materialCategory?.name || material.category}</p>
                {material.description && (
                    <p style={{ fontSize: "0.8rem", color: "#888", margin: "0.5rem 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {material.description}
                    </p>
                )}
            </div>

            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                    onClick={() => onToggle(material)}
                    className="sm-btn-sm"
                    style={{ background: material.isActive ? "#fff" : "#22c55e", color: material.isActive ? "#000" : "#fff" }}
                >
                    {material.isActive ? "Disable" : "Enable"}
                </button>
                <button onClick={() => onEdit(material)} className="sm-btn-sm sm-btn-primary">
                    Edit
                </button>
                <button
                    onClick={() => onDelete(material.id)}
                    className="sm-btn-sm sm-btn-danger"
                >
                    Delete
                </button>
            </div>
        </motion.div>
    );
}
function sanitizeMaterial(m) {
    return {
        id: m?.id ?? "",
        title: m?.title ?? "",
        description: m?.description ?? "",
        category: m?.category ?? "",
        pdfUrl: (m?.pdfUrl ?? "") || "",
        viewerType: m?.viewerType ?? "embed",
        thumbnail: (m?.thumbnail ?? "") || "",
        sortOrder: m?.sortOrder ?? 0,
        isActive: m?.isActive ?? true,
    };
}

export default function StudyMaterialManager({ initialMaterials = [], categories = [] }) {
    const safeMaterials = Array.isArray(initialMaterials) ? initialMaterials.map(sanitizeMaterial) : [];
    const [materials, setMaterials] = useState(safeMaterials);
    const [form, setForm] = useState({
        title: "",
        description: "",
        categoryId: "",
        category: "",
        pdfUrl: "",
        viewerType: "embed",
        thumbnail: "",
        sortOrder: 0,
        isActive: true,
    });
    const [editingId, setEditingId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const onCategoryChange = (e) => {
        const val = e.target.value;
        if (val === "__new__") {
            setForm((prev) => ({ ...prev, categoryId: "", category: "" }));
        } else {
            const selectedCat = categories.find(c => c.id === val);
            setForm((prev) => ({ ...prev, categoryId: val, category: selectedCat?.name || val }));
        }
    };

    const resetForm = () => {
        setEditingId("");
        setForm({
            title: "",
            description: "",
            categoryId: "",
            category: "",
            pdfUrl: "",
            viewerType: "embed",
            thumbnail: "",
            sortOrder: 0,
            isActive: true,
        });
        setError("");
        setSuccess("");
    };

    const startEdit = (material) => {
        setEditingId(material.id);
        setForm({
            title: material.title || "",
            description: material.description || "",
            categoryId: material.materialCategory?.id || "",
            category: material.materialCategory?.name || material.category || "",
            pdfUrl: material.pdfUrl || "",
            viewerType: material.viewerType || "embed",
            thumbnail: material.thumbnail || "",
            sortOrder: material.sortOrder || 0,
            isActive: material.isActive ?? true,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const payload = {
                title: form.title,
                description: form.description,
                categoryId: form.categoryId || null,
                category: form.category,
                pdfUrl: form.pdfUrl,
                viewerType: form.viewerType,
                thumbnail: form.thumbnail,
                isActive: form.isActive,
            };

            const response = await fetch(
                editingId ? `/api/admin/study-materials/${editingId}` : "/api/admin/study-materials",
                {
                    method: editingId ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to save");

            if (editingId) {
                setMaterials((prev) => prev.map((m) => (m.id === editingId ? sanitizeMaterial(data.material) : m)));
                setSuccess("Material updated!");
            } else {
                setMaterials((prev) => [sanitizeMaterial(data.material), ...prev]);
                setSuccess("Material added!");
            }
            resetForm();
        } catch (err) {
            setError(err.message || "Failed to save material");
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (material) => {
        try {
            const response = await fetch(`/api/admin/study-materials/${material.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !material.isActive }),
            });
            const data = await response.json();
            if (response.ok) {
                setMaterials((prev) => prev.map((m) =>
                    m.id === material.id ? { ...sanitizeMaterial(data.material), materialCategory: m.materialCategory } : m
                ));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const deleteMaterial = async (id) => {
        if (!window.confirm("Delete this material?")) return;

        try {
            const response = await fetch(`/api/admin/study-materials/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Delete failed");
            setMaterials((prev) => prev.filter((m) => m.id !== id));
            if (editingId === id) resetForm();
        } catch {
            setError("Failed to delete material");
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = materials.findIndex((m) => m.id === active.id);
        const newIndex = materials.findIndex((m) => m.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        const newOrder = arrayMove(materials, oldIndex, newIndex);
        setMaterials(newOrder);

        try {
            const orderedIds = newOrder.map((m) => m.id);
            await fetch("/api/admin/study-materials/reorder", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderedIds }),
            });
        } catch (e) {
            console.error("Failed to save order:", e);
        }
    };

    const handlePdfUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const response = await fetch("/api/admin/pdfs/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            const url = data.url || data.pdf?.url;
            if (url) {
                setForm((prev) => ({ ...prev, pdfUrl: url }));
                setSuccess("PDF uploaded!");
            } else {
                throw new Error("Upload returned no URL");
            }
        } catch (err) {
            setError("Failed to upload PDF");
        } finally {
            setLoading(false);
        }
    };

    const handleThumbnailUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const response = await fetch("/api/admin/upload/image", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            const url = data.url || data.image?.url;
            if (url) {
                setForm((prev) => ({ ...prev, thumbnail: url }));
                setSuccess("Thumbnail uploaded!");
            } else {
                throw new Error("Upload returned no URL");
            }
        } catch (err) {
            setError("Failed to upload thumbnail");
        } finally {
            setLoading(false);
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
                <h3>{editingId ? "Edit Study Material" : "Add Study Material"}</h3>

                <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        Title *
                        <input
                            name="title"
                            value={form.title}
                            onChange={onChange}
                            placeholder="Material title"
                            required
                            style={{ padding: "0.75rem 1rem", border: "4px solid #000", borderRadius: "16px", fontSize: "1rem" }}
                        />
                    </label>

                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        Description
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={onChange}
                            placeholder="Brief description..."
                            rows={2}
                            maxLength={300}
                            style={{ padding: "0.75rem 1rem", border: "4px solid #000", borderRadius: "16px", fontSize: "1rem", resize: "vertical" }}
                        />
                        <span style={{ fontSize: "0.75rem", textAlign: "right", color: (form.description || "").length > 270 ? "#ef4444" : "#999" }}>
                            {(form.description || "").length}/300
                        </span>
                    </label>

                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        Category *
                        <select
                            name="categoryId"
                            value={form.categoryId}
                            onChange={onCategoryChange}
                            required
                            style={{ padding: "0.75rem 1rem", border: "4px solid #000", borderRadius: "16px", fontSize: "1rem" }}
                        >
                            <option value="">Select category...</option>
                            {categories.map((cat, idx) => (
                                <option key={cat.id || `cat-${idx}`} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        <span style={{ fontSize: "0.8rem", color: "#666" }}>
                            Manage categories below or go to Study Materials → Categories tab
                        </span>
                    </label>

                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        Viewer Type *
                        <select
                            name="viewerType"
                            value={form.viewerType}
                            onChange={onChange}
                            style={{ padding: "0.75rem 1rem", border: "4px solid #000", borderRadius: "16px", fontSize: "1rem" }}
                        >
                            {VIEWER_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                        </select>
                    </label>

                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        PDF URL * (or upload below)
                        <input
                            name="pdfUrl"
                            value={form.pdfUrl}
                            onChange={onChange}
                            placeholder="https://..."
                            style={{ padding: "0.75rem 1rem", border: "4px solid #000", borderRadius: "16px", fontSize: "1rem" }}
                        />
                    </label>

                    <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                Upload PDF
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handlePdfUpload}
                                    style={{ padding: "0.5rem", border: "4px solid #000", borderRadius: "16px", fontSize: "0.9rem" }}
                                />
                            </label>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                Thumbnail (optional)
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailUpload}
                                    style={{ padding: "0.5rem", border: "4px solid #000", borderRadius: "16px", fontSize: "0.9rem" }}
                                />
                            </label>
                        </div>
                    </div>

                    {form.pdfUrl && (
                        <div style={{ padding: "1rem", background: "#f5f5f5", borderRadius: "12px", display: "flex", alignItems: "center", gap: "1rem" }}>
                            <span>📄</span>
                            <a href={form.pdfUrl} target="_blank" rel="noreferrer" style={{ flex: 1, wordBreak: "break-all", fontSize: "0.9rem" }}>
                                {form.pdfUrl}
                            </a>
                            <button type="button" onClick={() => setForm((p) => ({ ...p, pdfUrl: "" }))} className="sm-btn-sm sm-btn-danger">
                                Remove
                            </button>
                        </div>
                    )}

                    {form.thumbnail && (
                        <div style={{ padding: "1rem", background: "#f5f5f5", borderRadius: "12px", display: "flex", alignItems: "center", gap: "1rem" }}>
                            <img src={form.thumbnail} alt="Thumbnail" style={{ width: 60, height: 40, objectFit: "cover", borderRadius: "8px" }} />
                            <button type="button" onClick={() => setForm((p) => ({ ...p, thumbnail: "" }))} className="sm-btn-sm sm-btn-danger">
                                Remove
                            </button>
                        </div>
                    )}

                    <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", fontWeight: 600 }}>
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={form.isActive}
                            onChange={onChange}
                            style={{ width: "20px", height: "20px" }}
                        />
                        Active (visible on public page)
                    </label>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? "Saving..." : editingId ? "Update Material" : "Add Material"}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="btn-ghost">
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
                <h3>All Study Materials ({materials.length})</h3>
                <p style={{ color: "#666", marginTop: "0.5rem" }}>
                    Drag ⋮⋮ to reorder. Toggle active/inactive to show/hide on public page.
                </p>

                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={materials.map((m, i) => m.id || `mat-${i}`)} strategy={verticalListSortingStrategy}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                            {materials.map((material, idx) => (
                                <SortableItem
                                    key={material.id || `mat-${idx}`}
                                    material={material}
                                    onEdit={startEdit}
                                    onDelete={deleteMaterial}
                                    onToggle={toggleActive}
                                />
                            ))}
                            {materials.length === 0 && (
                                <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
                                    No study materials yet. Add one above.
                                </p>
                            )}
                        </div>
                    </SortableContext>
                </DndContext>
            </section>

            <style>{`
                .sm-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: #fff;
                    border: 4px solid #000;
                    border-radius: 16px;
                    box-shadow: 4px 4px 0 #000;
                    transition: all 0.2s ease;
                }
                .sm-item:hover {
                    box-shadow: 6px 6px 0 #000;
                }
                .sm-drag-handle {
                    padding: 0.5rem;
                    cursor: grab;
                    color: #666;
                    border-radius: 8px;
                    background: #f5f5f5;
                    font-size: 1.2rem;
                }
                .sm-drag-handle:hover {
                    background: #ffd400;
                    color: #000;
                }
                .sm-drag-handle:active {
                    cursor: grabbing;
                }
                .sm-thumbnail {
                    width: 80px;
                    height: 50px;
                    border-radius: 8px;
                    overflow: hidden;
                    background: #f5f5f5;
                    border: 2px solid #000;
                    flex-shrink: 0;
                }
                .sm-thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .sm-thumb-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                }
                .sm-info {
                    flex: 1;
                    min-width: 0;
                }
                .sm-btn-sm {
                    padding: 0.4rem 0.8rem;
                    border: 2px solid #000;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 0.8rem;
                    background: #fff;
                    transition: all 0.2s ease;
                }
                .sm-btn-sm:hover {
                    transform: translateY(-1px);
                }
                .sm-btn-primary {
                    background: #ffd400;
                    color: #000;
                }
                .sm-btn-danger {
                    color: #ef4444;
                    border-color: #ef4444;
                }
                .sm-btn-danger:hover {
                    background: #ef4444;
                    color: #fff;
                }
            `}</style>
        </div>
    );
}
