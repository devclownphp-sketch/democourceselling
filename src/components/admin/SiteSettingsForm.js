"use client";

import { useState, useEffect } from "react";

const TABS = [
    { id: "colors", label: "🎨 Colors" },
    { id: "hero", label: "🏠 Hero" },
    { id: "stats", label: "📊 Stats" },
    { id: "social", label: "🔗 Social" },
    { id: "security", label: "🔒 Security" },
    { id: "storage", label: "💾 Storage" },
];

export default function SiteSettingsForm() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [activeTab, setActiveTab] = useState("colors");

    useEffect(() => {
        fetch("/api/admin/site-settings")
            .then((res) => res.json())
            .then((data) => {
                setSettings(data.settings);
                setLoading(false);
            })
            .catch(() => {
                setSettings({});
                setLoading(false);
            });
    }, []);

    const handleChange = (field, value) => {
        setSettings((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch("/api/admin/site-settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            setMessage({ type: "success", text: "Settings saved successfully! 🌟" });
            if (data.settings?.themeMode) {
                setTimeout(() => window.location.reload(), 1000);
            }
        } catch (error) {
            setMessage({ type: "error", text: `Error: ${error.message}` });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="panel">
                <p className="muted-text">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="stack-lg">
            <div className="panel">
                <h1>⚙️ Site Settings</h1>
                <p className="muted-text">Customize your website appearance and functionality.</p>

                <div style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "1.5rem",
                    flexWrap: "wrap",
                    borderBottom: "2px solid var(--border-light)",
                    paddingBottom: "0.75rem"
                }}>
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: "0.5rem 1rem",
                                borderRadius: "var(--radius-md)",
                                border: "none",
                                background: activeTab === tab.id ? "var(--brand-primary)" : "transparent",
                                color: activeTab === tab.id ? "#fff" : "var(--text-secondary)",
                                fontWeight: activeTab === tab.id ? 600 : 400,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === "colors" && (
                    <section>
                        <h3 className="text-lg font-semibold mb-4">Color Palette</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label>
                                Primary Color
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <input
                                        type="color"
                                        value={settings.primaryColor}
                                        onChange={(e) => handleChange("primaryColor", e.target.value)}
                                        style={{ width: "50px", height: "40px", border: "none", cursor: "pointer" }}
                                    />
                                    <input
                                        type="text"
                                        value={settings.primaryColor}
                                        onChange={(e) => handleChange("primaryColor", e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </label>
                            <label>
                                Secondary Color
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <input
                                        type="color"
                                        value={settings.secondaryColor}
                                        onChange={(e) => handleChange("secondaryColor", e.target.value)}
                                        style={{ width: "50px", height: "40px", border: "none", cursor: "pointer" }}
                                    />
                                    <input
                                        type="text"
                                        value={settings.secondaryColor}
                                        onChange={(e) => handleChange("secondaryColor", e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </label>
                            <label>
                                Accent Color
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <input
                                        type="color"
                                        value={settings.accentColor}
                                        onChange={(e) => handleChange("accentColor", e.target.value)}
                                        style={{ width: "50px", height: "40px", border: "none", cursor: "pointer" }}
                                    />
                                    <input
                                        type="text"
                                        value={settings.accentColor}
                                        onChange={(e) => handleChange("accentColor", e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </label>
                            <label>
                                Background Color
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <input
                                        type="color"
                                        value={settings.backgroundColor}
                                        onChange={(e) => handleChange("backgroundColor", e.target.value)}
                                        style={{ width: "50px", height: "40px", border: "none", cursor: "pointer" }}
                                    />
                                    <input
                                        type="text"
                                        value={settings.backgroundColor}
                                        onChange={(e) => handleChange("backgroundColor", e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </label>
                        </div>
                    </section>
                )}

                {activeTab === "hero" && (
                    <section>
                        <h3 className="text-lg font-semibold mb-4">Hero Section</h3>
                        <label>
                            Hero Title
                            <input
                                type="text"
                                value={settings.heroTitle}
                                onChange={(e) => handleChange("heroTitle", e.target.value)}
                                placeholder="Master Computer Skills"
                            />
                        </label>
                        <label>
                            Hero Subtitle
                            <textarea
                                value={settings.heroSubtitle}
                                onChange={(e) => handleChange("heroSubtitle", e.target.value)}
                                rows={3}
                                placeholder="Practical, job-ready computer education..."
                            />
                        </label>
                        <label>
                            CTA Button Text
                            <input
                                type="text"
                                value={settings.heroCtaText}
                                onChange={(e) => handleChange("heroCtaText", e.target.value)}
                                placeholder="Start Learning"
                            />
                        </label>
                    </section>
                )}

                {activeTab === "stats" && (
                    <section>
                        <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label>
                                Students Count
                                <input
                                    type="text"
                                    value={settings.statsStudentsCount}
                                    onChange={(e) => handleChange("statsStudentsCount", e.target.value)}
                                    placeholder="40K+"
                                />
                            </label>
                            <label>
                                Rating
                                <input
                                    type="text"
                                    value={settings.statsRating}
                                    onChange={(e) => handleChange("statsRating", e.target.value)}
                                    placeholder="4.7"
                                />
                            </label>
                            <label>
                                Monthly Learners
                                <input
                                    type="text"
                                    value={settings.statsMonthly}
                                    onChange={(e) => handleChange("statsMonthly", e.target.value)}
                                    placeholder="150K+"
                                />
                            </label>
                        </div>
                    </section>
                )}

                {activeTab === "social" && (
                    <section>
                        <h3 className="text-lg font-semibold mb-4">External Links</h3>
                        <label>
                            Google Review URL
                            <input
                                type="url"
                                value={settings.googleReviewUrl}
                                onChange={(e) => handleChange("googleReviewUrl", e.target.value)}
                                placeholder="https://www.google.com/maps/..."
                            />
                        </label>
                        <label>
                            Footer Copyright Text
                            <input
                                type="text"
                                value={settings.footerCopyright}
                                onChange={(e) => handleChange("footerCopyright", e.target.value)}
                                placeholder="© 2026 WEBCOM. All Rights Reserved."
                            />
                        </label>
                    </section>
                )}

                {activeTab === "storage" && (
                    <section>
                        <h3 className="text-lg font-semibold mb-4">Storage Settings</h3>
                        <p className="muted-text mb-6">Configure where files (images, PDFs, course content) are stored.</p>

                        <div style={{ display: "grid", gap: "1.5rem", maxWidth: "600px" }}>
                            <div>
                                <label style={{ fontWeight: 600, marginBottom: "0.75rem", display: "block" }}>Storage Provider</label>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
                                    <button
                                        onClick={() => handleChange("storageProvider", "local")}
                                        style={{
                                            padding: "1rem",
                                            borderRadius: "var(--radius-lg)",
                                            border: settings.storageProvider === "local" ? "3px solid var(--brand-primary)" : "2px solid var(--border-light)",
                                            background: settings.storageProvider === "local" ? "var(--brand-primary-light)" : "var(--paper)",
                                            cursor: "pointer",
                                            textAlign: "left",
                                        }}
                                    >
                                        <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>💾 Local Storage</div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Default for development</div>
                                    </button>
                                    <button
                                        onClick={() => handleChange("storageProvider", "s3")}
                                        style={{
                                            padding: "1rem",
                                            borderRadius: "var(--radius-lg)",
                                            border: settings.storageProvider === "s3" ? "3px solid var(--brand-primary)" : "2px solid var(--border-light)",
                                            background: settings.storageProvider === "s3" ? "var(--brand-primary-light)" : "var(--paper)",
                                            cursor: "pointer",
                                            textAlign: "left",
                                        }}
                                    >
                                        <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>☁️ AWS S3</div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Amazon Cloud Storage</div>
                                    </button>
                                    <button
                                        onClick={() => handleChange("storageProvider", "r2")}
                                        style={{
                                            padding: "1rem",
                                            borderRadius: "var(--radius-lg)",
                                            border: settings.storageProvider === "r2" ? "3px solid var(--brand-primary)" : "2px solid var(--border-light)",
                                            background: settings.storageProvider === "r2" ? "var(--brand-primary-light)" : "var(--paper)",
                                            cursor: "pointer",
                                            textAlign: "left",
                                        }}
                                    >
                                        <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>🌥️ Cloudflare R2</div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>S3-compatible storage</div>
                                    </button>
                                    <button
                                        onClick={() => handleChange("storageProvider", "gcs")}
                                        style={{
                                            padding: "1rem",
                                            borderRadius: "var(--radius-lg)",
                                            border: settings.storageProvider === "gcs" ? "3px solid var(--brand-primary)" : "2px solid var(--border-light)",
                                            background: settings.storageProvider === "gcs" ? "var(--brand-primary-light)" : "var(--paper)",
                                            cursor: "pointer",
                                            textAlign: "left",
                                        }}
                                    >
                                        <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>🔷 Google Cloud</div>
                                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>GCS Bucket Storage</div>
                                    </button>
                                </div>
                            </div>

                            {settings.storageProvider !== "local" && (
                                <div style={{ padding: "1rem", background: "var(--paper)", borderRadius: "var(--radius-lg)", border: "2px solid var(--border-light)" }}>
                                    <h4 style={{ fontWeight: 600, marginBottom: "1rem" }}>Bucket Configuration</h4>
                                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
                                        Bucket Name
                                        <input
                                            type="text"
                                            value={settings.storageBucket || ""}
                                            onChange={(e) => handleChange("storageBucket", e.target.value)}
                                            placeholder="my-bucket-name"
                                            style={{ padding: "0.75rem", border: "2px solid var(--border)", borderRadius: "var(--radius)", fontSize: "1rem" }}
                                        />
                                    </label>
                                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
                                        Region
                                        <input
                                            type="text"
                                            value={settings.storageRegion || ""}
                                            onChange={(e) => handleChange("storageRegion", e.target.value)}
                                            placeholder="ap-southeast-1"
                                            style={{ padding: "0.75rem", border: "2px solid var(--border)", borderRadius: "var(--radius)", fontSize: "1rem" }}
                                        />
                                    </label>
                                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
                                        Access Key ID
                                        <input
                                            type="text"
                                            value={settings.storageAccessKey || ""}
                                            onChange={(e) => handleChange("storageAccessKey", e.target.value)}
                                            placeholder="AKIA..."
                                            style={{ padding: "0.75rem", border: "2px solid var(--border)", borderRadius: "var(--radius)", fontSize: "1rem" }}
                                        />
                                    </label>
                                    <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "0.75rem" }}>
                                        Secret Access Key
                                        <input
                                            type="password"
                                            value={settings.storageSecretKey || ""}
                                            onChange={(e) => handleChange("storageSecretKey", e.target.value)}
                                            placeholder="••••••••"
                                            style={{ padding: "0.75rem", border: "2px solid var(--border)", borderRadius: "var(--radius)", fontSize: "1rem" }}
                                        />
                                    </label>
                                    {settings.storageProvider === "r2" && (
                                        <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                            R2 Account ID
                                            <input
                                                type="text"
                                                value={settings.storageAccountId || ""}
                                                onChange={(e) => handleChange("storageAccountId", e.target.value)}
                                                placeholder="abc123..."
                                                style={{ padding: "0.75rem", border: "2px solid var(--border)", borderRadius: "var(--radius)", fontSize: "1rem" }}
                                            />
                                        </label>
                                    )}
                                </div>
                            )}

                            <div style={{ padding: "1rem", background: "#f0fdf4", borderRadius: "var(--radius-lg)", border: "2px solid #10b981" }}>
                                <p style={{ margin: 0, fontSize: "0.85rem", color: "#166534" }}>
                                    <strong>Local Storage:</strong> Files stored in /public/uploads (default for development). Works without any cloud credentials.
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === "security" && (
                    <section>
                        <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
                        <p className="muted-text mb-6">Configure session timeout and concurrent session limits for admin accounts.</p>

                        <div style={{ display: "grid", gap: "1.5rem", maxWidth: "500px" }}>
                            <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                Session Timeout (minutes)
                                <select
                                    value={settings.sessionTimeoutMin || 30}
                                    onChange={(e) => handleChange("sessionTimeoutMin", parseInt(e.target.value))}
                                    style={{ padding: "0.75rem 1rem", border: "3px solid var(--border)", borderRadius: "var(--radius)", fontSize: "1rem" }}
                                >
                                    <option value={10}>10 minutes</option>
                                    <option value={15}>15 minutes</option>
                                    <option value={30}>30 minutes</option>
                                    <option value={45}>45 minutes</option>
                                    <option value={60}>60 minutes</option>
                                    <option value={120}>2 hours</option>
                                    <option value={240}>4 hours</option>
                                </select>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
                                    Admin will be logged out after this period of inactivity
                                </span>
                            </label>

                            <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                Max Concurrent Sessions
                                <select
                                    value={settings.maxSessions || 1}
                                    onChange={(e) => handleChange("maxSessions", parseInt(e.target.value))}
                                    style={{ padding: "0.75rem 1rem", border: "3px solid var(--border)", borderRadius: "var(--radius)", fontSize: "1rem" }}
                                >
                                    <option value={1}>1 session</option>
                                    <option value={2}>2 sessions</option>
                                    <option value={3}>3 sessions</option>
                                    <option value={5}>5 sessions</option>
                                </select>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
                                    Maximum concurrent admin sessions allowed
                                </span>
                            </label>
                        </div>
                    </section>
                )}

                <div className="inline-actions">
                    <button
                        className="btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "💾 Saving..." : "💾 Save Settings"}
                    </button>
                </div>

                {message.text && (
                    <div
                        className={`p-4 rounded-lg text-sm font-medium ${
                            message.type === "error" ? "error-text" : "success-text"
                        }`}
                        style={{
                            background: message.type === "error" ? "var(--danger-light)" : "var(--success-light)",
                            color: message.type === "error" ? "var(--danger)" : "var(--success)",
                        }}
                    >
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
}
