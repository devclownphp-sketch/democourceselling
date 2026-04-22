"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PERMISSION_GROUPS = {
    Dashboard: [
        { key: "dashboard.view", label: "View Dashboard" },
        { key: "dashboard.stats", label: "View Statistics" },
    ],
    Courses: [
        { key: "courses.view", label: "View Courses" },
        { key: "courses.create", label: "Create Course" },
        { key: "courses.edit", label: "Edit Course" },
        { key: "courses.delete", label: "Delete Course" },
        { key: "courses.order", label: "Reorder Courses" },
    ],
    Quizzes: [
        { key: "quizzes.view", label: "View Quizzes" },
        { key: "quizzes.create", label: "Create Quiz" },
        { key: "quizzes.edit", label: "Edit Quiz" },
        { key: "quizzes.delete", label: "Delete Quiz" },
    ],
    Blogs: [
        { key: "blogs.view", label: "View Blogs" },
        { key: "blogs.create", label: "Create Blog" },
        { key: "blogs.edit", label: "Edit Blog" },
        { key: "blogs.delete", label: "Delete Blog" },
    ],
    "Course Types": [
        { key: "types.view", label: "View Types" },
        { key: "types.create", label: "Create Type" },
        { key: "types.edit", label: "Edit Type" },
        { key: "types.delete", label: "Delete Type" },
    ],
    "Study Materials": [
        { key: "materials.view", label: "View Materials" },
        { key: "materials.create", label: "Create Material" },
        { key: "materials.edit", label: "Edit Material" },
        { key: "materials.delete", label: "Delete Material" },
    ],
    "Drive Folders": [
        { key: "folders.view", label: "View Folders" },
        { key: "folders.create", label: "Create Folder" },
        { key: "folders.edit", label: "Edit Folder" },
        { key: "folders.delete", label: "Delete Folder" },
    ],
    PDFs: [
        { key: "pdfs.view", label: "View PDFs" },
        { key: "pdfs.upload", label: "Upload PDF" },
        { key: "pdfs.delete", label: "Delete PDF" },
        { key: "pdfs.viewer", label: "Change Viewer" },
    ],
    FAQs: [
        { key: "faqs.view", label: "View FAQs" },
        { key: "faqs.create", label: "Create FAQ" },
        { key: "faqs.edit", label: "Edit FAQ" },
        { key: "faqs.delete", label: "Delete FAQ" },
    ],
    Features: [
        { key: "features.view", label: "View Features" },
        { key: "features.create", label: "Create Feature" },
        { key: "features.edit", label: "Edit Feature" },
        { key: "features.delete", label: "Delete Feature" },
    ],
    Reviews: [
        { key: "reviews.view", label: "View Reviews" },
        { key: "reviews.create", label: "Create Review" },
        { key: "reviews.edit", label: "Edit Review" },
        { key: "reviews.delete", label: "Delete Review" },
        { key: "reviews.marquee", label: "Manage Marquee" },
    ],
    Marquee: [
        { key: "marquee.view", label: "View Settings" },
        { key: "marquee.edit", label: "Edit Settings" },
    ],
    Colors: [
        { key: "colors.view", label: "View Colors" },
        { key: "colors.edit", label: "Edit Colors" },
    ],
    Contacts: [
        { key: "contacts.view", label: "View Contacts" },
        { key: "contacts.delete", label: "Delete Contact" },
    ],
    Certificates: [
        { key: "certificates.view", label: "View Certificates" },
        { key: "certificates.create", label: "Create Certificate" },
        { key: "certificates.delete", label: "Delete Certificate" },
        { key: "certificates.templates", label: "Manage Templates" },
    ],
    "SubAdmins": [
        { key: "subadmins.view", label: "View SubAdmins" },
        { key: "subadmins.create", label: "Create SubAdmin" },
        { key: "subadmins.edit", label: "Edit SubAdmin" },
        { key: "subadmins.delete", label: "Delete SubAdmin" },
    ],
    Roles: [
        { key: "roles.view", label: "View Roles" },
        { key: "roles.create", label: "Create Role" },
        { key: "roles.edit", label: "Edit Role" },
        { key: "roles.delete", label: "Delete Role" },
    ],
    Admins: [
        { key: "admins.view", label: "View Admins" },
        { key: "admins.create", label: "Create Admin" },
        { key: "admins.delete", label: "Delete Admin" },
    ],
    "Site Settings": [
        { key: "settings.view", label: "View Settings" },
        { key: "settings.edit", label: "Edit Settings" },
    ],
};

