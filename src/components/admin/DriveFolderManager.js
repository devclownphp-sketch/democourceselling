"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const defaultForm = {
    folderName: "",
    courseId: "",
    driveLink: "",
};

export default function DriveFolderManager({ initialFolders, courses }) {
    const [folders, setFolders] = useState(initialFolders);
    const [form, setForm] = useState(defaultForm);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const onChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setForm(defaultForm);
        setError("");
        setSuccess("");
    };

    const submit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/admin/drive-folders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Could not add folder.");

            const course = courses.find((c) => c.id === form.courseId);
            setFolders((prev) => [
                {
                    ...data.folder,
                    course: course ? { id: course.id, title: course.title, slug: course.slug } : null,
                },
                ...prev,
            ]);
            setSuccess("✅ Drive folder added successfully.");
            resetForm();
        } catch (submitError) {
            setError(submitError.message || "Could not add folder.");
        } finally {
            setLoading(false);
        }
    };

    const removeFolder = async (id) => {
        if (!window.confirm("Delete this folder link?")) return;

        try {
            const response = await fetch("/api/admin/drive-folders", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (!response.ok) throw new Error("Delete failed");

            setFolders((prev) => prev.filter((f) => f.id !== id));
            setSuccess("✅ Folder deleted.");
        } catch {
            setError("Could not delete folder.");
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
                <h3>📂 Add Drive Folder</h3>

                <label>
                    📁 Folder Name
                    <input
                        name="folderName"
                        value={form.folderName}
                        onChange={onChange}
                        placeholder="e.g. Chapter 1 Notes"
                        required
                    />
                </label>

                <label>
                    📚 Course
                    <select name="courseId" value={form.courseId} onChange={onChange} required>
                        <option value="">— Select a course —</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    🔗 Google Drive Folder Link
                    <input
                        name="driveLink"
                        value={form.driveLink}
                        onChange={onChange}
                        placeholder="https://drive.google.com/drive/folders/..."
                        required
                    />
                </label>

                <div className="inline-actions">
                    <button className="btn-primary" type="submit" disabled={loading}>
                        {loading ? "⏳ Saving..." : "➕ Add Folder"}
                    </button>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="error-text"
                        >
                            ⚠️ {error}
                        </motion.p>
                    )}
                    {success && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="success-text"
                        >
                            {success}
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.form>

            <section className="panel">
                <h3>🗂️ Saved Drive Folders ({folders.length})</h3>
                <div className="table-wrap" style={{ marginTop: "0.8rem" }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Folder Name</th>
                                <th>Course</th>
                                <th>Folder ID</th>
                                <th>Added On</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {folders.map((folder) => (
                                <tr key={folder.id}>
                                    <td>{folder.folderName}</td>
                                    <td>{folder.course?.title || folder.courseId}</td>
                                    <td>
                                        <code style={{ fontSize: "var(--font-size-xs)", wordBreak: "break-all" }}>
                                            {folder.folderId}
                                        </code>
                                    </td>
                                    <td style={{ whiteSpace: "nowrap" }}>
                                        {new Date(folder.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                type="button"
                                                className="btn-danger"
                                                onClick={() => removeFolder(folder.id)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {folders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="empty-row">
                                        No drive folders added yet. Add one above.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
