"use client";

import Link from "next/link";

export default function CourseCard({ course }) {
    const {
        title = "",
        slug = "",
        courseImage = "",
        duration = "",
        rating = 4.5,
        originalPrice = 0,
        offerPrice = 0,
        discountPercent = 0,
        courseType,
        level = "Beginner",
    } = course;

    const hasImage = Boolean(courseImage);

    return (
        <Link
            href={`/courses/${slug}`}
            className="brutal-course-card"
            style={{ textDecoration: "none", display: "block" }}
        >
            {/* Image Area */}
            <div
                className="brutal-course-card-image"
                style={{
                    backgroundImage: hasImage ? `url(${courseImage})` : "none",
                    background: hasImage ? "none" : "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Gradient overlay for text readability */}
                {!hasImage && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "1rem",
                        }}
                    >
                        <CourseIcon category={courseType?.name || title} />
                    </div>
                )}

                {/* Badges */}
                <div className="brutal-course-card-badges">
                    <span
                        style={{
                            background: "#22c55e",
                            color: "#fff",
                            padding: "0.3rem 0.7rem",
                            borderRadius: "999px",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            border: "2px solid #000",
                        }}
                    >
                        {courseType?.name || "General"}
                    </span>
                    <span
                        style={{
                            background: "#ffd400",
                            color: "#000",
                            padding: "0.3rem 0.7rem",
                            borderRadius: "999px",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            border: "2px solid #000",
                        }}
                    >
                        {level}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="brutal-course-card-content">
                {/* Title */}
                <h3 className="brutal-course-card-title">
                    {title}
                </h3>

                {/* Rating */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.5rem" }}>
                    <span style={{ color: "#ffd400", fontWeight: 700 }}>
                        {Number(rating).toFixed(1)}
                    </span>
                    <span style={{ color: "#ffd400" }}>★★★★★</span>
                    <span style={{ color: "#666", fontSize: "0.8rem", marginLeft: "0.25rem" }}>
                        ({Number(rating).toFixed(1)})
                    </span>
                </div>

                {/* Duration */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", color: "#666", fontSize: "0.85rem" }}>
                    <span>⏱️ {duration}</span>
                </div>

                {/* Price */}
                <div className="brutal-course-card-price">
                    <span className="brutal-course-card-price-current">
                        ₹{Number(offerPrice).toFixed(0)}
                    </span>
                    {Number(originalPrice) > Number(offerPrice) && (
                        <>
                            <span className="brutal-course-card-price-original">
                                ₹{Number(originalPrice).toFixed(0)}
                            </span>
                            {discountPercent > 0 && (
                                <span className="brutal-course-card-price-discount">
                                    {discountPercent}% OFF
                                </span>
                            )}
                        </>
                    )}
                </div>

                {/* CTA */}
                <div
                    style={{
                        marginTop: "1rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontWeight: 700,
                        color: "#000",
                        fontSize: "0.9rem",
                    }}
                >
                    View Details →
                </div>
            </div>
        </Link>
    );
}

function CourseIcon({ category = "" }) {
    const cat = category.toLowerCase();

    if (cat.includes("computer") || cat.includes("basic")) {
        return (
            <svg viewBox="0 0 100 100" style={{ width: "80px", height: "80px", opacity: 0.3 }}>
                <rect x="15" y="15" width="70" height="50" rx="5" fill="#6366f1" />
                <rect x="20" y="20" width="60" height="35" fill="#0a0a0a" />
                <rect x="35" y="70" width="30" height="5" rx="2" fill="#6366f1" />
                <rect x="25" y="77" width="50" height="8" rx="3" fill="#6366f1" />
            </svg>
        );
    }

    if (cat.includes("design") || cat.includes("graphic")) {
        return (
            <svg viewBox="0 0 100 100" style={{ width: "80px", height: "80px", opacity: 0.3 }}>
                <ellipse cx="50" cy="50" rx="35" ry="30" fill="#ec4899" />
                <circle cx="35" cy="45" r="8" fill="#ef4444" />
                <circle cx="50" cy="35" r="8" fill="#3b82f6" />
                <circle cx="65" cy="45" r="8" fill="#22c55e" />
                <circle cx="50" cy="55" r="6" fill="#f59e0b" />
                <circle cx="40" cy="58" r="6" fill="#a855f7" />
            </svg>
        );
    }

    if (cat.includes("web") || cat.includes("code") || cat.includes("programming")) {
        return (
            <svg viewBox="0 0 100 100" style={{ width: "80px", height: "80px", opacity: 0.3 }}>
                <rect x="10" y="20" width="80" height="60" rx="8" fill="#1e1e1e" />
                <rect x="18" y="28" width="30" height="4" rx="2" fill="#10b981" />
                <rect x="18" y="38" width="45" height="4" rx="2" fill="#3b82f6" />
                <rect x="18" y="48" width="35" height="4" rx="2" fill="#f59e0b" />
                <rect x="18" y="58" width="25" height="4" rx="2" fill="#ec4899" />
                <rect x="18" y="68" width="50" height="4" rx="2" fill="#10b981" />
            </svg>
        );
    }

    if (cat.includes("data") || cat.includes("analytics") || cat.includes("excel")) {
        return (
            <svg viewBox="0 0 100 100" style={{ width: "80px", height: "80px", opacity: 0.3 }}>
                <rect x="15" y="65" width="12" height="20" rx="2" fill="#6366f1" />
                <rect x="32" y="50" width="12" height="35" rx="2" fill="#8b5cf6" />
                <rect x="49" y="35" width="12" height="50" rx="2" fill="#a855f7" />
                <rect x="66" y="45" width="12" height="40" rx="2" fill="#6366f1" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 100 100" style={{ width: "80px", height: "80px", opacity: 0.3 }}>
            <path d="M20 15 L20 80 C20 85 25 85 30 80 L30 25 C30 22 27 20 25 20 Z" fill="#6366f1" />
            <rect x="30" y="20" width="55" height="60" rx="2" fill="#6366f1" />
            <path d="M85 25 L85 80 C85 85 80 85 75 80 L75 20 C75 17 78 15 80 15 L85 20 Z" fill="#4f46e5" />
        </svg>
    );
}
