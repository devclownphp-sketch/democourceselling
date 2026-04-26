"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IconPlus, IconEdit, IconTrash, IconX, IconCheck, IconUpload, IconImage } from "@/components/Icons";

export default function BlogManager() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        contentBlocks: [],
        featuredImage: "",
        isPublished: false,
    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const readResponseError = async (res, fallbackMessage) => {
        const contentType = res.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            try {
                const data = await res.json();
                return data?.error || fallbackMessage;
            } catch {
                return fallbackMessage;
            }
        }

        try {
            const text = await res.text();
            return text?.trim() || fallbackMessage;
        } catch {
            return fallbackMessage;
        }
    };

    const fetchBlogs = async () => {
        try {
            const res = await fetch("/api/admin/blogs");
            if (!res.ok) {
                const message = await readResponseError(res, "Failed to fetch blogs");
                throw new Error(message);
            }
            const data = await res.json();
            setBlogs(data.blogs);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            excerpt: "",
            content: "",
            contentBlocks: [],
            featuredImage: "",
            isPublished: false,
        });
        setEditingId(null);
        setShowForm(false);
        setError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        setUploading(true);
        setError("");

        try {
            const formDataUpload = new FormData();
            formDataUpload.append("file", file);

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formDataUpload,
            });

            if (!res.ok) {
                throw new Error("Failed to upload image");
            }

            const data = await res.json();
            setFormData((prev) => ({ ...prev, featuredImage: data.url }));
            setSuccess("Image uploaded successfully!");
        } catch (err) {
            setError(err.message || "Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const url = editingId ? `/api/admin/blogs/${editingId}` : "/api/admin/blogs";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const message = await readResponseError(res, "Failed to save blog");
                throw new Error(message);
            }

            setSuccess(editingId ? "Blog updated successfully!" : "Blog created successfully!");
            fetchBlogs();
            resetForm();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (blog) => {
        setFormData({
            title: blog.title,
            excerpt: blog.excerpt,
            content: blog.content,
            contentBlocks: blog.contentBlocks || [],
            featuredImage: blog.featuredImage || "",
            isPublished: blog.isPublished,
        });
        setEditingId(blog.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this blog?")) return;

        try {
            const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const message = await readResponseError(res, "Failed to delete blog");
                throw new Error(message);
            }
            setSuccess("Blog deleted successfully!");
            fetchBlogs();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="admin-section">
                <h1>Blogs</h1>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h1>Blog Management</h1>
                <button
                    className="btn-primary"
                    onClick={() => setShowForm(!showForm)}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                    <IconPlus size={16} />
                    {showForm ? "Cancel" : "New Blog"}
                </button>
            </div>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}

            {showForm && (
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="admin-form"
                    style={{ marginBottom: "2rem" }}
                >
                    <div className="form-group">
                        <label>Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Blog title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Excerpt *</label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            placeholder="Short description (10-300 characters)"
                            rows="3"
                            required
                        />
                        <small>{formData.excerpt.length}/300 (minimum 10)</small>
                    </div>

                    <div className="form-group">
                        <label>Content *</label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Main blog content (intro text)"
                            rows="6"
                            required
                        />
                        <small>{formData.content.length} characters (minimum 20)</small>
                    </div>

                    <div className="form-group">
                        <label>Content Blocks</label>
                        <p style={{ fontSize: "0.8rem", color: "#666", margin: "0 0 1rem" }}>
                            Add headings, text, and images. Use controls to reorder blocks freely.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {formData.contentBlocks.map((block, idx) => (
                                <div key={idx} style={{
                                    border: "3px solid #000", borderRadius: "14px", overflow: "hidden",
                                    background: block.type === "heading" ? "#fffbeb" : block.type === "image" ? "#f0f9ff" : "#fff",
                                    display: "flex",
                                }}>
                                    <div style={{
                                        background: block.type === "heading" ? "#ffd400" : block.type === "image" ? "#3b82f6" : "#000",
                                        color: block.type === "image" || block.type === "text" ? "#fff" : "#000",
                                        width: "44px", minWidth: "44px", display: "flex", flexDirection: "column",
                                        alignItems: "center", justifyContent: "center", gap: "0.35rem",
                                        cursor: "grab", userSelect: "none", fontSize: "0.75rem", fontWeight: 900,
                                        borderRight: "3px solid #000",
                                    }}>
                                        <span style={{ fontSize: "1rem" }}>⋮⋮</span>
                                        <span style={{ fontSize: "0.85rem", fontWeight: 900 }}>{idx + 1}</span>
                                    </div>

                                    <div style={{ flex: 1, padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                                            <span style={{
                                                fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase",
                                                padding: "0.2rem 0.5rem", borderRadius: "6px",
                                                background: block.type === "heading" ? "#ffd400" : block.type === "image" ? "#3b82f6" : "#000",
                                                color: block.type === "image" ? "#fff" : block.type === "heading" ? "#000" : "#fff",
                                            }}>
                                                {block.type === "heading" ? "📝 Heading" : block.type === "image" ? "🖼️ Image" : "📄 Text"}
                                            </span>
                                            <div style={{ display: "flex", gap: "0.2rem", alignItems: "center", flexWrap: "wrap" }}>
                                                {idx > 0 && (
                                                    <button type="button" title="Move to top" onClick={() => {
                                                        const blocks = [...formData.contentBlocks];
                                                        const item = blocks.splice(idx, 1)[0];
                                                        blocks.unshift(item);
                                                        setFormData({ ...formData, contentBlocks: blocks });
                                                    }} style={blockBtnStyle}>⤒</button>
                                                )}
                                                {idx > 0 && (
                                                    <button type="button" title="Move up" onClick={() => {
                                                        const blocks = [...formData.contentBlocks];
                                                        [blocks[idx - 1], blocks[idx]] = [blocks[idx], blocks[idx - 1]];
                                                        setFormData({ ...formData, contentBlocks: blocks });
                                                    }} style={blockBtnStyle}>▲</button>
                                                )}
                                                {idx < formData.contentBlocks.length - 1 && (
                                                    <button type="button" title="Move down" onClick={() => {
                                                        const blocks = [...formData.contentBlocks];
                                                        [blocks[idx], blocks[idx + 1]] = [blocks[idx + 1], blocks[idx]];
                                                        setFormData({ ...formData, contentBlocks: blocks });
                                                    }} style={blockBtnStyle}>▼</button>
                                                )}
                                                {idx < formData.contentBlocks.length - 1 && (
                                                    <button type="button" title="Move to bottom" onClick={() => {
                                                        const blocks = [...formData.contentBlocks];
                                                        const item = blocks.splice(idx, 1)[0];
                                                        blocks.push(item);
                                                        setFormData({ ...formData, contentBlocks: blocks });
                                                    }} style={blockBtnStyle}>⤓</button>
                                                )}
                                                {formData.contentBlocks.length > 1 && (
                                                    <select
                                                        value={idx}
                                                        onChange={(e) => {
                                                            const target = Number(e.target.value);
                                                            if (target === idx) return;
                                                            const blocks = [...formData.contentBlocks];
                                                            const item = blocks.splice(idx, 1)[0];
                                                            blocks.splice(target, 0, item);
                                                            setFormData({ ...formData, contentBlocks: blocks });
                                                        }}
                                                        style={{ padding: "0.2rem 0.3rem", border: "2px solid #000", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", background: "#f5f5f5" }}
                                                        title="Jump to position"
                                                    >
                                                        {formData.contentBlocks.map((_, i) => (
                                                            <option key={i} value={i}>Pos {i + 1}</option>
                                                        ))}
                                                    </select>
                                                )}
                                                <button type="button" title="Duplicate" onClick={() => {
                                                    const blocks = [...formData.contentBlocks];
                                                    blocks.splice(idx + 1, 0, { ...block });
                                                    setFormData({ ...formData, contentBlocks: blocks });
                                                }} style={{ ...blockBtnStyle, background: "#6366f1", color: "#fff" }}>⧉</button>
                                                <button type="button" title="Delete" onClick={() => {
                                                    setFormData({ ...formData, contentBlocks: formData.contentBlocks.filter((_, i) => i !== idx) });
                                                }} style={{ ...blockBtnStyle, background: "#ef4444", color: "#fff" }}>✕</button>
                                            </div>
                                        </div>
                                        {block.type === "heading" && (
                                            <input
                                                type="text"
                                                value={block.value}
                                                onChange={(e) => {
                                                    const blocks = [...formData.contentBlocks];
                                                    blocks[idx] = { ...blocks[idx], value: e.target.value };
                                                    setFormData({ ...formData, contentBlocks: blocks });
                                                }}
                                                placeholder="Section heading..."
                                                style={{ width: "100%", padding: "0.65rem", border: "2px solid #000", borderRadius: "8px", fontSize: "1rem", fontWeight: 700 }}
                                            />
                                        )}
                                        {block.type === "text" && (
                                            <textarea
                                                value={block.value}
                                                onChange={(e) => {
                                                    const blocks = [...formData.contentBlocks];
                                                    blocks[idx] = { ...blocks[idx], value: e.target.value };
                                                    setFormData({ ...formData, contentBlocks: blocks });
                                                }}
                                                placeholder="Paragraph text..."
                                                rows="4"
                                                style={{ width: "100%", padding: "0.65rem", border: "2px solid #000", borderRadius: "8px", fontSize: "0.9rem", resize: "vertical" }}
                                            />
                                        )}
                                        {block.type === "image" && (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                                                    <button type="button" onClick={() => {
                                                        const input = document.createElement("input");
                                                        input.type = "file";
                                                        input.accept = "image/*";
                                                        input.onchange = async (ev) => {
                                                            const file = ev.target.files?.[0];
                                                            if (!file) return;
                                                            const fd = new FormData();
                                                            fd.append("file", file);
                                                            try {
                                                                const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                                                                if (!res.ok) throw new Error();
                                                                const data = await res.json();
                                                                const blocks = [...formData.contentBlocks];
                                                                blocks[idx] = { ...blocks[idx], value: data.url };
                                                                setFormData({ ...formData, contentBlocks: blocks });
                                                            } catch { setError("Failed to upload block image"); }
                                                        };
                                                        input.click();
                                                    }} style={{ ...blockBtnStyle, background: "#ffd400", fontSize: "0.8rem", padding: "0.4rem 0.8rem" }}>Upload</button>
                                                    <span style={{ fontSize: "0.75rem", color: "#666" }}>OR</span>
                                                    <input
                                                        type="text"
                                                        value={block.value}
                                                        onChange={(e) => {
                                                            const blocks = [...formData.contentBlocks];
                                                            blocks[idx] = { ...blocks[idx], value: e.target.value };
                                                            setFormData({ ...formData, contentBlocks: blocks });
                                                        }}
                                                        placeholder="Paste image URL"
                                                        style={{ flex: 1, minWidth: "180px", padding: "0.5rem", border: "2px solid #000", borderRadius: "8px", fontSize: "0.85rem" }}
                                                    />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={block.caption || ""}
                                                    onChange={(e) => {
                                                        const blocks = [...formData.contentBlocks];
                                                        blocks[idx] = { ...blocks[idx], caption: e.target.value };
                                                        setFormData({ ...formData, contentBlocks: blocks });
                                                    }}
                                                    placeholder="Image caption (optional)"
                                                    style={{ padding: "0.5rem", border: "2px solid #ccc", borderRadius: "8px", fontSize: "0.85rem" }}
                                                />
                                                {block.value && (
                                                    <div style={{ borderRadius: "10px", overflow: "hidden", border: "2px solid #000", maxHeight: "200px" }}>
                                                        <img src={block.value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
                            <button type="button" onClick={() => setFormData({ ...formData, contentBlocks: [...formData.contentBlocks, { type: "heading", value: "" }] })}
                                style={{ ...blockAddBtn, background: "#ffd400" }}>+ Heading</button>
                            <button type="button" onClick={() => setFormData({ ...formData, contentBlocks: [...formData.contentBlocks, { type: "text", value: "" }] })}
                                style={{ ...blockAddBtn, background: "#000", color: "#fff" }}>+ Text</button>
                            <button type="button" onClick={() => setFormData({ ...formData, contentBlocks: [...formData.contentBlocks, { type: "image", value: "", caption: "" }] })}
                                style={{ ...blockAddBtn, background: "#3b82f6", color: "#fff" }}>+ Image</button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Featured Image</label>
                        <div className="image-upload-wrapper">
                            <div className="image-upload-options">
                                <div className="image-upload-btn-group">
                                    <button
                                        type="button"
                                        className="btn-upload"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                    >
                                        <IconUpload size={16} />
                                        {uploading ? "Uploading..." : "Upload Image"}
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        style={{ display: "none" }}
                                    />
                                </div>
                                <span className="upload-divider">OR</span>
                                <input
                                    type="text"
                                    value={formData.featuredImage}
                                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                                    placeholder="Paste image URL"
                                    className="image-url-input"
                                />
                            </div>

                            {formData.featuredImage && (
                                <div className="image-preview">
                                    <img
                                        src={formData.featuredImage}
                                        alt="Featured"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="image-remove-btn"
                                        onClick={() => setFormData({ ...formData, featuredImage: "" })}
                                    >
                                        <IconX size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.isPublished}
                                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                            />
                            Publish this blog
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary">
                            <IconCheck size={15} />
                            {editingId ? "Update" : "Create"}
                        </button>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={resetForm}
                        >
                            <IconX size={15} />
                            Cancel
                        </button>
                    </div>
                </motion.form>
            )}

            <div style={{ marginTop: "2rem" }}>
                <h3>All Blogs ({blogs.length})</h3>
                {blogs.length === 0 ? (
                    <p className="muted-text">No blogs yet. Create your first blog post!</p>
                ) : (
                    <div style={{ display: "grid", gap: "1rem" }}>
                        {blogs.map((blog) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="admin-card"
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ marginBottom: "0.25rem" }}>{blog.title}</h4>
                                        <p className="muted-text" style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                                            {blog.excerpt.substring(0, 100)}...
                                        </p>
                                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                                            <span
                                                style={{
                                                    fontSize: "0.75rem",
                                                    padding: "0.25rem 0.5rem",
                                                    borderRadius: "0.25rem",
                                                    backgroundColor: blog.isPublished ? "#dbeafe" : "#fef3c7",
                                                    color: blog.isPublished ? "#1e40af" : "#92400e",
                                                }}
                                            >
                                                {blog.isPublished ? "Published" : "Draft"}
                                            </span>
                                            <span className="muted-text" style={{ fontSize: "0.75rem" }}>
                                                by {blog.admin?.username || "Unknown"}
                                            </span>
                                            <span className="muted-text" style={{ fontSize: "0.75rem" }}>
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                        <button
                                            onClick={() => handleEdit(blog)}
                                            className="btn-secondary"
                                        >
                                            <IconEdit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog.id)}
                                            className="btn-danger"
                                        >
                                            <IconTrash size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .admin-form {
                    background: #fff;
                    border: 4px solid #000;
                    border-radius: 20px;
                    padding: 2rem;
                    box-shadow: 8px 8px 0 #000;
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-group label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #000;
                    margin-bottom: 0.5rem;
                }

                .form-group input[type="text"],
                .form-group textarea {
                    width: 100%;
                    padding: 0.875rem 1rem;
                    border: 3px solid #000;
                    border-radius: 12px;
                    font-size: 0.95rem;
                    font-weight: 600;
                    background: #f5f5f5;
                    transition: all 0.2s ease;
                }

                .form-group input[type="text"]:focus,
                .form-group textarea:focus {
                    outline: none;
                    background: #fff;
                    box-shadow: 6px 6px 0 #000;
                }

                .form-group small {
                    display: block;
                    font-size: 0.75rem;
                    color: #666;
                    margin-top: 0.25rem;
                }

                .image-upload-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .image-upload-options {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .image-upload-btn-group {
                    display: flex;
                    gap: 0.5rem;
                }

                .btn-upload {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.25rem;
                    background: #ffd400;
                    color: #000;
                    border: 3px solid #000;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 4px 4px 0 #000;
                }

                .btn-upload:hover:not(:disabled) {
                    transform: translate(-2px, -2px);
                    box-shadow: 6px 6px 0 #000;
                }

                .btn-upload:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .upload-divider {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #666;
                }

                .image-url-input {
                    flex: 1;
                    min-width: 200px;
                    padding: 0.75rem 1rem;
                    border: 3px solid #000;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    background: #f5f5f5;
                }

                .image-preview {
                    position: relative;
                    width: 200px;
                    height: 120px;
                    border: 3px solid #000;
                    border-radius: 12px;
                    overflow: hidden;
                }

                .image-preview img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .image-remove-btn {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    width: 24px;
                    height: 24px;
                    background: #ef4444;
                    color: #fff;
                    border: 2px solid #000;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 0.75rem;
                }

                .checkbox-label {
                    display: flex !important;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    font-size: 0.9rem !important;
                    font-weight: 600 !important;
                    text-transform: none !important;
                    letter-spacing: normal !important;
                    padding: 0.75rem 1rem;
                    background: #f0f9ff;
                    border: 3px solid #000;
                    border-radius: 12px;
                }

                .checkbox-label input[type="checkbox"] {
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                }

                .form-actions {
                    display: flex;
                    gap: 0.75rem;
                    margin-top: 1.5rem;
                }

                .btn-primary {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.875rem 1.5rem;
                    background: #000;
                    color: #fff;
                    border: 3px solid #000;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 4px 4px 0 #ffd400;
                }

                .btn-primary:hover {
                    transform: translate(-2px, -2px);
                    box-shadow: 6px 6px 0 #ffd400;
                }

                .btn-secondary {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.875rem 1.5rem;
                    background: #fff;
                    color: #000;
                    border: 3px solid #000;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 0.95rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .btn-secondary:hover {
                    background: #f5f5f5;
                }

                .alert {
                    padding: 1rem;
                    border-radius: 12px;
                    margin-bottom: 1rem;
                    font-weight: 600;
                }

                .alert-error {
                    background: #fef2f2;
                    color: #dc2626;
                    border: 3px solid #dc2626;
                }

                .alert-success {
                    background: #ecfdf5;
                    color: #059669;
                    border: 3px solid #059669;
                }

                .admin-card {
                    padding: 1.25rem;
                    background: #fff;
                    border: 4px solid #000;
                    border-radius: 16px;
                    box-shadow: 4px 4px 0 #000;
                    transition: all 0.2s ease;
                }

                .admin-card:hover {
                    transform: translate(-2px, -2px);
                    box-shadow: 6px 6px 0 #000;
                }

                @media (max-width: 600px) {
                    .form-actions {
                        flex-direction: column;
                    }

                    .btn-primary,
                    .btn-secondary {
                        width: 100%;
                        justify-content: center;
                    }

                    .image-upload-options {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .upload-divider {
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    );
}

const blockBtnStyle = {
    padding: "0.25rem 0.5rem", border: "2px solid #000", borderRadius: "6px",
    fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", background: "#fff", color: "#000",
    lineHeight: 1,
};

const blockAddBtn = {
    padding: "0.6rem 1.25rem", border: "3px solid #000", borderRadius: "10px",
    fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
    boxShadow: "3px 3px 0 #000", transition: "all 0.15s ease",
};