const ALL_PERMISSIONS = Object.values(PERMISSION_GROUPS).flat().map((p) => p.key);

export default function SubAdminManager({ initialSubAdmins = [], initialRoles = [] }) {
    const [subadmins, setSubAdmins] = useState(initialSubAdmins);
    const [roles, setRoles] = useState(initialRoles);
    const [form, setForm] = useState({
        username: "",
        password: "",
        roleId: "",
        sessionTimeoutMin: 30,
        maxSessions: 2,
    });
    const [editingId, setEditingId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [activeTab, setActiveTab] = useState("subadmins");

    useEffect(() => {
        const styleId = "subadmin-manager-styles";
        if (!document.getElementById(styleId)) {
            const styleEl = document.createElement("style");
            styleEl.id = styleId;
            styleEl.textContent = styles;
            document.head.appendChild(styleEl);
        }
    }, []);

    const onChange = (e) => {
        const { name, value, type } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === "number" ? parseInt(value) || 0 : value }));
    };

    const resetForm = () => {
        setEditingId("");
        setForm({ username: "", password: "", roleId: "", sessionTimeoutMin: 30, maxSessions: 2 });
        setError("");
        setSuccess("");
    };

    const startEdit = (subadmin) => {
        setEditingId(subadmin.id);
        setForm({
            username: subadmin.username || "",
            password: "",
            roleId: subadmin.roleId || "",
            sessionTimeoutMin: Number(subadmin.sessionTimeoutMin) || 30,
            maxSessions: Number(subadmin.maxSessions) || 2,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            if (!editingId && !form.password) {
                setError("Password is required for new subadmins");
                setLoading(false);
                return;
            }

            const payload = {
                ...form,
                maxSessions: Number(form.maxSessions),
                sessionTimeoutMin: Number(form.sessionTimeoutMin),
            };
            if (!form.password) {
                delete payload.password;
            }

            const response = await fetch(
                editingId ? `/api/admin/subadmins/${editingId}` : "/api/admin/subadmins",
                {
                    method: editingId ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to save");

            if (editingId) {
                setSubAdmins((prev) => prev.map((s) => (s.id === editingId ? data.subadmin : s)));
                setSuccess("SubAdmin updated!");
            } else {
                setSubAdmins((prev) => [data.subadmin, ...prev]);
                setSuccess("SubAdmin created!");
            }
            resetForm();
        } catch (err) {
            setError(err.message || "Failed to save subadmin");
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (subadmin) => {
        try {
            const response = await fetch(`/api/admin/subadmins/${subadmin.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !subadmin.isActive }),
            });
            const data = await response.json();
            if (response.ok) {
                setSubAdmins((prev) => prev.map((s) => (s.id === subadmin.id ? data.subadmin : s)));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const deleteSubAdmin = async (id) => {
        if (!window.confirm("Delete this subadmin?")) return;

        try {
            const response = await fetch(`/api/admin/subadmins/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Delete failed");
            setSubAdmins((prev) => prev.filter((s) => s.id !== id));
            if (editingId === id) resetForm();
        } catch {
            setError("Failed to delete subadmin");
        }
    };

    const logoutSession = async (sessionId, subadminId) => {
        try {
            const response = await fetch(`/api/admin/subadmins/${subadminId}/sessions/${sessionId}`, { method: "DELETE" });
            if (response.ok) {
                setSubAdmins((prev) =>
                    prev.map((s) =>
                        s.id === subadminId
                            ? { ...s, sessions: s.sessions.filter((ses) => ses.id !== sessionId) }
                            : s
                    )
                );
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="stack-lg">
            <div className="cert-tabs">
                <button className={`cert-tab ${activeTab === "subadmins" ? "active" : ""}`} onClick={() => setActiveTab("subadmins")}>
                    SubAdmins
                </button>
                <button className={`cert-tab ${activeTab === "roles" ? "active" : ""}`} onClick={() => setActiveTab("roles")}>
                    Roles
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "subadmins" && (
                    <motion.div key="subadmins" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <motion.form className="panel" onSubmit={submit}>
                            <h3>{editingId ? "Edit SubAdmin" : "Create SubAdmin"}</h3>
                            <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    Username *
                                    <input name="username" value={form.username} onChange={onChange} placeholder="Unique username" required style={inputStyle} />
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    Password {editingId ? "(leave blank to keep)" : "*"}
                                    <input type="password" name="password" value={form.password} onChange={onChange} placeholder={editingId ? "Leave blank to keep current" : "Enter password"} required={!editingId} style={inputStyle} />
                                </label>
                                <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                    Role
                                    <select name="roleId" value={form.roleId} onChange={onChange} style={inputStyle}>
                                        <option value="">No role (all permissions)</option>
                                        {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
                                    </select>
                                </label>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                        Session Timeout (minutes)
                                        <select name="sessionTimeoutMin" value={form.sessionTimeoutMin} onChange={onChange} style={inputStyle}>
                                            {[10, 15, 30, 45, 60].map((min) => <option key={min} value={min}>{min} min</option>)}
                                        </select>
                                    </label>
                                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                        Max Sessions
                                        <select name="maxSessions" value={form.maxSessions} onChange={onChange} style={inputStyle}>
                                            {[1, 2, 3, 5].map((max) => <option key={max} value={max}>{max} session{max > 1 ? "s" : ""}</option>)}
                                        </select>
                                    </label>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                                <button type="submit" disabled={loading} className="btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
                                    {loading ? "Saving..." : editingId ? "Update SubAdmin" : "Create SubAdmin"}
                                </button>
                                {editingId && <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>}
                            </div>
                            <Messages error={error} success={success} />
                        </motion.form>

                        <section className="panel" style={{ marginTop: "1.5rem" }}>
                            <h3>All SubAdmins ({subadmins.length})</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                                {subadmins.map((subadmin) => (
                                    <div key={subadmin.id} className="cert-item">
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                                <span style={{ padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700, background: subadmin.isActive ? "#22c55e" : "#ef4444", color: "#fff" }}>
                                                    {subadmin.isActive ? "ACTIVE" : "INACTIVE"}
                                                </span>
                                                {subadmin.role && <span style={{ padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700, background: "#6366f1", color: "#fff" }}>{subadmin.role.name}</span>}
                                            </div>
                                            <h4 style={{ fontWeight: 700, margin: 0 }}>@{subadmin.username}</h4>
                                            <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
                                                <span>Timeout: {subadmin.sessionTimeoutMin}min</span>
                                                <span>Max: {subadmin.maxSessions}</span>
                                                <span>Sessions: {subadmin.sessions?.length || 0}</span>
                                            </div>
                                            {subadmin.sessions?.length > 0 && (
                                                <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "#f5f5f5", borderRadius: "10px" }}>
                                                    <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.5rem" }}>Active Sessions:</p>
                                                    {subadmin.sessions.map((session) => (
                                                        <div key={session.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                            <span style={{ fontSize: "0.8rem" }}>Expires: {new Date(session.expiresAt).toLocaleString()}</span>
                                                            <button onClick={() => logoutSession(session.id, subadmin.id)} style={{ padding: "0.2rem 0.6rem", background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer" }}>Logout</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <button onClick={() => toggleActive(subadmin)} className="btn-sm" style={{ background: subadmin.isActive ? "#fff" : "#22c55e", color: subadmin.isActive ? "#000" : "#fff" }}>{subadmin.isActive ? "Disable" : "Enable"}</button>
                                            <button onClick={() => startEdit(subadmin)} className="btn-sm btn-primary">Edit</button>
                                            <button onClick={() => deleteSubAdmin(subadmin.id)} className="btn-sm btn-danger">Delete</button>
                                        </div>
                                    </div>
                                ))}
                                {subadmins.length === 0 && <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>No subadmins yet.</p>}
                            </div>
                        </section>
                    </motion.div>
                )}

                {activeTab === "roles" && (
                    <motion.div key="roles" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <RoleManager roles={roles} setRoles={setRoles} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function RoleManager({ roles, setRoles }) {
    const [form, setForm] = useState({ name: "", permissions: [] });
    const [editingId, setEditingId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [expandedGroups, setExpandedGroups] = useState(() => {
        const allGroups = {};
        Object.keys(PERMISSION_GROUPS).forEach((g) => (allGroups[g] = true));
        return allGroups;
    });

    const togglePermission = (permKey) => {
        setForm((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(permKey)
                ? prev.permissions.filter((p) => p !== permKey)
                : [...prev.permissions, permKey],
        }));
    };

    const selectAllInGroup = (groupKey, perms) => {
        const groupPermKeys = perms.map((p) => p.key);
        const allSelected = groupPermKeys.every((p) => form.permissions.includes(p));
        setForm((prev) => ({
            ...prev,
            permissions: allSelected
                ? prev.permissions.filter((p) => !groupPermKeys.includes(p))
                : [...new Set([...prev.permissions, ...groupPermKeys])],
        }));
    };

    const selectAll = () => {
        setForm((prev) => ({ ...prev, permissions: [...ALL_PERMISSIONS] }));
    };

    const deselectAll = () => {
        setForm((prev) => ({ ...prev, permissions: [] }));
    };

    const resetForm = () => {
        setEditingId("");
        setForm({ name: "", permissions: [] });
        setError("");
        setSuccess("");
        setExpandedGroups({});
    };

    const startEdit = (role) => {
        setEditingId(role.id);
        setForm({ name: role.name || "", permissions: role.permissions || [] });
        const allGroups = {};
        Object.keys(PERMISSION_GROUPS).forEach((g) => (allGroups[g] = true));
        setExpandedGroups(allGroups);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                editingId ? `/api/admin/roles/${editingId}` : "/api/admin/roles",
                { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }
            );
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to save");

            if (editingId) {
                setRoles((prev) => prev.map((r) => (r.id === editingId ? data.role : r)));
                setSuccess("Role updated!");
            } else {
                setRoles((prev) => [data.role, ...prev]);
                setSuccess("Role created!");
            }
            resetForm();
        } catch (err) {
            setError(err.message || "Failed to save role");
        } finally {
            setLoading(false);
        }
    };

    const deleteRole = async (id) => {
        if (!window.confirm("Delete this role?")) return;
        try {
            const response = await fetch(`/api/admin/roles/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Delete failed");
            setRoles((prev) => prev.filter((r) => r.id !== id));
            if (editingId === id) resetForm();
        } catch {
            setError("Failed to delete role");
        }
    };

    const toggleGroup = (groupKey) => {
        setExpandedGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
    };

    return (
        <>
            <motion.form className="panel" onSubmit={submit}>
                <h3>{editingId ? "Edit Role" : "Create Role"}</h3>
                <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        Role Name *
                        <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g., Content Manager" required style={inputStyle} />
                    </label>

                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                            <span style={{ fontWeight: 700 }}>Permissions ({form.permissions.length} selected)</span>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button type="button" onClick={selectAll} style={btnStyle}>Select All</button>
                                <button type="button" onClick={deselectAll} style={btnStyle}>Deselect All</button>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => {
                                const selectedCount = perms.filter((p) => form.permissions.includes(p.key)).length;
                                const isExpanded = expandedGroups[group];
                                return (
                                    <div key={group} style={{ border: "3px solid #000", borderRadius: "12px", overflow: "hidden" }}>
                                        <div
                                            onClick={() => toggleGroup(group)}
                                            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", background: selectedCount > 0 ? "#ffd400" : "#f8f9fc", cursor: "pointer", userSelect: "none" }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <span style={{ fontSize: "1.2rem" }}>{isExpanded ? "▼" : "▶"}</span>
                                                <span style={{ fontWeight: 700 }}>{group}</span>
                                                <span style={{ fontSize: "0.75rem", background: "#000", color: "#fff", padding: "0.1rem 0.5rem", borderRadius: "999px" }}>{selectedCount}/{perms.length}</span>
                                            </div>
                                            <button type="button" onClick={(e) => { e.stopPropagation(); selectAllInGroup(group, perms); }} style={{ ...btnSmall, background: selectedCount === perms.length ? "#000" : "#fff", color: selectedCount === perms.length ? "#fff" : "#000" }}>
                                                {selectedCount === perms.length ? "Deselect All" : "Select All"}
                                            </button>
                                        </div>
                                        {isExpanded && (
                                            <div style={{ padding: "1rem", background: "#fff", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                                {perms.map((perm) => (
                                                    <label
                                                        key={perm.key}
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{
                                                            display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 0.75rem",
                                                            background: form.permissions.includes(perm.key) ? "#000" : "#fff",
                                                            color: form.permissions.includes(perm.key) ? "#ffd400" : "#000",
                                                            border: "2px solid #000", borderRadius: "8px", fontSize: "0.8rem",
                                                            fontWeight: 600, cursor: "pointer", boxShadow: form.permissions.includes(perm.key) ? "2px 2px 0 #ffd400" : "none",
                                                        }}
                                                    >
                                                        <input type="checkbox" checked={form.permissions.includes(perm.key)} onChange={() => togglePermission(perm.key)} style={{ display: "none" }} />
                                                        {perm.label}
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                    <button type="submit" disabled={loading} className="btn-primary" style={{ opacity: loading ? 0.7 : 1 }}>
                        {loading ? "Saving..." : editingId ? "Update Role" : "Create Role"}
                    </button>
                    {editingId && <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>}
                </div>
                <Messages error={error} success={success} />
            </motion.form>

            <section className="panel" style={{ marginTop: "1.5rem" }}>
                <h3>All Roles ({roles.length})</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                    {roles.map((role) => (
                        <div key={role.id} className="cert-item">
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontWeight: 700, margin: 0 }}>{role.name}</h4>
                                <p style={{ fontSize: "0.8rem", color: "#666", margin: "0.5rem 0 0" }}>{role.permissions?.length || 0} permissions</p>
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button onClick={() => startEdit(role)} className="btn-sm btn-primary">Edit</button>
                                <button onClick={() => deleteRole(role.id)} className="btn-sm btn-danger">Delete</button>
                            </div>
                        </div>
                    ))}
                    {roles.length === 0 && <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>No roles yet.</p>}
                </div>
            </section>
        </>
    );
}

function Messages({ error, success }) {
    return (
        <AnimatePresence>
            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "#ef4444", fontWeight: 600, marginTop: "1rem" }}>{error}</motion.p>}
            {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "#22c55e", fontWeight: 600, marginTop: "1rem" }}>{success}</motion.p>}
        </AnimatePresence>
    );
}

const inputStyle = { padding: "0.75rem 1rem", border: "4px solid #000", borderRadius: "16px", fontSize: "1rem", width: "100%" };
const btnStyle = { padding: "0.4rem 0.8rem", background: "#ffd400", border: "2px solid #000", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" };
const btnSmall = { padding: "0.2rem 0.6rem", border: "2px solid #000", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" };

const styles = `
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
`;
