"use client";

import { useState, useEffect } from "react";

const COLOR_SETTINGS = [
    {
        section: "Primary Colors",
        colors: [
            { key: "primaryColor", label: "Primary Color", element: "Buttons, Links, CTAs", description: "Main action color for buttons and links" },
            { key: "secondaryColor", label: "Secondary Color", element: "Secondary Elements", description: "Used for secondary buttons and accents" },
            { key: "accentColor", label: "Accent Color", element: "Highlights, Badges", description: "Highlights, badges, and special elements" },
        ],
    },
    {
        section: "Background & Text",
        colors: [
            { key: "backgroundColor", label: "Background Color", element: "Page Background", description: "Main background color of the page" },
            { key: "textColor", label: "Text Color", element: "Body Text", description: "Main body text color" },
            { key: "headingColor", label: "Heading Color", element: "H1, H2, H3", description: "Headlines and section titles" },
        ],
    },
    {
        section: "Card & Border",
        colors: [
            { key: "cardBackground", label: "Card Background", element: "Cards, Panels", description: "Background color for cards and panels" },
            { key: "cardBorder", label: "Card Border", element: "Card Borders", description: "Border color for cards" },
            { key: "borderColor", label: "General Border", element: "Dividers, Outlines", description: "General border and divider color" },
        ],
    },
    {
        section: "Footer",
        colors: [
            { key: "footerBackground", label: "Footer Background", element: "Footer Area", description: "Background color for footer" },
            { key: "footerText", label: "Footer Text", element: "Footer Content", description: "Text color in the footer" },
            { key: "footerAccent", label: "Footer Accent", element: "Footer Highlights", description: "Accent color in the footer" },
        ],
    },
    {
        section: "Badges",
        colors: [
            { key: "badgeSuccess", label: "Success Badge", element: "Success Badges", description: "Green badges for success states" },
            { key: "badgeWarning", label: "Warning Badge", element: "Warning Badges", description: "Yellow badges for warnings" },
            { key: "badgeInfo", label: "Info Badge", element: "Info Badges", description: "Blue badges for information" },
            { key: "badgeError", label: "Error Badge", element: "Error Badges", description: "Red badges for errors" },
        ],
    },
    {
        section: "Special Elements",
        colors: [
            { key: "marqueeBackground", label: "Marquee Background", element: "Review Marquee", description: "Background of the review marquee section" },
            { key: "heroBackground", label: "Hero Background", element: "Hero Section", description: "Background of the hero section" },
            { key: "navbarBackground", label: "Navbar Background", element: "Navigation Bar", description: "Background color of the navbar" },
        ],
    },
];

const DEFAULT_COLORS = {
    primaryColor: "#2563eb",
    secondaryColor: "#0ea5e9",
    accentColor: "#8b5cf6",
    backgroundColor: "#ffffff",
    textColor: "#0f172a",
    headingColor: "#000000",
    cardBackground: "#ffffff",
    cardBorder: "#e2e8f0",
    borderColor: "#e2e8f0",
    footerBackground: "#000000",
    footerText: "#ffffff",
    footerAccent: "#ffd400",
    badgeSuccess: "#22c55e",
    badgeWarning: "#eab308",
    badgeInfo: "#3b82f6",
    badgeError: "#ef4444",
    marqueeBackground: "#ffd400",
    heroBackground: "#000000",
    navbarBackground: "#ffffff",
};

