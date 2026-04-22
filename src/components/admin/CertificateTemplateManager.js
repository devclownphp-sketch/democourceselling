"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_FIELDS = [
    { key: "studentName", label: "Student Name", x: 100, y: 300, fontSize: 24, color: "#000000", width: 300 },
    { key: "courseName", label: "Course Name", x: 100, y: 250, fontSize: 18, color: "#000000", width: 400 },
    { key: "regId", label: "Registration ID", x: 50, y: 50, fontSize: 12, color: "#666666", width: 200 },
    { key: "startDate", label: "Start Date", x: 100, y: 200, fontSize: 14, color: "#000000", width: 150 },
    { key: "endDate", label: "End Date", x: 300, y: 200, fontSize: 14, color: "#000000", width: 150 },
    { key: "duration", label: "Duration", x: 100, y: 150, fontSize: 14, color: "#000000", width: 150 },
];

export default function CertificateTemplateManager({ initialTemplates = [], initialCertificates = [] }) {
    const [templates, setTemplates] = useState(initialTemplates);
    const [certificates, setCertificates] = useState(initialCertificates);
    const [form, setForm] = useState({ name: "", fileUrl: "", fields: DEFAULT_FIELDS, isActive: false });
    const [editingId, setEditingId] = useState("");
    const [activeTab, setActiveTab] = useState("templates");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [generateForm, setGenerateForm] = useState({
        templateId: "",
        studentName: "",
        courseName: "",
        courseId: "",
        startDate: "",
        endDate: "",
        duration: "",
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

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
            const response = await fetch("/api/admin/upload/certificate-template", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();
            setForm((prev) => ({ ...prev, fileUrl: data.url }));
            setSuccess("Template uploaded!");
        } catch (err) {
            setError("Failed to upload template");
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

    const deleteTemplate = async (id) => {
        if (!window.confirm("Delete this template?")) return;

        try {
            const response = await fetch(`/api/admin/certificates/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Delete failed");
            setTemplates((prev) => prev.filter((t) => t.id !== id));
            if (editingId === id) resetForm();
        } catch {
            setError("Failed to delete template");
        }
    };

    const setActive = async (template) => {
        try {
            const response = await fetch(`/api/admin/certificates/${template.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !template.isActive }),
            });
            const data = await response.json();
            if (response.ok) {
                setTemplates((prev) => prev.map((t) => (t.id === template.id ? data.template : t)));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const generateCertificate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/certificates/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(generateForm),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to generate");

            setCertificates((prev) => [data.certificate, ...prev]);
            setSuccess("Certificate generated!");
            setGenerateForm({
                templateId: "",
                studentName: "",
                courseName: "",
                courseId: "",
                startDate: "",
                endDate: "",
                duration: "",
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
            const response = await fetch(`/api/admin/certificates/delete?q=${encodeURIComponent(searchQuery)}&limit=100`);
            const data = await response.json();
            if (response.ok) {
                setSearchResults(data.certificates || []);
            } else {
                setError(data.error || "Search failed");
            }
        } catch (err) {
            setError("Search failed");
        } finally {
            setLoading(false);
        }
    };

    const deleteCertificate = async (cert) => {
        if (!window.confirm(`Delete certificate for ${cert.studentName}?`)) return;

        try {
            const response = await fetch(`/api/admin/certificates/delete?id=${cert.id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Delete failed");

            setCertificates((prev) => prev.filter((c) => c.id !== cert.id));
            setSearchResults((prev) => prev.filter((c) => c.id !== cert.id));
            setSuccess("Certificate deleted!");
        } catch {
            setError("Failed to delete certificate");
        }
    };

    const downloadCertificate = (cert) => {
        if (cert.downloadUrl) {
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
                                    <input name="name" value={form.name} onChange={onChange} placeholder="e.g., Standard Certificate" required style={inputStyle} />
                                </label>
                                <div>
                                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                        PDF Template (optional)
                                        <input type="file" accept="application/pdf" onChange={handleTemplateUpload} style={{ padding: "0.5rem", border: "4px solid #000", borderRadius: "16px", fontSize: "0.9rem" }} />
                                    </label>
                                    {form.fileUrl && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem", padding: "0.75rem", background: "#f5f5f5", borderRadius: "10px" }}>
                                            <span>PDF</span>
                                            <a href={form.fileUrl} target="_blank" rel="noreferrer" style={{ flex: 1, fontSize: "0.85rem" }}>{form.fileUrl}</a>
                                            <button type="button" onClick={() => setForm((p) => ({ ...p, fileUrl: "" }))} className="btn-danger" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>Remove</button>
                                        </div>
                                    )}
                                </div>
                                <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", fontWeight: 600 }}>
                                    <input type="checkbox" name="isActive" checked={form.isActive} onChange={onChange} style={{ width: "20px", height: "20px" }} />
                                    Set as Active Template
                                </label>
                            </div>
                            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                                <button type="submit" disabled={loading} className="btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
                                    {loading ? "Saving..." : editingId ? "Update Template" : "Create Template"}
                                </button>
                                {editingId && <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>}
                            </div>
                            <Messages />
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
                                            <button onClick={() => setActive(template)} className="btn-sm" style={{ background: template.isActive ? "#fff" : "#22c55e", color: template.isActive ? "#000" : "#fff" }}>
                                                {template.isActive ? "Deactivate" : "Activate"}
                                            </button>
                                            <button onClick={() => startEdit(template)} className="btn-sm btn-primary">Edit</button>
                                            <button onClick={() => deleteTemplate(template.id)} className="btn-sm btn-danger">Delete</button>
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
                                        {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    Student Name *
                                    <input value={generateForm.studentName} onChange={(e) => setGenerateForm((p) => ({ ...p, studentName: e.target.value }))} placeholder="Full name as on certificate" required style={inputStyle} />
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    Course Name *
                                    <input value={generateForm.courseName} onChange={(e) => setGenerateForm((p) => ({ ...p, courseName: e.target.value }))} placeholder="Course name" required style={inputStyle} />
                                </label>
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
                                    Duration (e.g., "3 Months")
                                    <input value={generateForm.duration} onChange={(e) => setGenerateForm((p) => ({ ...p, duration: e.target.value }))} placeholder="e.g., 3 Months" style={inputStyle} />
                                </label>
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: "1.5rem", opacity: loading ? 0.7 : 1 }}>
                                {loading ? "Generating..." : "Generate Certificate"}
                            </button>
                            <Messages />
                        </form>
                    </motion.div>
                )}

                {activeTab === "list" && (
                    <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <section className="panel">
                            <h3>Issued Certificates ({certificates.length})</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                                {certificates.map((cert) => (
                                    <div key={cert.id} className="cert-item">
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontWeight: 700, margin: 0 }}>{cert.studentName}</h4>
                                            <p style={{ fontSize: "0.9rem", color: "#666", margin: "0.25rem 0 0" }}>{cert.courseName}</p>
                                            <p style={{ fontSize: "0.8rem", color: "#888", margin: "0.5rem 0 0" }}>{cert.duration} | {new Date(cert.startDate).toLocaleDateString("en-IN")} - {new Date(cert.endDate).toLocaleDateString("en-IN")}</p>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#2563eb" }}>{cert.regId}</p>
                                            <p style={{ fontSize: "0.75rem", color: "#888" }}>Issued: {new Date(cert.issuedAt).toLocaleDateString("en-IN")}</p>
                                            {cert.downloadUrl && (
                                                <button onClick={() => downloadCertificate(cert)} className="btn-sm" style={{ marginTop: "0.5rem" }}>Download</button>
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
                            <p style={{ color: "#666", marginTop: "0.5rem", marginBottom: "1rem" }}>Search by name, registration ID, or certificate ID. Delete certificates when needed.</p>

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
                                {(searchResults.length > 0 ? searchResults : certificates).map((cert) => (
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
                            <Messages />
                        </section>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
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
            `}</style>
        </div>
    );
}

function Messages() {
    return null;
}

const inputStyle = { padding: "0.75rem 1rem", border: "4px solid #000", borderRadius: "16px", fontSize: "1rem", width: "100%" };
