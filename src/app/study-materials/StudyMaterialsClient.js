"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

async function downloadFile(url, filename) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Download failed");
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename || "document.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
        window.open(url, "_blank");
    }
}

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
            case "s3": return "Cloud";
            case "drive": return "Drive";
            default: return "PDF";
        }
    };

    const allMaterialsCount = materials.length;

    return (
        <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
            <div style={{
                background: "linear-gradient(135deg, #ffd400 0%, #ffe066 50%, #ffd400 100%)",
                borderBottom: "4px solid #000",
                padding: "2rem 1.5rem 1.75rem",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "4px",
                    background: "repeating-linear-gradient(90deg, #000 0, #000 8px, transparent 8px, transparent 16px)",
                }} />
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                    <span style={{ display: "inline-block", fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "0.25rem", color: "#000", opacity: 0.5 }}>📚 Free Resources</span>
                    <h1 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 900, margin: 0, color: "#000", textTransform: "uppercase", letterSpacing: "-0.02em" }}>PDF Study Materials</h1>
                </div>
            </div>

            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", marginRight: "0.25rem" }}>📋 Categories:</span>
                        <button
                            onClick={() => setSelectedCategory(null)}
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.35rem 0.75rem",
                                background: !selectedCategory ? "#ffd400" : "#fff",
                                border: !selectedCategory ? "2px solid #000" : "2px solid #ddd",
                                borderRadius: "999px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
                                boxShadow: !selectedCategory ? "2px 2px 0 #000" : "none",
                                transition: "all 0.2s ease", whiteSpace: "nowrap"
                            }}
                        >
                            All
                            <span style={{ background: "#000", color: "#fff", padding: "0.05rem 0.35rem", borderRadius: "999px", fontSize: "0.6rem", fontWeight: 700 }}>{allMaterialsCount}</span>
                        </button>
                        {categories.map((cat) => {
                            const count = materials.filter((m) => m.materialCategory?.name === cat.name || m.category === cat.name).length;
                            if (count === 0) return null;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.35rem 0.75rem",
                                        background: selectedCategory === cat.name ? "#ffd400" : "#fff",
                                        border: selectedCategory === cat.name ? "2px solid #000" : "2px solid #ddd",
                                        borderRadius: "999px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
                                        boxShadow: selectedCategory === cat.name ? "2px 2px 0 #000" : "none",
                                        transition: "all 0.2s ease", whiteSpace: "nowrap"
                                    }}
                                >
                                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: cat.color || "#6366f1", border: "1.5px solid #000", flexShrink: 0 }} />
                                    {cat.name}
                                    <span style={{ background: "#000", color: "#fff", padding: "0.05rem 0.35rem", borderRadius: "999px", fontSize: "0.6rem", fontWeight: 700 }}>{count}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
                            <div style={{ position: "relative", flex: "0 0 200px" }}>
                                <span style={{ position: "absolute", left: "0.6rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.8rem" }}>🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "0.4rem 0.6rem 0.4rem 2rem",
                                        border: "3px solid #000",
                                        borderRadius: "10px",
                                        fontSize: "0.8rem",
                                        outline: "none",
                                    }}
                                />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    padding: "0.4rem 0.6rem",
                                    border: "3px solid #000",
                                    borderRadius: "10px",
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    background: "#fff",
                                }}
                            >
                                <option value="newest">🕐 Newest</option>
                                <option value="oldest">📅 Oldest</option>
                                <option value="az">🔤 A-Z</option>
                                <option value="za">🔤 Z-A</option>
                            </select>
                            {selectedCategory && (
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    style={{
                                        padding: "0.3rem 0.6rem", background: "#000", color: "#ffd400",
                                        border: "2px solid #000", borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700,
                                        cursor: "pointer"
                                    }}
                                >
                                    Clear ✕
                                </button>
                            )}
                        </div>

                        {filteredMaterials.length > 0 ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                                {filteredMaterials.map((material) => (
                                    <div key={material.id} className="brutal-card-hover" style={{ padding: "0" }}>
                                        <div style={{ position: "relative", aspectRatio: "16/9", background: "linear-gradient(135deg, #1a1a2e, #16213e)", overflow: "hidden" }}>
                                            {material.thumbnail ? (
                                                <img src={material.thumbnail} alt={material.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            ) : (
                                                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#ffd400", padding: "0.75rem" }}>
                                                    <span style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>📄</span>
                                                    <p style={{ fontSize: "0.7rem", fontWeight: 700, textAlign: "center", margin: 0 }}>{material.title.slice(0, 25)}</p>
                                                </div>
                                            )}
                                            <div style={{ position: "absolute", top: "8px", right: "8px", padding: "0.25rem 0.5rem", background: "rgba(0,0,0,0.8)", color: "#fff", borderRadius: "999px", fontSize: "0.6rem", fontWeight: 700 }}>
                                                {getViewerIcon(material.viewerType)} {getViewerLabel(material.viewerType)}
                                            </div>
                                        </div>
                                        <div style={{ padding: "1rem" }}>
                                            <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", background: material.materialCategory?.color || "#ffd400", color: "#000", borderRadius: "999px", fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", border: "2px solid #000", marginBottom: "0.5rem" }}>
                                                {material.materialCategory?.name || material.category}
                                            </span>
                                            <h3 style={{ fontSize: "1rem", fontWeight: 800, margin: "0 0 0.5rem", lineHeight: 1.3 }}>{material.title}</h3>
                                            {material.description && (
                                                <p style={{ fontSize: "0.8rem", color: "#666", margin: "0 0 0.75rem", lineHeight: 1.4 }}>{material.description}</p>
                                            )}
                                            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                                                <Link href={`/study-materials/${material.id}`} className="brutal-btn brutal-btn-primary" style={{ flex: 1, padding: "0.5rem", fontSize: "0.8rem", textAlign: "center" }}>
                                                    View
                                                </Link>
                                                <button onClick={() => downloadFile(material.pdfUrl, material.title + ".pdf")} className="brutal-btn brutal-btn-secondary" style={{ flex: 1, padding: "0.5rem", fontSize: "0.8rem" }}>
                                                    Download
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="brutal-empty" style={{ padding: "2rem" }}>
                                <span style={{ fontSize: "3rem", display: "block", marginBottom: "0.75rem" }}>📭</span>
                                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.5rem" }}>No materials found</h3>
                                <button onClick={() => { setSelectedCategory(null); setSearchQuery(""); }} className="brutal-btn brutal-btn-primary">
                                    Show All
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}