export default function ColorSettings() {
    const [colors, setColors] = useState(DEFAULT_COLORS);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadColors();
    }, []);

    async function loadColors() {
        try {
            const res = await fetch("/api/admin/colors");
            if (res.ok) {
                const data = await res.json();
                if (data.colors) {
                    setColors({ ...DEFAULT_COLORS, ...data.colors });
                }
            }
        } catch (err) {
            console.error("Failed to load colors:", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        setSaved(false);
        try {
            const res = await fetch("/api/admin/colors", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ colors }),
            });

            if (!res.ok) {
                throw new Error("Failed to save");
            }
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            alert("Failed to save colors");
        } finally {
            setSaving(false);
        }
    }

    function handleColorChange(key, value) {
        setColors(prev => ({ ...prev, [key]: value }));
    }

    function handleReset(section) {
        const sectionDefaults = {};
        COLOR_SETTINGS.find(s => s.section === section)?.colors.forEach(c => {
            sectionDefaults[c.key] = DEFAULT_COLORS[c.key];
        });
        setColors(prev => ({ ...prev, ...sectionDefaults }));
    }

    function handleResetAll() {
        if (confirm("Reset all colors to defaults?")) {
            setColors(DEFAULT_COLORS);
        }
    }

    if (loading) {
        return (
            <div className="color-settings-loading">
                <div className="color-spinner" />
                <p>Loading colors...</p>
            </div>
        );
    }

    return (
        <div className="color-settings">
            <div className="color-settings-header">
                <div>
                    <h2>Color Settings</h2>
                    <p>Customize the color scheme of your website</p>
                </div>
                <div className="color-settings-actions">
                    <button
                        className="color-reset-btn"
                        onClick={handleResetAll}
                    >
                        Reset All
                    </button>
                    <button
                        className="color-save-btn"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Changes"}
                    </button>
                </div>
            </div>

            {COLOR_SETTINGS.map((section) => (
                <div key={section.section} className="color-section">
                    <div className="color-section-header">
                        <h3>{section.section}</h3>
                        <button
                            className="color-section-reset"
                            onClick={() => handleReset(section.section)}
                        >
                            Reset
                        </button>
                    </div>
                    <div className="color-grid">
                        {section.colors.map((color) => (
                            <div key={color.key} className="color-item">
                                <div className="color-item-label">
                                    <label htmlFor={color.key}>{color.label}</label>
                                    <span className="color-element-tag">{color.element}</span>
                                </div>
                                <p className="color-item-desc">{color.description}</p>
                                <div className="color-input-wrapper">
                                    <input
                                        type="color"
                                        id={color.key}
                                        value={colors[color.key] || DEFAULT_COLORS[color.key]}
                                        onChange={(e) => handleColorChange(color.key, e.target.value)}
                                        className="color-picker"
                                    />
                                    <input
                                        type="text"
                                        value={colors[color.key] || DEFAULT_COLORS[color.key]}
                                        onChange={(e) => handleColorChange(color.key, e.target.value)}
                                        className="color-text-input"
                                        placeholder="#000000"
                                    />
                                    <button
                                        className="color-copy-btn"
                                        onClick={() => navigator.clipboard.writeText(colors[color.key])}
                                        title="Copy color"
                                    >
                                        📋
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className="color-preview-section">
                <h3>Preview</h3>
                <div className="color-preview-grid">
                    <div
                        className="color-preview-card"
                        style={{ background: colors.cardBackground, borderColor: colors.cardBorder }}
                    >
                        <h4 style={{ color: colors.headingColor }}>Sample Card</h4>
                        <p style={{ color: colors.textColor }}>This is sample card text</p>
                        <button
                            style={{
                                background: colors.primaryColor,
                                color: "#fff",
                                padding: "0.5rem 1rem",
                                borderRadius: "8px",
                                border: "none",
                            }}
                        >
                            Primary Button
                        </button>
                        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                            <span style={{ background: colors.badgeSuccess, padding: "0.25rem 0.5rem", borderRadius: "4px", color: "#fff", fontSize: "0.75rem" }}>Success</span>
                            <span style={{ background: colors.badgeWarning, padding: "0.25rem 0.5rem", borderRadius: "4px", color: "#000", fontSize: "0.75rem" }}>Warning</span>
                            <span style={{ background: colors.badgeInfo, padding: "0.25rem 0.5rem", borderRadius: "4px", color: "#fff", fontSize: "0.75rem" }}>Info</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .color-settings {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .color-settings-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem;
                    gap: 1rem;
                }

                .color-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f5f5f5;
                    border-top-color: #000;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .color-settings-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    flex-wrap: wrap;
                    gap: 1rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 3px solid #000;
                }

                .color-settings-header h2 {
                    margin: 0;
                    font-size: 1.5rem;
                    font-weight: 800;
                }

                .color-settings-header p {
                    margin: 0.25rem 0 0;
                    opacity: 0.7;
                    font-size: 0.9rem;
                }

                .color-settings-actions {
                    display: flex;
                    gap: 0.75rem;
                }

                .color-reset-btn {
                    padding: 0.6rem 1.2rem;
                    background: #fff;
                    border: 3px solid #000;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .color-reset-btn:hover {
                    background: #f5f5f5;
                }

                .color-save-btn {
                    padding: 0.6rem 1.5rem;
                    background: #000;
                    color: #fff;
                    border: 3px solid #000;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .color-save-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }

                .color-save-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .color-section {
                    background: #f8f9fa;
                    border-radius: 16px;
                    padding: 1.5rem;
                    border: 2px solid #000;
                }

                .color-section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.25rem;
                }

                .color-section-header h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 800;
                }

                .color-section-reset {
                    padding: 0.4rem 0.8rem;
                    background: #fff;
                    border: 2px solid #000;
                    border-radius: 8px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .color-section-reset:hover {
                    background: #f5f5f5;
                }

                .color-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.25rem;
                }

                .color-item {
                    background: #fff;
                    padding: 1rem;
                    border-radius: 12px;
                    border: 2px solid #000;
                }

                .color-item-label {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 0.25rem;
                }

                .color-item-label label {
                    font-weight: 700;
                    font-size: 0.9rem;
                }

                .color-element-tag {
                    font-size: 0.65rem;
                    padding: 0.2rem 0.5rem;
                    background: #ffd400;
                    border-radius: 999px;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .color-item-desc {
                    font-size: 0.75rem;
                    opacity: 0.6;
                    margin: 0 0 0.75rem;
                }

                .color-input-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #f5f5f5;
                    padding: 0.35rem;
                    border-radius: 10px;
                    border: 2px solid #000;
                }

                .color-picker {
                    width: 36px;
                    height: 36px;
                    border: 2px solid #000;
                    border-radius: 8px;
                    cursor: pointer;
                    padding: 0;
                }

                .color-picker::-webkit-color-swatch-wrapper {
                    padding: 0;
                }

                .color-picker::-webkit-color-swatch {
                    border: none;
                    border-radius: 6px;
                }

                .color-text-input {
                    flex: 1;
                    padding: 0.5rem;
                    border: none;
                    background: transparent;
                    font-family: monospace;
                    font-size: 0.85rem;
                    font-weight: 600;
                }

                .color-text-input:focus {
                    outline: none;
                }

                .color-copy-btn {
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #fff;
                    border: 2px solid #000;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                }

                .color-copy-btn:hover {
                    background: #f5f5f5;
                }

                .color-preview-section {
                    background: #fff;
                    border-radius: 16px;
                    padding: 1.5rem;
                    border: 3px solid #000;
                }

                .color-preview-section h3 {
                    margin: 0 0 1rem;
                    font-size: 1.1rem;
                    font-weight: 800;
                }

                .color-preview-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1rem;
                }

                .color-preview-card {
                    padding: 1.5rem;
                    border-radius: 16px;
                    border: 3px solid;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .color-preview-card h4 {
                    margin: 0;
                    font-size: 1.2rem;
                }

                .color-preview-card p {
                    margin: 0;
                    font-size: 0.9rem;
                }
            `}</style>
        </div>
    );
}
