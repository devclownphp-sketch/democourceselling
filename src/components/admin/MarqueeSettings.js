"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function MarqueeSettings() {
    const [settings, setSettings] = useState({ speed: 30, direction: "ltr", isEnabled: true });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        async function loadSettings() {
            try {
                const res = await fetch("/api/admin/marquee-settings");
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data.settings);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: "", text: "" });
        try {
            const res = await fetch("/api/admin/marquee-settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                setMessage({ type: "success", text: "Settings saved!" });
            } else {
                throw new Error("Failed to save");
            }
        } catch (e) {
            setMessage({ type: "error", text: "Failed to save settings" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="panel">Loading...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="panel"
        >
            <h3>Review Marquee Settings</h3>
            <p className="muted-text">Configure the student reviews marquee animation on the home page.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1.5rem" }}>
                {/* Enable Toggle */}
                <label style={{ display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
                    <input
                        type="checkbox"
                        checked={settings.isEnabled}
                        onChange={(e) => setSettings((s) => ({ ...s, isEnabled: e.target.checked }))}
                        style={{ width: "24px", height: "24px", cursor: "pointer" }}
                    />
                    <span style={{ fontWeight: 600 }}>
                        Enable Marquee Animation
                    </span>
                </label>

                {/* Speed Slider */}
                <div>
                    <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                        <span style={{ fontWeight: 600 }}>Animation Speed</span>
                        <span style={{ color: "#666" }}>{settings.speed} seconds</span>
                    </label>
                    <input
                        type="range"
                        min="10"
                        max="60"
                        value={settings.speed}
                        onChange={(e) => setSettings((s) => ({ ...s, speed: parseInt(e.target.value) }))}
                        style={{ width: "100%", accentColor: "#000" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#666", marginTop: "0.25rem" }}>
                        <span>Faster (10s)</span>
                        <span>Slower (60s)</span>
                    </div>
                </div>

                {/* Direction Toggle */}
                <div>
                    <label style={{ fontWeight: 600, marginBottom: "0.75rem", display: "block" }}>Scroll Direction</label>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <button
                            onClick={() => setSettings((s) => ({ ...s, direction: "ltr" }))}
                            style={{
                                flex: 1,
                                padding: "0.75rem",
                                background: settings.direction === "ltr" ? "#000" : "#fff",
                                color: settings.direction === "ltr" ? "#fff" : "#000",
                                border: "4px solid #000",
                                borderRadius: "16px",
                                fontWeight: 700,
                                cursor: "pointer",
                                boxShadow: settings.direction === "ltr" ? "4px 4px 0 #000" : "none",
                            }}
                        >
                            ← Left to Right
                        </button>
                        <button
                            onClick={() => setSettings((s) => ({ ...s, direction: "rtl" }))}
                            style={{
                                flex: 1,
                                padding: "0.75rem",
                                background: settings.direction === "rtl" ? "#000" : "#fff",
                                color: settings.direction === "rtl" ? "#fff" : "#000",
                                border: "4px solid #000",
                                borderRadius: "16px",
                                fontWeight: 700,
                                cursor: "pointer",
                                boxShadow: settings.direction === "rtl" ? "4px 4px 0 #000" : "none",
                            }}
                        >
                            Right to Left →
                        </button>
                    </div>
                </div>

                {/* Preview */}
                <div style={{
                    padding: "1.5rem",
                    background: "#ffd400",
                    border: "4px solid #000",
                    borderRadius: "16px",
                }}>
                    <p style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.9rem" }}>Preview</p>
                    <div style={{
                        overflow: "hidden",
                        background: "#fff",
                        border: "4px solid #000",
                        borderRadius: "12px",
                        padding: "0.5rem",
                    }}>
                        <div style={{
                            display: "flex",
                            gap: "1rem",
                            animation: `marqueePreview ${settings.speed}s linear infinite`,
                            animationDirection: settings.direction === "rtl" ? "reverse" : "normal",
                        }}>
                            <span style={{ whiteSpace: "nowrap", fontWeight: 700 }}>Sample Review →</span>
                            <span style={{ whiteSpace: "nowrap", fontWeight: 700 }}>★★★★★</span>
                            <span style={{ whiteSpace: "nowrap", fontWeight: 700 }}>Another Review →</span>
                            <span style={{ whiteSpace: "nowrap", fontWeight: 700 }}>★★★★★</span>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        padding: "1rem 2rem",
                        background: "#000",
                        color: "#fff",
                        border: "4px solid #000",
                        borderRadius: "16px",
                        fontWeight: 700,
                        cursor: saving ? "not-allowed" : "pointer",
                        boxShadow: saving ? "none" : "4px 4px 0 #000",
                        opacity: saving ? 0.7 : 1,
                    }}
                >
                    {saving ? "Saving..." : "Save Settings"}
                </button>

                {message.text && (
                    <p style={{
                        color: message.type === "error" ? "#ef4444" : "#22c55e",
                        fontWeight: 600,
                    }}>
                        {message.text}
                    </p>
                )}
            </div>

            <style jsx>{`
                @keyframes marqueePreview {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </motion.div>
    );
}
