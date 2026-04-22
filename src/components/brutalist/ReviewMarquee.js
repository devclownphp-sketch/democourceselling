"use client";

import { useState, useEffect } from "react";

export default function ReviewMarquee({ reviews = [], siteSettings = {} }) {
    const [settings, setSettings] = useState({ speed: 30, direction: "ltr", isEnabled: true });

    const allReviews = reviews.length > 0 ? reviews : [];
    const displayReviews = allReviews.filter((r) => r.isFeatured || r.isActive);

    useEffect(() => {
        async function loadSettings() {
            try {
                const res = await fetch("/api/public/marquee-settings");
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data.settings || { speed: 30, direction: "ltr", isEnabled: true });
                }
            } catch (e) {
                console.error("Failed to load marquee settings:", e);
            }
        }
        loadSettings();
    }, []);

    if (!settings.isEnabled || displayReviews.length === 0) return null;

    const duration = (settings.speed || 30) * 2;
    const direction = settings.direction === "rtl" ? "reverse" : "normal";

    return (
        <section className="marquee-section">
            <div className="marquee-wrapper">
                <div className="marquee-track" style={{
                    animationDuration: `${duration}s`,
                    animationDirection: direction,
                }}>
                    {[...displayReviews, ...displayReviews].map((review, index) => (
                        <div key={`${review.id}-${index}`} className="marquee-card">
                            <div className="marquee-card-inner">
                                {review.avatar ? (
                                    <div className="marquee-avatar-img">
                                        <img src={review.avatar} alt={review.name} />
                                    </div>
                                ) : (
                                    <div className="marquee-avatar">
                                        {review.name?.charAt(0)?.toUpperCase() || "S"}
                                    </div>
                                )}
                                <div className="marquee-content">
                                    <div className="marquee-stars">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i} style={{ color: i < review.rating ? "#ffd400" : "#555" }}>★</span>
                                        ))}
                                    </div>
                                    <p className="marquee-text">
                                        {review.marqueeText || review.quote || review.reviewText?.slice(0, 80)}
                                    </p>
                                    <div className="marquee-author">
                                        <strong>{review.name}</strong>
                                        <span>{review.role}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}