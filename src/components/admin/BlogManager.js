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
                            placeholder="Full blog content"
                            rows="10"
                            required
                        />
                        <small>{formData.content.length} characters (minimum 20)</small>
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

            <style jsx>{`
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
