"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconPlus, IconEdit, IconTrash, IconX, IconCheck } from "@/components/Icons";

export default function BlogManager() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
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
            featuredImage: "",
            isPublished: false,
        });
        setEditingId(null);
        setShowForm(false);
        setError("");
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
            featuredImage: blog.featuredImage,
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
                <div
                    className="alert"
                    style={{
                        backgroundColor: "#fee2e2",
                        color: "#991b1b",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        marginBottom: "1rem",
                    }}
                >
                    {error}
                </div>
            )}

            {success && (
                <div
                    className="alert"
                    style={{
                        backgroundColor: "#dcfce7",
                        color: "#166534",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        marginBottom: "1rem",
                    }}
                >
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
                            placeholder="Full blog content"
                            rows="10"
                            required
                        />
                        <small>{formData.content.length} characters (minimum 20)</small>
                    </div>

                    <div className="form-group">
                        <label>Featured Image URL</label>
                        <input
                            type="text"
                            value={formData.featuredImage}
                            onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <input
                                type="checkbox"
                                checked={formData.isPublished}
                                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                            />
                            Publish this blog
                        </label>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button type="submit" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <IconCheck size={15} /> {editingId ? "Update" : "Create"}
                        </button>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={resetForm}
                            style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
                        >
                            <IconX size={15} /> Cancel
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
                                style={{
                                    padding: "1rem",
                                    backgroundColor: "#f9fafb",
                                    borderRadius: "0.5rem",
                                    border: "1px solid #e5e7eb",
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem" }}>
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
                                            style={{
                                                padding: "0.5rem",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <IconEdit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog.id)}
                                            className="btn-danger"
                                            style={{
                                                padding: "0.5rem",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
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
        </div>
    );
}
