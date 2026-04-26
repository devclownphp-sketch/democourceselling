"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_FIELDS = [
    { key: "studentName", label: "Student Name", x: 100, y: 300, fontSize: 24, color: "#000000", width: 300, type: "text" },
    { key: "courseName", label: "Course Name", x: 100, y: 250, fontSize: 18, color: "#000000", width: 400, type: "text" },
    { key: "regId", label: "Registration ID", x: 50, y: 50, fontSize: 12, color: "#666666", width: 200, type: "text" },
    { key: "startDate", label: "Start Date", x: 100, y: 200, fontSize: 14, color: "#000000", width: 150, type: "text" },
    { key: "endDate", label: "End Date", x: 300, y: 200, fontSize: 14, color: "#000000", width: 150, type: "text" },
    { key: "duration", label: "Duration", x: 100, y: 150, fontSize: 14, color: "#000000", width: 150, type: "text" },
    { key: "signatureImage", label: "Signature Image", x: 500, y: 80, width: 150, height: 60, type: "image" },
];

const SUPPORTED_TEXT_PLACEHOLDERS = [
    "[USER NAME]", "[STUDENT NAME]", "[CANDIDATE NAME]", "[NAME]",
    "[REG ID]", "[REG_ID]", "[REGISTRATION ID]", "[REGID]", "[REGISTRATION]",
    "[CERTIFICATE_ID]", "[CERTIFICATE ID]", "[CERT ID]", "[CERT_ID]",
    "[COURSE NAME]", "[COURSENAME]", "[COURCE NAME]", "[COURSE]",
    "[START DATE]", "[STARTDATE]", "[START]",
    "[END DATE]", "[ENDDATE]", "[END]",
    "[COURCE DURATION]", "[COURSE DURATION]", "[COURSEDURATION]", "[DURATION]", "[HOURS]",
    "[ISSUED DATE]", "[ISSUEDAT]", "[DATE]",
];

const SUPPORTED_IMAGE_PLACEHOLDERS = [
    "[SIGNATURE]", "[SIGNATURE IMAGE]", "[SIGN]",
    "[STAMP]", "[STAMP IMAGE]",
    "[LOGO]", "[LOGO IMAGE]",
    "[PHOTO]", "[PHOTO IMAGE]", "[PASSPORT PHOTO]", "[CANDIDATE PHOTO]",
];

