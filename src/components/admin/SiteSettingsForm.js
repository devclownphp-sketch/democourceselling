"use client";

import { useState, useEffect } from "react";

const TABS = [
    { id: "colors", label: "🎨 Colors" },
    { id: "theme", label: "🌓 Theme" },
    { id: "pdf", label: "📄 PDF Viewer" },
    { id: "hero", label: "🏠 Hero" },
    { id: "stats", label: "📊 Stats" },
    { id: "social", label: "🔗 Social" },
];

const PDF_VIEWERS = [
    {
        id: "google",
        name: "Google Drive Viewer",
        desc: "Fast, reliable preview via Google Drive. Best for shared Drive files.",
        icon: "🗂️",
    },
    {
        id: "pdfjs",
        name: "Mozilla PDF.js",
        desc: "Open-source PDF renderer by Mozilla. No external dependencies.",
        icon: "📰",
    },
    {
        id: "embedpdf",
        name: "Embed PDF Viewer",
        desc: "Native browser PDF embed with full-screen support.",
        icon: "📑",
    },
];

export default function SiteSettingsForm() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [activeTab, setActiveTab] = useState("theme");

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

            // If theme changed, reload to apply
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

                {/* Tabs */}
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

                {/* Colors Tab */}
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

                {/* Theme Tab */}
                {activeTab === "theme" && (
                    <section>
                        <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
                        <p className="muted-text mb-6">Choose your website appearance.</p>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "1rem",
                            marginTop: "1rem"
                        }}>
                            <label
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                    padding: "1.5rem",
                                    borderRadius: "var(--radius-xl)",
                                    border: settings.themeMode === "light" ? "3px solid var(--brand-primary)" : "2px solid var(--border-light)",
                                    cursor: "pointer",
                                    background: "var(--paper)",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <input
                                    type="radio"
                                    name="themeMode"
                                    value="light"
                                    checked={settings.themeMode === "light"}
                                    onChange={(e) => handleChange("themeMode", e.target.value)}
                                    style={{ display: "none" }}
                                />
                                <div style={{
                                    width: "80px",
                                    height: "60px",
                                    borderRadius: "var(--radius-md)",
                                    background: "linear-gradient(180deg, #f8f9fc 0%, #e2e8f0 100%)",
                                    border: "1px solid #e2e8f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1.5rem"
                                }}>
                                    ☀️
                                </div>
                                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Light Mode</span>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", textAlign: "center" }}>
                                    Clean, bright appearance
                                </span>
                                {settings.themeMode === "light" && (
                                    <span style={{
                                        position: "absolute",
                                        top: "0.5rem",
                                        right: "0.5rem",
                                        background: "var(--brand-primary)",
                                        color: "#fff",
                                        padding: "0.2rem 0.5rem",
                                        borderRadius: "var(--radius-sm)",
                                        fontSize: "0.7rem",
                                        fontWeight: 600
                                    }}>
                                        ACTIVE
                                    </span>
                                )}
                            </label>

                            <label
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: "0.75rem",
                                    padding: "1.5rem",
                                    borderRadius: "var(--radius-xl)",
                                    border: settings.themeMode === "dark" ? "3px solid var(--brand-primary)" : "2px solid var(--border-light)",
                                    cursor: "pointer",
                                    background: "var(--paper)",
                                    position: "relative",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <input
                                    type="radio"
                                    name="themeMode"
                                    value="dark"
                                    checked={settings.themeMode === "dark"}
                                    onChange={(e) => handleChange("themeMode", e.target.value)}
                                    style={{ display: "none" }}
                                />
                                <div style={{
                                    width: "80px",
                                    height: "60px",
                                    borderRadius: "var(--radius-md)",
                                    background: "linear-gradient(180deg, #1a1a2e 0%, #0a0a0a 100%)",
                                    border: "1px solid #2d2d3a",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1.5rem"
                                }}>
                                    🌙
                                </div>
                                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Dark Mode</span>
                                <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", textAlign: "center" }}>
                                    Easy on the eyes
                                </span>
                                {settings.themeMode === "dark" && (
                                    <span style={{
                                        position: "absolute",
                                        top: "0.5rem",
                                        right: "0.5rem",
                                        background: "var(--brand-primary)",
                                        color: "#fff",
                                        padding: "0.2rem 0.5rem",
                                        borderRadius: "var(--radius-sm)",
                                        fontSize: "0.7rem",
                                        fontWeight: 600
                                    }}>
                                        ACTIVE
                                    </span>
                                )}
                            </label>
                        </div>
                    </section>
                )}

                {/* PDF Viewer Tab */}
                {activeTab === "pdf" && (
                    <section>
                        <h3 className="text-lg font-semibold mb-4">PDF Viewer Settings</h3>
                        <p className="muted-text mb-6">Choose how PDF documents are displayed to users.</p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {PDF_VIEWERS.map((viewer) => (
                                <label
                                    key={viewer.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: "1rem",
                                        padding: "1.25rem",
                                        borderRadius: "var(--radius-lg)",
                                        border: settings.pdfViewer === viewer.id
                                            ? "3px solid var(--brand-primary)"
                                            : "2px solid var(--border-light)",
                                        cursor: "pointer",
                                        background: settings.pdfViewer === viewer.id
                                            ? "var(--brand-primary-light)"
                                            : "var(--paper)",
                                        transition: "all 0.2s ease"
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="pdfViewer"
                                        value={viewer.id}
                                        checked={settings.pdfViewer === viewer.id}
                                        onChange={(e) => handleChange("pdfViewer", e.target.value)}
                                        style={{ marginTop: "0.25rem" }}
                                    />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                            <span style={{ fontSize: "1.25rem" }}>{viewer.icon}</span>
                                            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                                                {viewer.name}
                                            </span>
                                        </div>
                                        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                                            {viewer.desc}
                                        </p>
                                    </div>
                                    {settings.pdfViewer === viewer.id && (
                                        <span style={{
                                            background: "var(--brand-primary)",
                                            color: "#fff",
                                            padding: "0.25rem 0.75rem",
                                            borderRadius: "var(--radius-sm)",
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            whiteSpace: "nowrap"
                                        }}>
                                            SELECTED ✓
                                        </span>
                                    )}
                                </label>
                            ))}
                        </div>
                    </section>
                )}

                {/* Hero Tab */}
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

                {/* Stats Tab */}
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

                {/* Social Tab */}
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
