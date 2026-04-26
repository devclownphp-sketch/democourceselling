"use client";

import Link from "next/link";

export default function BlogCard({ blog }) {
    const excerpt = blog.excerpt || (blog.content ? blog.content.substring(0, 120) + "..." : "");
    const date = new Date(blog.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
    });

    return (
        <Link
            href={`/blog/${blog.slug}`}
            style={{
                display: "block",
                background: "#fff",
                border: "4px solid #000",
                borderRadius: "20px",
                overflow: "hidden",
                textDecoration: "none",
                color: "#000",
                boxShadow: "6px 6px 0 #000",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-3px, -3px)";
                e.currentTarget.style.boxShadow = "9px 9px 0 #000";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0, 0)";
                e.currentTarget.style.boxShadow = "6px 6px 0 #000";
            }}
        >
            {blog.coverImage && (
                <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                    <img
                        src={blog.coverImage}
                        alt={blog.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>
            )}
            <div style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <span style={{
                        fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase",
                        padding: "0.2rem 0.5rem", background: "#ffd400",
                        borderRadius: "6px", color: "#000",
                    }}>
                        {blog.category || "Article"}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "#888" }}>{date}</span>
                </div>
                <h3 style={{
                    fontSize: "1.1rem", fontWeight: 800, margin: "0 0 0.5rem",
                    color: "#000", lineHeight: 1.3,
                }}>
                    {blog.title}
                </h3>
                <p style={{
                    fontSize: "0.9rem", color: "#555", lineHeight: 1.5,
                    margin: 0, display: "-webkit-box", WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                    {excerpt}
                </p>
            </div>
        </Link>
    );
}