export default function CertificateTemplateManager({ initialTemplates = [], initialCertificates = [] }) {
    const safeTemplates = Array.isArray(initialTemplates) ? initialTemplates.filter(t => t.name !== "Standard Certificate") : [];
    const [templates, setTemplates] = useState(safeTemplates);
    const [certificates, setCertificates] = useState(Array.isArray(initialCertificates) ? initialCertificates : []);
    const [form, setForm] = useState({ name: "", fileUrl: "", fields: DEFAULT_FIELDS, isActive: false });
    const [editingId, setEditingId] = useState("");
    const [activeTab, setActiveTab] = useState("templates");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const getDefaultDate = () => new Date().toISOString().split("T")[0];
    const activeTemplate = safeTemplates.find(t => t.isActive);
    const [generateForm, setGenerateForm] = useState({
        templateId: activeTemplate?.id || "",
        studentName: "",
        courseName: "",
        courseId: "",
        regId: "",
        startDate: getDefaultDate(),
        endDate: getDefaultDate(),
        duration: "",
        signatureImage: "",
        stampImage: "",
        logoImage: "",
        photoImage: "",
    });
    const [imageFiles, setImageFiles] = useState({
        signatureImage: null,
        stampImage: null,
        logoImage: null,
        photoImage: null,
    });
    const [generatedCertId, setGeneratedCertId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [courses, setCourses] = useState([]);
    const [courseDragOver, setCourseDragOver] = useState(false);
    const [downloadFilter, setDownloadFilter] = useState("all");

    useEffect(() => {
        async function fetchCourses() {
            try {
                const res = await fetch("/api/courses");
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data.courses || []);
                }
            } catch {}
        }
        fetchCourses();
    }, []);

    const refreshCertificates = async () => {
        try {
            const res = await fetch("/api/admin/certificates/list");
            if (res.ok) {
                const data = await res.json();
                setCertificates(data.certificates || []);
            }
        } catch {}
    };

    const onChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    const resetForm = () => {
        setEditingId("");
        setForm({ name: "", fileUrl: "", fields: DEFAULT_FIELDS, isActive: false });
        setError("");
        setSuccess("");
    };

    const startEdit = (template) => {
        setEditingId(template.id);
        setForm({
            name: template.name || "",
            fileUrl: template.fileUrl || "",
            fields: template.fields || DEFAULT_FIELDS,
            isActive: template.isActive ?? false,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleTemplateUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            setError("");
            const response = await fetch("/api/admin/upload/certificate-template", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Upload failed");
            }

            const data = await response.json();
            setForm((prev) => ({ ...prev, fileUrl: data.url }));
            setSuccess("Template uploaded!");
        } catch (err) {
            setError(err.message || "Failed to upload template");
        } finally {
            setLoading(false);
        }
    };

    const submitTemplate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                editingId ? `/api/admin/certificates/${editingId}` : "/api/admin/certificates",
                {
                    method: editingId ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to save");

            if (editingId) {
                setTemplates((prev) => prev.map((t) => (t.id === editingId ? data.template : t)));
                setSuccess("Template updated!");
            } else {
                setTemplates((prev) => [data.template, ...prev]);
                setSuccess("Template created!");
            }
            resetForm();
        } catch (err) {
            setError(err.message || "Failed to save template");
        } finally {
            setLoading(false);
        }
    };

    const deleteTemplate = async (template) => {
        if (!window.confirm(`Delete template "${template.name}"? This cannot be undone.`)) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`/api/admin/certificates/${template.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to delete template");

            setTemplates((prev) => prev.filter((t) => t.id !== template.id));
            if (editingId === template.id) resetForm();
            setSuccess(`Template "${template.name}" deleted successfully`);
        } catch (err) {
            setError(err.message || "Failed to delete template");
        } finally {
            setLoading(false);
        }
    };

    const setActive = async (template) => {
        setLoading(true);
        setError("");

        try {
            if (template.isActive) {
                await fetch(`/api/admin/certificates/${template.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isActive: false }),
                });
                setTemplates((prev) => prev.map((t) => ({ ...t, isActive: false })));
            } else {
                for (const t of templates) {
                    if (t.isActive) {
                        await fetch(`/api/admin/certificates/${t.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ isActive: false }),
                        });
                    }
                }
                await fetch(`/api/admin/certificates/${template.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isActive: true }),
                });
                setTemplates((prev) => prev.map((t) => ({ ...t, isActive: t.id === template.id })));
            }
        } catch (e) {
            setError("Failed to update template status");
        } finally {
            setLoading(false);
        }
    };

    const generateCertificate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setGeneratedCertId("");

        try {
            const formData = new FormData();
            formData.append("templateId", generateForm.templateId);
            formData.append("studentName", generateForm.studentName || "");
            formData.append("courseName", generateForm.courseName || "");
            formData.append("courseId", generateForm.courseId || "");
            formData.append("regId", generateForm.regId);
            formData.append("startDate", generateForm.startDate || "");
            formData.append("endDate", generateForm.endDate || "");
            formData.append("duration", generateForm.duration || "");
            for (const [key, file] of Object.entries(imageFiles)) {
                if (file) {
                    formData.append(key, file);
                }
            }
            const response = await fetch("/api/certificates/generate", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to generate");

            setCertificates((prev) => [data.certificate, ...prev]);
            setGeneratedCertId(data.certificate.certificateId);
            setSuccess(`Certificate generated! Certificate ID: ${data.certificate.certificateId}`);
            setGenerateForm({
                templateId: templates.find(t => t.isActive)?.id || "",
                studentName: "",
                courseName: "",
                courseId: "",
                regId: "",
                startDate: getDefaultDate(),
                endDate: getDefaultDate(),
                duration: "",
                signatureImage: "",
                stampImage: "",
                logoImage: "",
                photoImage: "",
            });
            setImageFiles({
                signatureImage: null,
                stampImage: null,
                logoImage: null,
                photoImage: null,
            });
        } catch (err) {
            setError(err.message || "Failed to generate certificate");
        } finally {
            setLoading(false);
        }
    };

    const searchCertificates = async () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/admin/certificates?q=${encodeURIComponent(searchQuery)}&limit=100`);
            const data = await response.json();
            if (response.ok) {
                setSearchResults(data.certificates || []);
            } else {
                setError(data.error || "Search failed");
            }
        } catch {
            setError("Search failed");
        } finally {
            setLoading(false);
        }
    };

    const deleteCertificate = async (cert) => {
        if (!window.confirm(`Delete certificate for ${cert.studentName}?`)) return;

        try {
            const response = await fetch(`/api/admin/certificates?id=${cert.id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Delete failed");

            setCertificates((prev) => prev.filter((c) => c.id !== cert.id));
            setSearchResults((prev) => prev.filter((c) => c.id !== cert.id));
            setSuccess("Certificate deleted!");
        } catch {
            setError("Failed to delete certificate");
        }
    };

    const handleImageFileChange = (fieldName, file) => {
        if (file) {
            setImageFiles((prev) => ({ ...prev, [fieldName]: file }));
            setGenerateForm((prev) => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
        } else {
            setImageFiles((prev) => ({ ...prev, [fieldName]: null }));
            setGenerateForm((prev) => ({ ...prev, [fieldName]: "" }));
        }
    };

    const removeImageFile = (fieldName) => {
        handleImageFileChange(fieldName, null);
    };

    const uploadImageFile = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/admin/upload/image", { method: "POST", body: formData });
        if (!response.ok) throw new Error("Image upload failed");
        const data = await response.json();
        return data.url;
    };

    const downloadCertificate = async (cert) => {
        if (!cert.downloadUrl) return;
        try {
            const response = await fetch(cert.downloadUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `${cert.studentName.replace(/\s+/g, '_')}_${cert.regId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch {
            window.open(cert.downloadUrl, "_blank");
        }
    };

    return (
        <div className="stack-lg">
            <div className="cert-tabs">
                <button className={`cert-tab ${activeTab === "templates" ? "active" : ""}`} onClick={() => setActiveTab("templates")}>
                    Templates
                </button>
                <button className={`cert-tab ${activeTab === "generate" ? "active" : ""}`} onClick={() => setActiveTab("generate")}>
                    Generate
                </button>
                <button className={`cert-tab ${activeTab === "list" ? "active" : ""}`} onClick={() => setActiveTab("list")}>
                    Issued ({certificates.length})
                </button>
                <button className={`cert-tab ${activeTab === "manage" ? "active" : ""}`} onClick={() => setActiveTab("manage")}>
                    Search & Delete
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "templates" && (
                    <motion.div key="templates" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <motion.form className="panel" onSubmit={submitTemplate}>
                            <h3>{editingId ? "Edit Template" : "Create Certificate Template"}</h3>
                            <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    Template Name *
                                    <input name="name" value={form.name} onChange={onChange} placeholder="e.g., Custom Certificate" required style={inputStyle} />
                                </label>
                                <div>
                                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                        PDF Template (optional)
                                        <input type="file" accept="application/pdf" onChange={handleTemplateUpload} style={{ padding: "0.5rem", border: "4px solid #000", borderRadius: "16px", fontSize: "0.9rem" }} />
                                    </label>
                                    {form.fileUrl && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem", padding: "0.75rem", background: "#f5f5f5", borderRadius: "10px" }}>
                                            <span>📄</span>
                                            <a href={form.fileUrl} target="_blank" rel="noreferrer" style={{ flex: 1, fontSize: "0.85rem" }}>{form.fileUrl}</a>
                                            <button type="button" onClick={() => setForm((p) => ({ ...p, fileUrl: "" }))} className="btn-danger" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>Remove</button>
                                        </div>
                                    )}
                                </div>

                                <div style={{ marginTop: "1rem", padding: "1rem", background: "#fffbeb", borderRadius: "12px", border: "2px solid #f59e0b" }}>
                                    <h4 style={{ margin: "0 0 0.75rem", fontWeight: 700, color: "#92400e" }}>📝 Supported Text Placeholders</h4>
                                    <p style={{ margin: "0 0 0.5rem", fontSize: "0.8rem", color: "#92400e" }}>Add these in your PDF template text:</p>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                                        {SUPPORTED_TEXT_PLACEHOLDERS.map((p) => (
                                            <code key={p} style={{ padding: "0.2rem 0.4rem", background: "#fef3c7", borderRadius: "4px", fontSize: "0.75rem" }}>{p}</code>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginTop: "0.75rem", padding: "1rem", background: "#f0fdf4", borderRadius: "12px", border: "2px solid #10b981" }}>
                                    <h4 style={{ margin: "0 0 0.75rem", fontWeight: 700, color: "#166534" }}>🖼️ Supported Image Placeholders</h4>
                                    <p style={{ margin: "0 0 0.5rem", fontSize: "0.8rem", color: "#166534" }}>Add these in your PDF template (image will replace text):</p>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                                        {SUPPORTED_IMAGE_PLACEHOLDERS.map((p) => (
                                            <code key={p} style={{ padding: "0.2rem 0.4rem", background: "#dcfce7", borderRadius: "4px", fontSize: "0.75rem" }}>{p}</code>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                                <button type="submit" disabled={loading} className="btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
                                    {loading ? "Saving..." : editingId ? "Update Template" : "Create Template"}
                                </button>
                                {editingId && <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>}
                            </div>
                            <Messages error={error} success={success} generatedCertId={generatedCertId} />
                        </motion.form>

                        <section className="panel" style={{ marginTop: "1.5rem" }}>
                            <h3>All Templates ({templates.length})</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                                {templates.map((template) => (
                                    <div key={template.id} className="cert-item">
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                                <span style={{ padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700, background: template.isActive ? "#22c55e" : "#ddd", color: template.isActive ? "#fff" : "#666" }}>
                                                    {template.isActive ? "ACTIVE" : "INACTIVE"}
                                                </span>
                                            </div>
                                            <h4 style={{ fontWeight: 700, margin: 0 }}>{template.name}</h4>
                                            {template.fileUrl && <p style={{ fontSize: "0.8rem", color: "#666", margin: "0.25rem 0 0" }}>PDF Template attached</p>}
                                        </div>
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <button onClick={() => setActive(template)} className="btn-sm" style={{ background: template.isActive ? "#fff" : "#22c55e", color: template.isActive ? "#000" : "#fff" }} disabled={loading}>
                                                {template.isActive ? "Deactivate" : "Activate"}
                                            </button>
                                            <button onClick={() => startEdit(template)} className="btn-sm btn-primary" disabled={loading}>Edit</button>
                                            <button onClick={() => deleteTemplate(template)} className="btn-sm btn-danger" disabled={loading}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                                {templates.length === 0 && <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>No templates yet. Create one above.</p>}
                            </div>
                        </section>
                    </motion.div>
                )}

                {activeTab === "generate" && (
                    <motion.div key="generate" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <form className="panel" onSubmit={generateCertificate}>
                            <h3>Generate Certificate</h3>
                            <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    Template *
                                    <select value={generateForm.templateId} onChange={(e) => setGenerateForm((p) => ({ ...p, templateId: e.target.value }))} required style={inputStyle}>
                                        <option value="">Select template...</option>
                                        {templates.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.name}{t.isActive ? " ⭐ (Default)" : ""}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    Student Name *
                                    <input value={generateForm.studentName} onChange={(e) => setGenerateForm((p) => ({ ...p, studentName: e.target.value }))} placeholder="Full name as on certificate" required style={inputStyle} />
                                </label>

                                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    <span style={{ fontWeight: 700 }}>Course Name * — Drag a course below or type manually</span>
                                    <div
                                        onDragOver={(e) => { e.preventDefault(); setCourseDragOver(true); }}
                                        onDragLeave={() => setCourseDragOver(false)}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setCourseDragOver(false);
                                            const courseData = e.dataTransfer.getData("application/json");
                                            if (courseData) {
                                                try {
                                                    const course = JSON.parse(courseData);
                                                    setGenerateForm((p) => ({
                                                        ...p,
                                                        courseName: course.title,
                                                        courseId: course.id,
                                                    }));
                                                } catch {}
                                            }
                                        }}
                                        style={{
                                            padding: "1rem",
                                            border: `3px dashed ${courseDragOver ? "#22c55e" : generateForm.courseName ? "#22c55e" : "#cbd5e1"}`,
                                            borderRadius: "16px",
                                            background: courseDragOver ? "#f0fdf4" : generateForm.courseName ? "#f0fdf4" : "#fafafa",
                                            textAlign: "center",
                                            transition: "all 0.2s ease",
                                            minHeight: "60px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "0.5rem",
                                        }}
                                    >
                                        {generateForm.courseName ? (
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%" }}>
                                                <span style={{ fontSize: "1.5rem" }}>✅</span>
                                                <div style={{ flex: 1, textAlign: "left" }}>
                                                    <p style={{ margin: 0, fontWeight: 800, fontSize: "1rem" }}>{generateForm.courseName}</p>
                                                    {generateForm.courseId && (
                                                        <p style={{ margin: "0.25rem 0 0", fontSize: "0.75rem", color: "#666" }}>ID: {generateForm.courseId}</p>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setGenerateForm((p) => ({ ...p, courseName: "", courseId: "" }))}
                                                    style={{ padding: "0.3rem 0.6rem", background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600 }}
                                                >
                                                    ✕ Clear
                                                </button>
                                            </div>
                                        ) : (
                                            <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>📚 Drag a course here from list below, or type manually</span>
                                        )}
                                    </div>

                                    {!generateForm.courseName && (
                                        <input
                                            value={generateForm.courseName}
                                            onChange={(e) => setGenerateForm((p) => ({ ...p, courseName: e.target.value }))}
                                            placeholder="Or type course name manually..."
                                            style={inputStyle}
                                        />
                                    )}

                                    {courses.length > 0 && !generateForm.courseName && (
                                        <div style={{ maxHeight: "200px", overflowY: "auto", border: "3px solid #000", borderRadius: "12px", background: "#fff" }}>
                                            <p style={{ padding: "0.5rem 0.75rem", margin: 0, fontSize: "0.75rem", fontWeight: 700, color: "#666", borderBottom: "2px solid #eee", background: "#f9f9f9" }}>
                                                Drag any course to the drop zone above ↑
                                            </p>
                                            {courses.map((course) => (
                                                <div
                                                    key={course.id}
                                                    draggable
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData("application/json", JSON.stringify({ id: course.id, title: course.title }));
                                                        e.dataTransfer.effectAllowed = "copy";
                                                    }}
                                                    onClick={() => setGenerateForm((p) => ({ ...p, courseName: course.title, courseId: course.id }))}
                                                    style={{
                                                        padding: "0.6rem 0.75rem",
                                                        borderBottom: "1px solid #f0f0f0",
                                                        cursor: "grab",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "0.5rem",
                                                        transition: "background 0.15s ease",
                                                        fontSize: "0.85rem",
                                                        fontWeight: 600,
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = "#ffd400"}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                                                >
                                                    <span style={{ cursor: "grab", fontSize: "0.9rem" }}>⠿</span>
                                                    {course.title}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                        Start Date *
                                        <input type="date" value={generateForm.startDate} onChange={(e) => setGenerateForm((p) => ({ ...p, startDate: e.target.value }))} required style={inputStyle} />
                                    </label>
                                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                        End Date *
                                        <input type="date" value={generateForm.endDate} onChange={(e) => setGenerateForm((p) => ({ ...p, endDate: e.target.value }))} required style={inputStyle} />
                                    </label>
                                </div>
                                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    Registration Number * (minimum 5 characters)
                                    <input value={generateForm.regId} onChange={(e) => setGenerateForm((p) => ({ ...p, regId: e.target.value }))} placeholder="e.g., REG-2026-001" required minLength={5} style={inputStyle} />
                                    <span style={{ fontSize: "0.75rem", color: "#666" }}>Certificate ID (7 letters) will be auto-generated</span>
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    Duration (e.g., "3 Months")
                                    <input value={generateForm.duration} onChange={(e) => setGenerateForm((p) => ({ ...p, duration: e.target.value }))} placeholder="e.g., 3 Months" style={inputStyle} />
                                </label>
                            </div>

                            <div style={{ marginTop: "1rem", padding: "1rem", background: "#f5f3ff", borderRadius: "12px", border: "2px solid #6f42c1" }}>
                                <h4 style={{ margin: "0 0 0.75rem", fontWeight: 700, color: "#6f42c1" }}>🖼️ Image Fields (All Optional)</h4>
                                <p style={{ margin: "0 0 1rem", fontSize: "0.8rem", color: "#666" }}>Upload images to replace [SIGNATURE], [STAMP], [LOGO], [PHOTO] placeholders in your PDF template. Leave empty if not using.</p>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                    <ImageUploadField
                                        label="Signature Image"
                                        fieldName="signatureImage"
                                        currentUrl={generateForm.signatureImage}
                                        onFileChange={handleImageFileChange}
                                        onRemove={removeImageFile}
                                    />
                                    <ImageUploadField
                                        label="Stamp Image"
                                        fieldName="stampImage"
                                        currentUrl={generateForm.stampImage}
                                        onFileChange={handleImageFileChange}
                                        onRemove={removeImageFile}
                                    />
                                    <ImageUploadField
                                        label="Logo Image"
                                        fieldName="logoImage"
                                        currentUrl={generateForm.logoImage}
                                        onFileChange={handleImageFileChange}
                                        onRemove={removeImageFile}
                                    />
                                    <ImageUploadField
                                        label="Photo Image"
                                        fieldName="photoImage"
                                        currentUrl={generateForm.photoImage}
                                        onFileChange={handleImageFileChange}
                                        onRemove={removeImageFile}
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: "1.5rem", opacity: loading ? 0.7 : 1 }}>
                                {loading ? "Generating..." : "Generate Certificate"}
                            </button>
                            <Messages error={error} success={success} generatedCertId={generatedCertId} />
                        </form>
                    </motion.div>
                )}

                {activeTab === "list" && (
                    <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <section className="panel">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <h3>Issued Certificates ({certificates.length})</h3>
                                <button type="button" onClick={refreshCertificates} className="btn-ghost" style={{ fontSize: "0.85rem" }}>↻ Refresh</button>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                                {certificates.map((cert) => (
                                    <div key={cert.id} className="cert-item">
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                                <h4 style={{ fontWeight: 700, margin: 0 }}>{cert.studentName}</h4>
                                                <span
                                                    title={cert.termsAccepted ? "Terms accepted & downloaded" : "Not yet downloaded"}
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        width: "22px",
                                                        height: "22px",
                                                        borderRadius: "50%",
                                                        fontSize: "0.7rem",
                                                        fontWeight: 900,
                                                        background: cert.termsAccepted ? "#22c55e" : "#e5e7eb",
                                                        color: cert.termsAccepted ? "#fff" : "#999",
                                                        border: cert.termsAccepted ? "2px solid #16a34a" : "2px solid #d1d5db",
                                                    }}
                                                >
                                                    {cert.termsAccepted ? "✓" : "✕"}
                                                </span>
                                                <span style={{
                                                    fontSize: "0.7rem",
                                                    fontWeight: 700,
                                                    color: cert.termsAccepted ? "#16a34a" : "#9ca3af",
                                                    fontStyle: "italic",
                                                }}>
                                                    {cert.termsAccepted ? "Downloaded by user" : "Not downloaded yet"}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: "0.9rem", color: "#666", margin: "0.25rem 0 0" }}>{cert.courseName}</p>
                                            <p style={{ fontSize: "0.8rem", color: "#888", margin: "0.5rem 0 0" }}>{cert.duration} | {new Date(cert.startDate).toLocaleDateString("en-IN")} - {new Date(cert.endDate).toLocaleDateString("en-IN")}</p>
                                        </div>
                                        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "0.4rem", alignItems: "flex-end" }}>
                                            {cert.certificateId && (
                                                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6f42c1", margin: 0 }}>Cert: {cert.certificateId}</p>
                                            )}
                                            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2563eb", margin: 0 }}>{cert.regId}</p>
                                            <p style={{ fontSize: "0.75rem", color: "#888", margin: 0 }}>Issued: {new Date(cert.issuedAt).toLocaleDateString("en-IN")}</p>
                                            {cert.downloadUrl && (
                                                <button onClick={() => downloadCertificate(cert)} className="btn-sm" style={{ marginTop: "0.25rem" }}>Download</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {certificates.length === 0 && <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>No certificates generated yet.</p>}
                            </div>
                        </section>
                    </motion.div>
                )}

                {activeTab === "manage" && (
                    <motion.div key="manage" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <section className="panel">
                            <h3>Search & Delete Certificates</h3>
                            <p style={{ color: "#666", marginTop: "0.5rem", marginBottom: "1rem" }}>Search by name, registration ID, or certificate ID. Filter and delete certificates.</p>

                            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                                {["all", "downloaded", "not-downloaded"].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setDownloadFilter(f)}
                                        style={{
                                            padding: "0.5rem 1rem",
                                            border: downloadFilter === f ? "3px solid #000" : "3px solid #ddd",
                                            borderRadius: "12px",
                                            background: downloadFilter === f ? (f === "downloaded" ? "#22c55e" : f === "not-downloaded" ? "#ef4444" : "#000") : "#fff",
                                            color: downloadFilter === f ? "#fff" : "#333",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            fontSize: "0.8rem",
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        {f === "all" ? "All" : f === "downloaded" ? "✓ Downloaded" : "✕ Not Downloaded"}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by name, reg ID, or certificate ID..."
                                    onKeyDown={(e) => e.key === "Enter" && searchCertificates()}
                                    style={{ ...inputStyle, flex: 1, minWidth: "250px" }}
                                />
                                <button onClick={searchCertificates} disabled={loading} className="btn-primary">
                                    {loading ? "Searching..." : "Search"}
                                </button>
                                {searchQuery && (
                                    <button onClick={() => { setSearchQuery(""); setSearchResults([]); }} className="btn-ghost">
                                        Clear
                                    </button>
                                )}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {(searchResults.length > 0 ? searchResults : certificates)
                                    .filter((cert) => {
                                        if (downloadFilter === "downloaded") return cert.termsAccepted;
                                        if (downloadFilter === "not-downloaded") return !cert.termsAccepted;
                                        return true;
                                    })
                                    .map((cert) => (
                                    <div key={cert.id} className="cert-item" style={{ background: searchResults.length > 0 ? "#fff" : undefined }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                                <span style={{ padding: "0.2rem 0.5rem", borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700, background: "#ffd400", color: "#000" }}>{cert.regId}</span>
                                            </div>
                                            <h4 style={{ fontWeight: 700, margin: 0 }}>{cert.studentName}</h4>
                                            <p style={{ fontSize: "0.9rem", color: "#666", margin: "0.25rem 0 0" }}>{cert.courseName}</p>
                                            <p style={{ fontSize: "0.75rem", color: "#888", margin: "0.25rem 0 0" }}>
                                                {cert.duration} | Issued: {new Date(cert.issuedAt).toLocaleDateString("en-IN")}
                                            </p>
                                            <p style={{ fontSize: "0.7rem", color: "#aaa", margin: "0.25rem 0 0" }}>ID: {cert.id}</p>
                                        </div>
                                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                                            {cert.downloadUrl && (
                                                <button onClick={() => downloadCertificate(cert)} className="btn-sm">Download</button>
                                            )}
                                            <button onClick={() => deleteCertificate(cert)} className="btn-sm btn-danger">Delete</button>
                                        </div>
                                    </div>
                                ))}
                                {searchResults.length === 0 && !searchQuery && certificates.length === 0 && (
                                    <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>No certificates found. Generate some first.</p>
                                )}
                                {searchResults.length === 0 && searchQuery && (
                                    <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>No certificates match your search.</p>
                                )}
                            </div>
                            <Messages error={error} success={success} generatedCertId={generatedCertId} />
                        </section>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .cert-tabs {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                }
                .cert-tab {
                    padding: 0.75rem 1.25rem;
                    background: #fff;
                    border: 4px solid #000;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .cert-tab:hover { background: #f5f5f5; }
                .cert-tab.active { background: #000; color: #ffd400; }
                .cert-item {
                    padding: 1rem;
                    background: #fff;
                    border: 4px solid #000;
                    border-radius: 16px;
                    box-shadow: 4px 4px 0 #000;
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                }
                .btn-sm {
                    padding: 0.4rem 0.8rem;
                    border: 2px solid #000;
                    border-radius: 10px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 0.8rem;
                    background: #fff;
                    transition: all 0.2s ease;
                }
                .btn-sm:hover:not(:disabled) {
                    transform: translateY(-1px);
                }
                .btn-sm:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .btn-sm.btn-primary {
                    background: #ffd400;
                    color: #000;
                }
                .btn-sm.btn-danger {
                    color: #ef4444;
                    border-color: #ef4444;
                }
                .btn-sm.btn-danger:hover:not(:disabled) {
                    background: #ef4444;
                    color: #fff;
                }
            `}</style>
        </div>
    );
}

