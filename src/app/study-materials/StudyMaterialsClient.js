"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function StudyMaterialsClient({ materials = [], categories = [] }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    const filteredMaterials = useMemo(() => {
        let result = materials;

        if (selectedCategory) {
            result = result.filter((m) => m.materialCategory?.name === selectedCategory || m.category === selectedCategory);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((m) =>
                m.title.toLowerCase().includes(query) ||
                (m.description && m.description.toLowerCase().includes(query)) ||
                m.category.toLowerCase().includes(query)
            );
        }

        result = [...result].sort((a, b) => {
            switch (sortBy) {
                case "oldest":
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case "az":
                    return a.title.localeCompare(b.title);
                case "za":
                    return b.title.localeCompare(a.title);
                case "newest":
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        return result;
    }, [materials, selectedCategory, searchQuery, sortBy]);

    const getViewerIcon = (viewerType) => {
        switch (viewerType) {
            case "s3": return "☁️";
            case "drive": return "📁";
            default: return "📄";
        }
    };

    const getViewerLabel = (viewerType) => {
        switch (viewerType) {
            case "s3": return "Cloud View";
            case "drive": return "Drive Link";
            default: return "PDF Viewer";
        }
    };

    return (
        <div className="brutal-page">
            <div className="brutal-hero" style={{ background: "#ffd400", borderBottom: "4px solid #000" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "3rem 1.5rem", textAlign: "center" }}>
                    <span style={{ display: "inline-block", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "0.5rem", opacity: 0.7 }}>📚 Free Study Resources</span>
                    <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.02em", margin: "0 0 0.5rem", color: "#000" }}>PDF Study Materials</h1>
                    <p style={{ fontSize: "1.1rem", opacity: 0.8, margin: 0, color: "#000" }}>Download and study free PDF notes for all courses</p>
                </div>
            </div>

            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "260px 1fr" }, gap: "2rem" }}>
                    <aside className="brutal-card" style={{ position: { xs: "static", md: "sticky" }, top: "140px", height: "fit-content" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "3px solid #000" }}>
                            <span style={{ fontSize: "1.25rem" }}>📋</span>
                            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, textTransform: "uppercase" }}>Categories</h3>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <button
                                onClick={() => setSelectedCategory(null)}
                                style={{
                                    display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem",
                                    background: !selectedCategory ? "#ffd400" : "transparent",
                                    border: !selectedCategory ? "2px solid #000" : "2px solid transparent",
                                    borderRadius: "12px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600,
                                    textAlign: "left", boxShadow: !selectedCategory ? "3px 3px 0 #000" : "none",
                                    transition: "all 0.2s ease"
                                }}
                            >
                                <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffd400", border: "2px solid #000", flexShrink: 0 }} />
                                <span style={{ flex: 1 }}>All Materials</span>
                                <span style={{ background: "#000", color: "#fff", padding: "0.15rem 0.5rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700 }}>{materials.length}</span>
                            </button>
                            {categories.map((cat) => {
                                const count = materials.filter((m) => m.materialCategory?.name === cat.name || m.category === cat.name).length;
                                if (count === 0) return null;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        style={{
                                            display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem",
                                            background: selectedCategory === cat.name ? "#ffd400" : "transparent",
                                            border: selectedCategory === cat.name ? "2px solid #000" : "2px solid transparent",
                                            borderRadius: "12px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600,
                                            textAlign: "left", boxShadow: selectedCategory === cat.name ? "3px 3px 0 #000" : "none",
                                            transition: "all 0.2s ease"
                                        }}
                                    >
                                        <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: cat.color || "#6366f1", border: "2px solid #000", flexShrink: 0 }} />
                                        <span style={{ flex: 1 }}>{cat.name}</span>
                                        <span style={{ background: "#000", color: "#fff", padding: "0.15rem 0.5rem", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700 }}>{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    <div>
                        <div style={{ marginBottom: "1.5rem" }}>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "1rem" }}>Explore by Category</h2>
                            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                                <div style={{ position: "relative", flex: "1 1 300px" }}>
                                    <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.2rem" }}>🔍</span>
                                    <input
                                        type="text"
                                        placeholder="Search materials..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "0.75rem 1rem 0.75rem 3rem",
                                            border: "4px solid #000",
                                            borderRadius: "16px",
                                            fontSize: "1rem",
                                            outline: "none",
                                        }}
                                    />
                                </div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    style={{
                                        padding: "0.75rem 1rem",
                                        border: "4px solid #000",
                                        borderRadius: "16px",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        background: "#fff",
                                    }}
                                >
                                    <option value="newest">🕐 Newest First</option>
                                    <option value="oldest">📅 Oldest First</option>
                                    <option value="az">🔤 A to Z</option>
                                    <option value="za">🔤 Z to A</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.5rem" }}>
                            <p style={{ margin: 0, fontSize: "0.9rem" }}>
                                Showing <strong style={{ color: "#ffd400", fontWeight: 800 }}>{filteredMaterials.length}</strong> of <strong style={{ color: "#ffd400", fontWeight: 800 }}>{materials.length}</strong> materials
                            </p>
                            {selectedCategory && (
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    style={{
                                        padding: "0.4rem 0.8rem", background: "#000", color: "#ffd400",
                                        border: "2px solid #000", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700,
                                        cursor: "pointer", boxShadow: "3px 3px 0 #ffd400"
                                    }}
                                >
                                    Clear ✕
                                </button>
                            )}
                        </div>

                        {filteredMaterials.length > 0 ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                                {filteredMaterials.map((material) => (
                                    <div key={material.id} className="brutal-card-hover">
                                        <div style={{ position: "relative", aspectRatio: "16/9", background: "linear-gradient(135deg, #1a1a2e, #16213e)", overflow: "hidden" }}>
                                            {material.thumbnail ? (
                                                <img src={material.thumbnail} alt={material.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            ) : (
                                                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#ffd400", padding: "1rem" }}>
                                                    <span style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📄</span>
                                                    <p style={{ fontSize: "0.8rem", fontWeight: 700, textAlign: "center", margin: 0 }}>{material.title.slice(0, 30)}</p>
                                                </div>
                                            )}
                                            <div style={{ position: "absolute", top: "12px", right: "12px", padding: "0.4rem 0.75rem", background: "rgba(0,0,0,0.8)", color: "#fff", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 700, backdropFilter: "blur(4px)" }}>
                                                {getViewerIcon(material.viewerType)} {getViewerLabel(material.viewerType)}
                                            </div>
                                        </div>
                                        <div style={{ padding: "1.25rem" }}>
                                            <span style={{ display: "inline-block", padding: "0.25rem 0.75rem", background: material.materialCategory?.color || "#ffd400", color: "#000", borderRadius: "999px", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", border: "2px solid #000", marginBottom: "0.75rem" }}>
                                                {material.materialCategory?.name || material.category}
                                            </span>
                                            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 0.5rem", lineHeight: 1.3 }}>{material.title}</h3>
                                            {material.description && (
                                                <p style={{ fontSize: "0.85rem", color: "#666", margin: "0 0 0.75rem", lineHeight: 1.5 }}>{material.description}</p>
                                            )}
                                            {material.course && (
                                                <p style={{ fontSize: "0.8rem", margin: "0 0 1rem" }}>
                                                    <Link href={`/courses/${material.course.slug}`} style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>
                                                        📚 {material.course.title}
                                                    </Link>
                                                </p>
                                            )}
                                            <div style={{ display: "flex", gap: "0.75rem", paddingTop: "1rem", borderTop: "3px solid #000" }}>
                                                <a href={material.pdfUrl} target="_blank" rel="noreferrer" className="brutal-btn brutal-btn-primary" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                                                    📖 View PDF
                                                </a>
                                                <a href={material.pdfUrl} download className="brutal-btn brutal-btn-secondary" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                                                    ⬇ Download
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="brutal-empty">
                                <span style={{ fontSize: "4rem", display: "block", marginBottom: "1rem" }}>📭</span>
                                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 0.5rem" }}>No materials found</h3>
                                <p style={{ color: "#666", margin: "0 0 1.5rem" }}>
                                    {searchQuery ? "Try a different search term" : "Try selecting a different category"}
                                </p>
                                <button onClick={() => { setSelectedCategory(null); setSearchQuery(""); }} className="brutal-btn brutal-btn-primary">
                                    Show All Materials
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
