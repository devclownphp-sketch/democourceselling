"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function BlogCard({ blog }) {
    const [hovered, setHovered] = useState(false);

    return (
        <article
            className="blog-card"
            style={{
                backgroundColor: "#fff",
                borderRadius: "0.75rem",
                overflow: "hidden",
                boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.15)" : "0 1px 3px rgba(0,0,0,0.1)",
                transition: "transform 0.3s, box-shadow 0.3s",
                transform: hovered ? "translateY(-4px)" : "translateY(0)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {blog.featuredImage && (
                <Image
                    src={blog.featuredImage}
                    alt={blog.title}
                    width={1200}
                    height={800}
                    unoptimized
                    style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                    }}
                />
            )}
            <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ marginBottom: "0.5rem", fontSize: "1.25rem", fontWeight: 600 }}>
                    {blog.title}
                </h3>
                <p style={{ color: "#6b7280", marginBottom: "1rem", flex: 1 }}>
                    {blog.excerpt}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid #e5e7eb", fontSize: "0.875rem", color: "#9ca3af" }}>
                    <span>by {blog.admin?.username || "Unknown"}</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                <Link
                    href={`/blog/${blog.slug}`}
                    style={{
                        display: "inline-block",
                        marginTop: "1rem",
                        color: "#6366f1",
                        textDecoration: "none",
                        fontWeight: 500,
                        transition: "color 0.3s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#4f46e5")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#6366f1")}
                >
                    Read More →
                </Link>
            </div>
        </article>
    );
}
