"use client";

import { useState, useEffect } from "react";
import ReviewManager from "@/components/admin/ReviewManager";
import { motion } from "framer-motion";

function MarqueeSettingsPanel() {
    const [settings, setSettings] = useState({ speed: 30, direction: "ltr", isEnabled: true, minReviewsForAuto: 3 });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

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

    useEffect(() => {
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
                setTimeout(() => setMessage({ type: "", text: "" }), 3000);
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
        return <div className="panel"><p>Loading settings...</p></div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="panel"
        >
            <h3>Review Marquee Settings</h3>
            <p style={{ color: "#666", marginTop: "0.25rem", marginBottom: "1.5rem" }}>
                Configure the student reviews marquee animation on the home page.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
                    <input
                        type="checkbox"
                        checked={settings.isEnabled}
                        onChange={(e) => setSettings((s) => ({ ...s, isEnabled: e.target.checked }))}
                        style={{ width: "22px", height: "22px", cursor: "pointer", accentColor: "#000" }}
                    />
                    <span style={{ fontWeight: 600 }}>Enable Marquee Animation</span>
                </label>

                <div>
                    <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                        <span style={{ fontWeight: 600 }}>Animation Speed</span>
                        <span style={{ color: "#666" }}>{settings.speed} seconds</span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="60"
                        value={settings.speed}
                        onChange={(e) => setSettings((s) => ({ ...s, speed: parseInt(e.target.value) }))}
                        style={{ width: "100%", accentColor: "#000" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#666", marginTop: "0.25rem" }}>
                        <span>Fastest (1s)</span>
                        <span>Slowest (60s)</span>
                    </div>
                </div>

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
                            animationName: "marqueePreview",
                            animationDuration: `${settings.speed}s`,
                            animationTimingFunction: "linear",
                            animationIterationCount: "infinite",
                            animationDirection: settings.direction === "rtl" ? "reverse" : "normal",
                        }}>
                            <span style={{ whiteSpace: "nowrap", fontWeight: 700 }}>Sample Review →</span>
                            <span style={{ whiteSpace: "nowrap", fontWeight: 700 }}>★★★★★</span>
                            <span style={{ whiteSpace: "nowrap", fontWeight: 700 }}>Another Review →</span>
                            <span style={{ whiteSpace: "nowrap", fontWeight: 700 }}>★★★★★</span>
                        </div>
                    </div>
                </div>

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

            <style>{`
                @keyframes marqueePreview {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </motion.div>
    );
}

export default function AdminReviewsPage() {
    const [activeTab, setActiveTab] = useState("reviews");

    const tabs = [
        { id: "reviews", label: "Reviews", icon: "★" },
        { id: "settings", label: "Marquee Settings", icon: "⚙" },
    ];

    return (
        <div className="stack-lg">
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: "0.75rem 1.5rem",
                            background: activeTab === tab.id ? "#ffd400" : "#fff",
                            color: activeTab === tab.id ? "#000" : "#000",
                            border: "4px solid #000",
                            borderRadius: "16px",
                            fontWeight: 700,
                            cursor: "pointer",
                            boxShadow: activeTab === tab.id ? "4px 4px 0 #000" : "none",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "reviews" && <ReviewsTabWrapper />}
            {activeTab === "settings" && <MarqueeSettingsPanel />}
        </div>
    );
}

function ReviewsTabWrapper() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadReviews() {
            try {
                const res = await fetch("/api/admin/reviews");
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data.reviews || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadReviews();
    }, []);

    if (loading) {
        return <div className="panel"><p>Loading reviews...</p></div>;
    }

    return <ReviewManager initialReviews={reviews} googleReviewUrl={process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "https://www.google.com"} />;
}