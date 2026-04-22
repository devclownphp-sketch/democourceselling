"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TrustedByStats({ siteSettings = {} }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const studentsCount = siteSettings.statsStudentsCount || "40K+";
    const rating = siteSettings.statsRating || "4.7";
    const monthlyCount = siteSettings.statsMonthly || "150K+";
    const googleReviewUrl = siteSettings.googleReviewUrl || "#";

    if (loading) {
        return (
            <section className="trust-section trust-loading">
                <div className="trust-container">
                    <div className="trust-header">
                        <h2 className="trust-title">Trusted by Students</h2>
                    </div>
                    <div className="brutal-trust-grid">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="trust-skeleton" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="trust-section">
            <div className="trust-container">
                <div className="trust-header">
                    <span className="trust-badge">Stats & Recognition</span>
                    <h2 className="trust-title">Trusted by Students</h2>
                </div>

                <div className="brutal-trust-grid">
                    <div className="brutal-trust-main-card">
                        <div className="trust-main-content">
                            <span className="trust-big-number">{studentsCount}</span>
                            <span className="trust-label">Students</span>
                            <div className="trust-tags">
                                {["Verified", "Active", "Learning"].map((tag) => (
                                    <span key={tag} className="trust-tag">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="brutal-trust-right-cards">
                        <div className="brutal-trust-card-small brutal-trust-card-verified">
                            <div className="trust-card-header">
                                <div className="trust-check-icon">✓</div>
                                <div>
                                    <p className="trust-card-title">Verified Platform</p>
                                    <p className="trust-card-subtitle">Authenticated by Google</p>
                                </div>
                            </div>
                            <p className="trust-card-desc">Secure content delivery & privacy focused</p>
                        </div>

                        <div className="brutal-trust-card-small brutal-trust-card-rating">
                            <div className="trust-rating-display">
                                <span className="trust-rating-number">{rating}</span>
                                <div className="trust-stars-container">
                                    <span className="trust-stars">★★★★★</span>
                                    <span className="trust-rated-label">Rated</span>
                                </div>
                            </div>
                        </div>

                        <div className="brutal-trust-card-small brutal-trust-card-monthly">
                            <div>
                                <p className="trust-monthly-number">{monthlyCount}</p>
                                <p className="trust-monthly-label">Monthly Views</p>
                            </div>
                        </div>

                        <div className="brutal-trust-card-small brutal-trust-card-trust">
                            <div className="trust-shield-display">
                                <div className="trust-shield-icon">🛡️</div>
                                <div>
                                    <p className="trust-shield-title">100% Free</p>
                                    <p className="trust-shield-subtitle">No hidden charges</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="trust-cta">
                    <a href={googleReviewUrl} target="_blank" rel="noreferrer" className="trust-google-btn">
                        <span>⭐</span>
                        <span>Review Us on Google</span>
                        <span>↗</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