function Messages({ error, success, generatedCertId }) {
    if (error) {
        return (
            <div style={{ marginTop: "1rem", padding: "1rem", background: "#fef2f2", border: "3px solid #ef4444", borderRadius: "12px", color: "#dc2626", fontWeight: 600 }}>
                ⚠️ {error}
            </div>
        );
    }
    if (success) {
        return (
            <div style={{ marginTop: "1rem", padding: "1rem", background: "#f0fdf4", border: "3px solid #22c55e", borderRadius: "12px" }}>
                <p style={{ margin: 0, color: "#16a34a", fontWeight: 600 }}>✅ {success}</p>
                {generatedCertId && (
                    <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "#ffd400", border: "2px solid #000", borderRadius: "8px" }}>
                        <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 700, color: "#000" }}>Certificate ID (share with student):</p>
                        <p style={{ margin: "0.25rem 0 0", fontSize: "1.25rem", fontWeight: 900, color: "#000", letterSpacing: "0.1em" }}>{generatedCertId}</p>
                    </div>
                )}
            </div>
        );
    }
    return null;
}

function ImageUploadField({ label, fieldName, currentUrl, onFileChange, onRemove }) {
    const [preview, setPreview] = useState(null);
    const [dragging, setDragging] = useState(false);

    const handleFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("Only image files are allowed");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("Image too large. Max 5MB allowed.");
            return;
        }
        onFileChange(fieldName, file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    };

    if (currentUrl) {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>{label}</span>
                <div style={{ position: "relative", padding: "0.75rem", background: "#f0fdf4", border: "2px solid #10b981", borderRadius: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {preview || currentUrl ? (
                            <img src={preview || currentUrl} alt={label} style={{ width: "60px", height: "40px", objectFit: "contain", borderRadius: "6px", border: "1px solid #ddd" }} />
                        ) : (
                            <div style={{ width: "60px", height: "40px", background: "#e5e7eb", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>🖼️</div>
                        )}
                        <span style={{ flex: 1, fontSize: "0.75rem", color: "#666", wordBreak: "break-all" }}>
                            {currentUrl.split("/").pop().substring(0, 30)}...
                        </span>
                        <button
                            type="button"
                            onClick={() => { setPreview(null); onRemove(fieldName); }}
                            style={{ padding: "0.3rem 0.6rem", background: "#ef4444", color: "#fff", border: "2px solid #ef4444", borderRadius: "8px", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600 }}
                        >
                            ✕ Remove
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>{label}</span>
            <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                style={{
                    padding: "1rem",
                    border: `3px dashed ${dragging ? "#6f42c1" : "#cbd5e1"}`,
                    borderRadius: "12px",
                    background: dragging ? "#f5f3ff" : "#f8fafc",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                }}
            >
                <input type="file" accept="image/*" onChange={handleChange} style={{ display: "none" }} id={`upload-${fieldName}`} />
                <label htmlFor={`upload-${fieldName}`} style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "1.5rem" }}>📷</span>
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Click or drag image here</span>
                    <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>PNG, JPG up to 5MB</span>
                </label>
            </div>
        </div>
    );
}

const inputStyle = { padding: "0.75rem 1rem", border: "4px solid #000", borderRadius: "16px", fontSize: "1rem", width: "100%" };