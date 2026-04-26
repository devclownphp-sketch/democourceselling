"use client";

import { useState, useEffect } from "react";

export default function ReviewMarquee({ reviews = [], siteSettings = {} }) {
    const [settings, setSettings] = useState({ speed: 20, direction: "ltr", isEnabled: true });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        async function loadSettings() {
            try {
                const res = await fetch("/api/public/marquee-settings");
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data.settings || { speed: 20, direction: "ltr", isEnabled: true });
                }
            } catch (e) {
                console.error("Failed to load marquee settings:", e);
            }
        }
        loadSettings();
    }, []);

    const displayReviews = reviews.filter((r) => r.isFeatured && r.isActive);
    const uniqueReviews = displayReviews.filter((review, index, self) =>
        index === self.findIndex((r) => r.id === review.id)
    );

    if (!mounted) return null;
    if (!settings.isEnabled || uniqueReviews.length === 0) return null;

    const shouldScroll = uniqueReviews.length > 3;
    const speed = Math.max(1, Math.min(60, settings.speed));
    const isRTL = settings.direction === "rtl";

    return (
        <section style={{
            padding: "3rem 0",
            background: "#0a0a0a",
            borderTop: "4px solid #ffd400",
            borderBottom: "4px solid #ffd400",
            overflow: "hidden",
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
                padding: "0 1.5rem",
            }}>
                <h2 style={{
                    fontSize: "1.5rem",
                    fontWeight: 900,
                    color: "#ffd400",
                    textTransform: "uppercase",
                    margin: 0,
                }}>
                    ⭐ Student Feedback
                </h2>
            </div>

            {shouldScroll ? (
                <div style={{ position: "relative", overflow: "hidden" }}>
                    <style>{`
                        @keyframes marqueeScrollLTR {
                            0% { transform: translateX(0); }
                            100% { transform: translateX(-50%); }
                        }
                        @keyframes marqueeScrollRTL {
                            0% { transform: translateX(-50%); }
                            100% { transform: translateX(0); }
                        }
                        .marquee-track {
                            display: flex;
                            gap: 1.5rem;
                            width: max-content;
                        }
                        .marquee-track-ltr {
                            animation: marqueeScrollLTR ${speed}s linear infinite;
                        }
                        .marquee-track-rtl {
                            animation: marqueeScrollRTL ${speed}s linear infinite;
                        }
                        .marquee-card {
                            flex-shrink: 0;
                            width: 320px;
                        }
                    `}</style>

                    <div className={`marquee-track ${isRTL ? "marquee-track-rtl" : "marquee-track-ltr"}`}>
                        {[...uniqueReviews, ...uniqueReviews].map((review, index) => (
                            <div key={`${review.id}-${index}`} className="marquee-card">
                                <ReviewCard review={review} />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{
                    display: "flex",
                    gap: "1.5rem",
                    padding: "0 1.5rem",
                    justifyContent: "center",
                    flexWrap: "wrap",
                }}>
                    {uniqueReviews.map((review) => (
                        <div key={review.id} style={{ width: "320px", flexShrink: 0 }}>
                            <ReviewCard review={review} />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

function ReviewCard({ review }) {
    return (
        <div style={{
            background: "#1a1a2e",
            border: "3px solid #ffd400",
            borderRadius: "16px",
            padding: "1.5rem",
            height: "100%",
            boxShadow: "4px 4px 0 #ffd400",
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                {review.avatar ? (
                    <div style={{
                        width: "48px", height: "48px", borderRadius: "50%",
                        overflow: "hidden", border: "3px solid #ffd400",
                    }}>
                        <img src={review.avatar} alt={review.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                ) : (
                    <div style={{
                        width: "48px", height: "48px", borderRadius: "50%",
                        background: "#ffd400", color: "#000",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 900, fontSize: "1.2rem", border: "3px solid #000",
                    }}>
                        {review.name?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                )}
                <div>
                    <strong style={{ color: "#fff", display: "block" }}>{review.name}</strong>
                    <span style={{ color: "#888", fontSize: "0.8rem" }}>{review.role}</span>
                </div>
            </div>
            <div style={{ color: "#ffd400", fontSize: "1rem", marginBottom: "0.5rem" }}>
                {"★".repeat(5)}
            </div>
            <p style={{ color: "#ccc", fontSize: "0.9rem", lineHeight: 1.5, margin: 0 }}>
                {review.marqueeText || review.quote || review.reviewText?.slice(0, 100)}
            </p>
        </div>
    );
}